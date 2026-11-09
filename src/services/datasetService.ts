import {
  DatasetColumnProfile,
  NumericColumnStats,
  PlaygroundDataset,
} from '../types/practice';
import { calculateDescriptiveStats } from './statisticsEngine';

export const PRELOADED_PLAYGROUND_DATASETS: PlaygroundDataset[] = [
  {
    id: 'ds-ecommerce-orders',
    name: 'Global E-Commerce Orders & Margins (Q1–Q2)',
    source: 'Preloaded Sample Dataset • Retail Analytics',
    description:
      'Order-level transaction logs across 4 global regions with revenue, discount rates, shipping costs, profit margins, and intentional missing discount entries for data hygiene inspection.',
    isUploaded: false,
    domainTag: 'E-Commerce & Retail',
    rows: [
      { order_id: 'ORD-1001', order_date: '2025-01-08', region: 'North America', category: 'Electronics', units: 3, revenue: 1450.0, discount_pct: 5, shipping_cost: 35.0, profit: 412.5, customer_segment: 'Enterprise' },
      { order_id: 'ORD-1002', order_date: '2025-01-12', region: 'Europe', category: 'Software', units: 10, revenue: 3200.0, discount_pct: 10, shipping_cost: 0.0, profit: 2480.0, customer_segment: 'Enterprise' },
      { order_id: 'ORD-1003', order_date: '2025-01-19', region: 'Asia Pacific', category: 'Accessories', units: 8, revenue: 420.0, discount_pct: null, shipping_cost: 28.0, profit: 145.0, customer_segment: 'Consumer' },
      { order_id: 'ORD-1004', order_date: '2025-01-25', region: 'North America', category: 'Home Office', units: 2, revenue: 880.0, discount_pct: 0, shipping_cost: 64.0, profit: 260.0, customer_segment: 'SMB' },
      { order_id: 'ORD-1005', order_date: '2025-02-03', region: 'Europe', category: 'Electronics', units: 5, revenue: 2150.0, discount_pct: 8, shipping_cost: 55.0, profit: 610.0, customer_segment: 'SMB' },
      { order_id: 'ORD-1006', order_date: '2025-02-11', region: 'Latin America', category: 'Accessories', units: 12, revenue: 540.0, discount_pct: 15, shipping_cost: 42.0, profit: 162.0, customer_segment: 'Consumer' },
      { order_id: 'ORD-1007', order_date: '2025-02-18', region: 'North America', category: 'Software', units: 25, revenue: 7500.0, discount_pct: 12, shipping_cost: 0.0, profit: 5850.0, customer_segment: 'Enterprise' },
      { order_id: 'ORD-1008', order_date: '2025-02-24', region: 'Asia Pacific', category: 'Electronics', units: 4, revenue: 1890.0, discount_pct: null, shipping_cost: 48.0, profit: 520.0, customer_segment: 'SMB' },
      { order_id: 'ORD-1009', order_date: '2025-03-04', region: 'Europe', category: 'Home Office', units: 6, revenue: 1620.0, discount_pct: 5, shipping_cost: 92.0, profit: 440.0, customer_segment: 'Consumer' },
      { order_id: 'ORD-1010', order_date: '2025-03-14', region: 'North America', category: 'Electronics', units: 1, revenue: 690.0, discount_pct: 0, shipping_cost: 22.0, profit: 215.0, customer_segment: 'Consumer' },
      { order_id: 'ORD-1011', order_date: '2025-03-21', region: 'Latin America', category: 'Software', units: 6, revenue: 1800.0, discount_pct: 5, shipping_cost: 0.0, profit: 1420.0, customer_segment: 'SMB' },
      { order_id: 'ORD-1012', order_date: '2025-03-29', region: 'Asia Pacific', category: 'Home Office', units: 3, revenue: 960.0, discount_pct: 20, shipping_cost: 70.0, profit: 118.0, customer_segment: 'Consumer' },
    ],
  },
  {
    id: 'ds-saas-retention',
    name: 'B2B SaaS Subscription & Churn Telemetry',
    source: 'Preloaded Sample Dataset • Product & Growth Analytics',
    description:
      'Account-level SaaS metrics tracking MRR, active seat utilization, support tickets, NPS score, and churn status across subscription tiers.',
    isUploaded: false,
    domainTag: 'SaaS & Product',
    rows: [
      { account_id: 'ACC-201', company: 'Vertex Labs', plan_tier: 'Enterprise', mrr_usd: 4200, active_users: 48, licensed_seats: 50, nps_score: 65, support_tickets_30d: 2, churned: false },
      { account_id: 'ACC-202', company: 'NovaFreight', plan_tier: 'Growth', mrr_usd: 950, active_users: 14, licensed_seats: 20, nps_score: 40, support_tickets_30d: 5, churned: false },
      { account_id: 'ACC-203', company: 'BluePeak Retail', plan_tier: 'Starter', mrr_usd: 290, active_users: 2, licensed_seats: 10, nps_score: -10, support_tickets_30d: 9, churned: true },
      { account_id: 'ACC-204', company: 'OmniHealth', plan_tier: 'Enterprise', mrr_usd: 5600, active_users: 62, licensed_seats: 65, nps_score: 72, support_tickets_30d: 1, churned: false },
      { account_id: 'ACC-205', company: 'PulseMedia', plan_tier: 'Growth', mrr_usd: 1100, active_users: 6, licensed_seats: 25, nps_score: 15, support_tickets_30d: 11, churned: true },
      { account_id: 'ACC-206', company: 'Kinetix AI', plan_tier: 'Enterprise', mrr_usd: 3800, active_users: 39, licensed_seats: 40, nps_score: 58, support_tickets_30d: 3, churned: false },
      { account_id: 'ACC-207', company: 'Cedar FinTech', plan_tier: 'Growth', mrr_usd: 1250, active_users: 22, licensed_seats: 25, nps_score: 50, support_tickets_30d: 2, churned: false },
      { account_id: 'ACC-208', company: 'Drift Logistics', plan_tier: 'Starter', mrr_usd: 310, active_users: 3, licensed_seats: 10, nps_score: null, support_tickets_30d: 7, churned: true },
      { account_id: 'ACC-209', company: 'Solaris Energy', plan_tier: 'Enterprise', mrr_usd: 6400, active_users: 78, licensed_seats: 80, nps_score: 80, support_tickets_30d: 1, churned: false },
      { account_id: 'ACC-210', company: 'Harbor Legal', plan_tier: 'Starter', mrr_usd: 350, active_users: 8, licensed_seats: 10, nps_score: 35, support_tickets_30d: 2, churned: false },
    ],
  },
  {
    id: 'ds-marketing-campaigns',
    name: 'Multi-Channel Acquisition & ROAS Attribution',
    source: 'Preloaded Sample Dataset • Marketing Analytics',
    description:
      'Campaign performance across Paid Search, LinkedIn, Organic SEO, Email, and Webinars with ad spend, impressions, clicks, conversions, and attributed revenue.',
    isUploaded: false,
    domainTag: 'Marketing & Growth',
    rows: [
      { campaign_id: 'CMP-01', channel: 'Paid Search', spend_usd: 12500, impressions: 185000, clicks: 7400, conversions: 296, revenue_usd: 53280 },
      { campaign_id: 'CMP-02', channel: 'LinkedIn Ads', spend_usd: 18000, impressions: 92000, clicks: 2300, conversions: 138, revenue_usd: 66240 },
      { campaign_id: 'CMP-03', channel: 'Email Nurture', spend_usd: 2200, impressions: 45000, clicks: 4950, conversions: 346, revenue_usd: 41520 },
      { campaign_id: 'CMP-04', channel: 'Display Retargeting', spend_usd: 8400, impressions: 310000, clicks: 3100, conversions: 62, revenue_usd: 9300 },
      { campaign_id: 'CMP-05', channel: 'Technical Webinars', spend_usd: 6500, impressions: 18000, clicks: 1980, conversions: 158, revenue_usd: 56880 },
      { campaign_id: 'CMP-06', channel: 'Social Video', spend_usd: 14200, impressions: 420000, clicks: 6300, conversions: 95, revenue_usd: 13300 },
      { campaign_id: 'CMP-07', channel: 'Organic SEO Content', spend_usd: 4800, impressions: 140000, clicks: 9800, conversions: 412, revenue_usd: 61800 },
    ],
  },
  {
    id: 'ds-people-analytics',
    name: 'Workforce Compensation, Tenure & Engagement',
    source: 'Preloaded Sample Dataset • People Analytics',
    description:
      'Employee records across Engineering, Data Science, Product, Sales, and Operations with base salary, tenure years, performance scores, and remote work ratios.',
    isUploaded: false,
    domainTag: 'People & HR Analytics',
    rows: [
      { emp_id: 'E-401', department: 'Data Science', level: 'L5 Senior', tenure_years: 4.2, salary_usd: 158000, performance_score: 4.8, training_hours: 42, attrition_risk: 'Low' },
      { emp_id: 'E-402', department: 'Engineering', level: 'L4 Mid', tenure_years: 2.5, salary_usd: 132000, performance_score: 4.1, training_hours: 28, attrition_risk: 'Low' },
      { emp_id: 'E-403', department: 'Sales', level: 'L3 Associate', tenure_years: 1.1, salary_usd: 88000, performance_score: 3.4, training_hours: 15, attrition_risk: 'High' },
      { emp_id: 'E-404', department: 'Product', level: 'L5 Senior', tenure_years: 5.0, salary_usd: 152000, performance_score: 4.6, training_hours: 36, attrition_risk: 'Low' },
      { emp_id: 'E-405', department: 'Engineering', level: 'L6 Staff', tenure_years: 6.4, salary_usd: 186000, performance_score: 4.9, training_hours: 48, attrition_risk: 'Low' },
      { emp_id: 'E-406', department: 'Operations', level: 'L3 Associate', tenure_years: 1.8, salary_usd: 79000, performance_score: 3.7, training_hours: null, attrition_risk: 'Medium' },
      { emp_id: 'E-407', department: 'Data Science', level: 'L4 Mid', tenure_years: 2.9, salary_usd: 138000, performance_score: 4.4, training_hours: 38, attrition_risk: 'Low' },
      { emp_id: 'E-408', department: 'Sales', level: 'L4 Mid', tenure_years: 3.3, salary_usd: 114000, performance_score: 4.2, training_hours: 22, attrition_risk: 'Medium' },
    ],
  },
];

