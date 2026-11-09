export interface DescriptiveStatsSummary {
  count: number;
  sum: number;
  mean: number;
  median: number;
  mode: number | null;
  min: number;
  max: number;
  range: number;
  sampleVariance: number;
  populationVariance: number;
  sampleStdDev: number;
  populationStdDev: number;
  q1: number;
  q3: number;
  iqr: number;
  lowerOutlierFence: number;
  upperOutlierFence: number;
  outliers: number[];
}

export interface ConfidenceIntervalResult {
  mean: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
  standardError: number;
  zCritical: number;
}

export interface HypothesisTestResult {
  tStatistic: number;
  pValueApprox: number;
  rejectNullAt05: boolean;
  interpretation: string;
}

function round4(n: number): number {
  return Math.round(n * 10000) / 10000;
}

export function calculatePercentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  if (sorted.length === 1) return sorted[0];
  const clamped = Math.max(0, Math.min(100, p)) / 100;
  const pos = (sorted.length - 1) * clamped;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] !== undefined) {
    return round4(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
  }
  return round4(sorted[base]);
}

export function calculateDescriptiveStats(values: number[]): DescriptiveStatsSummary {
  const clean = values.filter((v) => typeof v === 'number' && !Number.isNaN(v) && Number.isFinite(v));
  const count = clean.length;
  if (count === 0) {
    return {
      count: 0,
      sum: 0,
      mean: 0,
      median: 0,
      mode: null,
      min: 0,
      max: 0,
      range: 0,
      sampleVariance: 0,
      populationVariance: 0,
      sampleStdDev: 0,
      populationStdDev: 0,
      q1: 0,
      q3: 0,
      iqr: 0,
      lowerOutlierFence: 0,
      upperOutlierFence: 0,
      outliers: [],
    };
  }

  const sorted = [...clean].sort((a, b) => a - b);
  const sum = round4(clean.reduce((a, b) => a + b, 0));
  const mean = round4(sum / count);

  const mid = Math.floor(count / 2);
  const median =
    count % 2 === 0 ? round4((sorted[mid - 1] + sorted[mid]) / 2) : round4(sorted[mid]);

  // Mode (most frequent value if freq > 1)
  const freqMap = new Map<number, number>();
  let maxFreq = 0;
  let modeVal: number | null = null;
  for (const v of sorted) {
    const f = (freqMap.get(v) || 0) + 1;
    freqMap.set(v, f);
    if (f > maxFreq && f > 1) {
      maxFreq = f;
      modeVal = v;
    }
  }

  const min = sorted[0];
  const max = sorted[count - 1];
  const range = round4(max - min);

  const sqDiffSum = clean.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
  const populationVariance = round4(sqDiffSum / count);
  const sampleVariance = count > 1 ? round4(sqDiffSum / (count - 1)) : 0;
  const populationStdDev = round4(Math.sqrt(sqDiffSum / count));
  const sampleStdDev = count > 1 ? round4(Math.sqrt(sqDiffSum / (count - 1))) : 0;

  const q1 = calculatePercentile(sorted, 25);
  const q3 = calculatePercentile(sorted, 75);
  const iqr = round4(q3 - q1);
  const lowerOutlierFence = round4(q1 - 1.5 * iqr);
  const upperOutlierFence = round4(q3 + 1.5 * iqr);
  const outliers = sorted.filter((v) => v < lowerOutlierFence || v > upperOutlierFence);

  return {
    count,
    sum,
    mean,
    median,
    mode: modeVal,
    min,
    max,
    range,
    sampleVariance,
    populationVariance,
    sampleStdDev,
    populationStdDev,
    q1,
    q3,
    iqr,
    lowerOutlierFence,
    upperOutlierFence,
    outliers,
  };
}

export function calculatePearsonCorrelation(x: number[], y: number[]): number {
  const n = Math.min(x.length, y.length);
  if (n < 2) return 0;

  const xSlice = x.slice(0, n);
  const ySlice = y.slice(0, n);

  const meanX = xSlice.reduce((a, b) => a + b, 0) / n;
  const meanY = ySlice.reduce((a, b) => a + b, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = xSlice[i] - meanX;
    const dy = ySlice[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const denom = Math.sqrt(denX * denY);
  if (denom === 0) return 0;
  return round4(num / denom);
}

export function calculateZScore(value: number, mean: number, stdDev: number): number {
  if (stdDev === 0) return 0;
  return round4((value - mean) / stdDev);
}

export function calculateConfidenceInterval(
  mean: number,
  sampleStdDev: number,
  sampleSize: number,
  confidenceLevel: 0.90 | 0.95 | 0.99 = 0.95
): ConfidenceIntervalResult {
  const zMap: Record<number, number> = {
    0.9: 1.645,
    0.95: 1.96,
    0.99: 2.576,
  };
  const zCritical = zMap[confidenceLevel] || 1.96;
  const standardError = sampleSize > 0 ? sampleStdDev / Math.sqrt(sampleSize) : 0;
  const marginOfError = zCritical * standardError;

  return {
    mean: round4(mean),
    marginOfError: round4(marginOfError),
    lowerBound: round4(mean - marginOfError),
    upperBound: round4(mean + marginOfError),
    standardError: round4(standardError),
    zCritical,
  };
}

function normalCdf(z: number): number {
  // Abramowitz & Stegun approximation for Standard Normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

export function performTwoSampleTTest(
  mean1: number,
  sd1: number,
  n1: number,
  mean2: number,
  sd2: number,
  n2: number
): HypothesisTestResult {
  const se = Math.sqrt((sd1 * sd1) / n1 + (sd2 * sd2) / n2);
  if (se === 0) {
    return {
      tStatistic: 0,
      pValueApprox: 1,
      rejectNullAt05: false,
      interpretation: 'Zero standard error; cannot compute test statistic.',
    };
  }
  const tStat = (mean1 - mean2) / se;
  const pVal = Math.max(0.0001, round4(2 * (1 - normalCdf(Math.abs(tStat)))));
  const reject = pVal < 0.05;

  return {
    tStatistic: round4(tStat),
    pValueApprox: pVal,
    rejectNullAt05: reject,
    interpretation: reject
      ? `Since p = ${pVal} < 0.05 (|t| = ${Math.abs(round4(tStat))}), we reject the null hypothesis (H₀). The difference between the two groups is statistically significant at α = 0.05.`
      : `Since p = ${pVal} ≥ 0.05 (|t| = ${Math.abs(round4(tStat))}), we fail to reject the null hypothesis (H₀). The observed difference could reasonably be due to random sampling variation.`,
  };
}