export interface DatasetUploadValidationResult {
  valid: boolean;
  error?: string;
  dataset?: PlaygroundDataset;
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

function parseCsvLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

function coerceScalarValue(val: any): string | number | boolean | null {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return Number.isNaN(val) ? null : val;
  if (typeof val === 'boolean') return val;
  const trimmed = String(val).trim();
  if (trimmed === '' || /^null$/i.test(trimmed) || /^na$/i.test(trimmed) || /^n\/a$/i.test(trimmed)) {
    return null;
  }
  if (/^true$/i.test(trimmed)) return true;
  if (/^false$/i.test(trimmed)) return false;
  const num = Number(trimmed);
  if (!Number.isNaN(num) && trimmed !== '') {
    return num;
  }
  return trimmed;
}

export function validateAndParseDatasetFile(
  fileName: string,
  fileContent: string,
  fileSizeBytes: number = fileContent.length
): DatasetUploadValidationResult {
  const cleanName = fileName.trim();
  const lower = cleanName.toLowerCase();

  if (!lower.endsWith('.csv') && !lower.endsWith('.json')) {
    return {
      valid: false,
      error: `Unsupported file format "${fileName}". Please upload a valid .csv or .json dataset file.`,
    };
  }

  if (fileSizeBytes > MAX_UPLOAD_BYTES) {
    return {
      valid: false,
      error: `File size (${(fileSizeBytes / (1024 * 1024)).toFixed(2)} MB) exceeds the 5.00 MB limit for browser analysis.`,
    };
  }

  if (!fileContent || fileContent.trim().length === 0) {
    return {
      valid: false,
      error: `The uploaded file "${fileName}" is empty. Please provide a file with header columns and data rows.`,
    };
  }

  if (lower.endsWith('.json')) {
    try {
      const parsed = JSON.parse(fileContent);
      const rawArray = Array.isArray(parsed)
        ? parsed
        : parsed && Array.isArray(parsed.data)
        ? parsed.data
        : parsed && Array.isArray(parsed.rows)
        ? parsed.rows
        : null;

      if (!rawArray || rawArray.length === 0) {
        return {
          valid: false,
          error:
            'Invalid JSON dataset structure. Expected a non-empty JSON array of row objects (e.g. [{"col": 1}, ...]).',
        };
      }

      if (typeof rawArray[0] !== 'object' || rawArray[0] === null || Array.isArray(rawArray[0])) {
        return {
          valid: false,
          error: 'Each item in the JSON array must be a key-value row object.',
        };
      }

      const normalizedRows = rawArray.slice(0, 2000).map((row: Record<string, any>) => {
        const cleanRow: Record<string, any> = {};
        for (const [k, v] of Object.entries(row)) {
          cleanRow[k.trim()] = coerceScalarValue(v);
        }
        return cleanRow;
      });

      return {
        valid: true,
        dataset: {
          id: `uploaded-${Date.now()}`,
          name: cleanName.replace(/\.json$/i, ''),
          source: `User Uploaded JSON (${cleanName})`,
          description: `Custom uploaded JSON dataset containing ${normalizedRows.length} rows.`,
          isUploaded: true,
          uploadedAt: new Date().toISOString().split('T')[0],
          domainTag: 'Custom Upload',
          rows: normalizedRows,
        },
      };
    } catch (err: any) {
      return {
        valid: false,
        error: `Malformed JSON file: ${err?.message || 'Unable to parse JSON syntax.'}`,
      };
    }
  }

  // CSV parsing & validation
  const lines = fileContent
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0);

  if (lines.length < 2) {
    return {
      valid: false,
      error: 'CSV file must contain at least a header row and one data row.',
    };
  }

  const headers = parseCsvLine(lines[0]).map((h) => h.replace(/^"|"$/g, '').trim());
  if (headers.length === 0 || headers.some((h) => h === '')) {
    return {
      valid: false,
      error: 'Malformed CSV header row: one or more column names are blank.',
    };
  }

  const rows: Record<string, any>[] = [];
  for (let i = 1; i < Math.min(lines.length, 2001); i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length !== headers.length) {
      return {
        valid: false,
        error: `Malformed CSV at line ${i + 1}: expected ${headers.length} columns (${headers.join(
          ', '
        )}), but found ${values.length} values.`,
      };
    }
    const rowObj: Record<string, any> = {};
    for (let c = 0; c < headers.length; c++) {
      rowObj[headers[c]] = coerceScalarValue(values[c]);
    }
    rows.push(rowObj);
  }

  return {
    valid: true,
    dataset: {
      id: `uploaded-${Date.now()}`,
      name: cleanName.replace(/\.csv$/i, ''),
      source: `User Uploaded CSV (${cleanName})`,
      description: `Custom uploaded CSV dataset with ${rows.length} rows and ${headers.length} columns.`,
      isUploaded: true,
      uploadedAt: new Date().toISOString().split('T')[0],
      domainTag: 'Custom Upload',
      rows,
    },
  };
}

export function profileDatasetColumns(rows: Record<string, any>[]): DatasetColumnProfile[] {
  if (!rows || rows.length === 0) return [];
  const columnNames = Array.from(
    new Set(rows.flatMap((r) => Object.keys(r)))
  );

  return columnNames.map((col) => {
    const totalCount = rows.length;
    let missingCount = 0;
    const nonNullValues: any[] = [];

    for (const r of rows) {
      const v = r[col];
      if (v === null || v === undefined || v === '') {
        missingCount++;
      } else {
        nonNullValues.push(v);
      }
    }

    let inferredType: 'number' | 'string' | 'boolean' | 'date' = 'string';
    if (nonNullValues.length > 0) {
      const allNumbers = nonNullValues.every((v) => typeof v === 'number' && !Number.isNaN(v));
      const allBooleans = nonNullValues.every((v) => typeof v === 'boolean');
      const allDates =
        !allNumbers &&
        !allBooleans &&
        nonNullValues.every(
          (v) =>
            typeof v === 'string' &&
            /^\d{4}-\d{2}-\d{2}/.test(v) &&
            !Number.isNaN(Date.parse(v))
        );

      if (allNumbers) inferredType = 'number';
      else if (allBooleans) inferredType = 'boolean';
      else if (allDates) inferredType = 'date';
    }

    const uniqueCount = new Set(nonNullValues.map((v) => String(v))).size;
    const sampleValues = nonNullValues.slice(0, 4);

    return {
      name: col,
      type: inferredType,
      totalCount,
      missingCount,
      missingPercent: Math.round((missingCount / totalCount) * 1000) / 10,
      uniqueCount,
      sampleValues,
    };
  });
}

export function computeDatasetNumericStats(rows: Record<string, any>[]): NumericColumnStats[] {
  const profiles = profileDatasetColumns(rows);
  const numericCols = profiles.filter((p) => p.type === 'number');

  return numericCols.map((colProfile) => {
    const nums: number[] = [];
    let missing = 0;
    for (const r of rows) {
      const v = r[colProfile.name];
      if (typeof v === 'number' && !Number.isNaN(v)) {
        nums.push(v);
      } else {
        missing++;
      }
    }

    const desc = calculateDescriptiveStats(nums);
    return {
      column: colProfile.name,
      count: desc.count,
      missing,
      mean: desc.mean,
      median: desc.median,
      mode: desc.mode,
      min: desc.min,
      max: desc.max,
      range: desc.range,
      variance: desc.sampleVariance,
      stdDev: desc.sampleStdDev,
      q1: desc.q1,
      q3: desc.q3,
      iqr: desc.iqr,
    };
  });
}
