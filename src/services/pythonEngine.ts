export interface PythonExecutionResult {
  success: boolean;
  stdout: string;
  outputLines: string[];
  executionTimeMs: number;
  error?: string;
  errorType?: string;
  errorHint?: string;
  debugHint?: string;
}

export const PYTHON_ANALYTICS_PRELUDE = `import math

class _NumPyLite:
    def array(self, items):
        return list(items)
    def sum(self, items):
        return sum(items)
    def mean(self, items):
        if not items: return 0.0
        return round(float(sum(items)) / len(items), 4)
    def median(self, items):
        if not items: return 0.0
        s = sorted(items)
        n = len(s)
        mid = n // 2
        if n % 2 == 1:
            return float(s[mid])
        return round((s[mid - 1] + s[mid]) / 2.0, 4)
    def var(self, items, ddof=0):
        if len(items) <= ddof: return 0.0
        m = sum(items) / float(len(items))
        return round(sum((x - m) ** 2 for x in items) / float(len(items) - ddof), 4)
    def std(self, items, ddof=0):
        return round(math.sqrt(self.var(items, ddof)), 4)
    def min(self, items):
        return min(items)
    def max(self, items):
        return max(items)
    def percentile(self, items, q):
        if not items: return 0.0
        s = sorted(items)
        pos = (len(s) - 1) * (q / 100.0)
        base = int(math.floor(pos))
        rest = pos - base
        if base + 1 < len(s):
            return round(s[base] + rest * (s[base + 1] - s[base]), 4)
        return float(s[base])
    def iqr(self, items):
        return round(self.percentile(items, 75) - self.percentile(items, 25), 4)
    def corrcoef(self, x, y):
        n = min(len(x), len(y))
        if n < 2: return 0.0
        mx = sum(x[:n]) / float(n)
        my = sum(y[:n]) / float(n)
        num = sum((x[i] - mx) * (y[i] - my) for i in range(n))
        dx = sum((x[i] - mx) ** 2 for i in range(n))
        dy = sum((y[i] - my) ** 2 for i in range(n))
        den = math.sqrt(dx * dy)
        return round(num / den, 4) if den != 0 else 0.0

np = _NumPyLite()

class DataFrame:
    def __init__(self, rows):
        self.rows = [dict(r) for r in rows]
        cols = list(self.rows[0].keys()) if self.rows else []
        self.columns = cols
        self.shape = (len(self.rows), len(cols))
    def __len__(self):
        return len(self.rows)
    def __repr__(self):
        if not self.rows:
            return "Empty DataFrame"
        lines = [" | ".join(str(k) for k in self.columns)]
        for r in self.rows:
            lines.append(" | ".join(str(r.get(k)) for k in self.columns))
        return "\\n".join(lines)
    def head(self, n=5):
        return DataFrame(self.rows[:n])
    def col(self, col_name):
        return [r.get(col_name) for r in self.rows if r.get(col_name) is not None]
    def describe(self, col_name):
        vals = self.col(col_name)
        return {
            "count": len(vals),
            "mean": np.mean(vals),
            "median": np.median(vals),
            "std": np.std(vals, 1),
            "min": np.min(vals) if vals else 0,
            "max": np.max(vals) if vals else 0
        }
    def filter_eq(self, col_name, val):
        return DataFrame([r for r in self.rows if r.get(col_name) == val])
    def groupby_agg(self, group_col, val_col, fn="sum"):
        groups = {}
        for r in self.rows:
            k = r.get(group_col)
            v = r.get(val_col)
            if v is not None:
                if k not in groups:
                    groups[k] = []
                groups[k].append(float(v))
        result = {}
        for k, arr in groups.items():
            if fn == "sum":
                result[k] = round(sum(arr), 2)
            elif fn == "mean" or fn == "avg":
                result[k] = np.mean(arr)
            elif fn == "count":
                result[k] = len(arr)
            else:
                result[k] = round(sum(arr), 2)
        return result

orders_data = [
    {"order_id": 1001, "region": "North America", "category": "Electronics", "units": 2, "revenue": 1360.0, "cost": 780.0, "profit": 580.0},
    {"order_id": 1002, "region": "Europe", "category": "Home Office", "units": 1, "revenue": 520.0, "cost": 280.0, "profit": 240.0},
    {"order_id": 1003, "region": "Asia Pacific", "category": "Accessories", "units": 3, "revenue": 720.0, "cost": 330.0, "profit": 390.0},
    {"order_id": 1004, "region": "North America", "category": "Software", "units": 1, "revenue": 490.0, "cost": 50.0, "profit": 440.0},
    {"order_id": 1005, "region": "Europe", "category": "Software", "units": 2, "revenue": 980.0, "cost": 100.0, "profit": 880.0},
    {"order_id": 1006, "region": "North America", "category": "Electronics", "units": 2, "revenue": 1380.0, "cost": 1411.0, "profit": -31.0},
    {"order_id": 1007, "region": "Europe", "category": "Accessories", "units": 2, "revenue": 440.0, "cost": 680.0, "profit": -240.0},
    {"order_id": 1008, "region": "Asia Pacific", "category": "Home Office", "units": 1, "revenue": 390.0, "cost": 590.0, "profit": -200.0}
]

employees_data = [
    {"emp_id": 1, "name": "Aarav Mehta", "dept": "Data Science", "salary": 145000, "tenure_yrs": 4.2, "rating": 4.9},
    {"emp_id": 2, "name": "Elena Rostova", "dept": "Data Science", "salary": 125000, "tenure_yrs": 2.8, "rating": 4.5},
    {"emp_id": 3, "name": "Marcus Vance", "dept": "Engineering", "salary": 140000, "tenure_yrs": 5.0, "rating": 4.7},
    {"emp_id": 4, "name": "Chloe Park", "dept": "Engineering", "salary": 118000, "tenure_yrs": 2.1, "rating": 4.2},
    {"emp_id": 5, "name": "Nadia Sterling", "dept": "Product", "salary": 130000, "tenure_yrs": 3.6, "rating": 4.6},
    {"emp_id": 6, "name": "Julian Cruz", "dept": "Sales", "salary": 98000, "tenure_yrs": 2.5, "rating": 4.1}
]
`;

const PRELUDE_LINE_COUNT = PYTHON_ANALYTICS_PRELUDE.split('\n').length;

const getSkulptInstance = async (): Promise<any> => {
  if (typeof window !== 'undefined' && (window as any).Sk) {
    return (window as any).Sk;
  }
  if (typeof globalThis !== 'undefined' && (globalThis as any).Sk) {
    return (globalThis as any).Sk;
  }

  try {
    const fs = await import('node:fs');
    const path = await import('node:path');
    const vm = await import('node:vm');

    const skulptMinPath = path.resolve(process.cwd(), 'public/skulpt.min.js');
    const skulptStdPath = path.resolve(process.cwd(), 'public/skulpt-stdlib.js');

    const minCode = fs.readFileSync(skulptMinPath, 'utf-8');
    const stdCode = fs.readFileSync(skulptStdPath, 'utf-8');

    vm.runInThisContext(minCode);
    vm.runInThisContext(stdCode);

    return (globalThis as any).Sk;
  } catch (err) {
    throw new Error(`Skulpt runtime could not be loaded: ${err}`);
  }
};

export const diagnosePythonError = (errorMsg: string): string => {
  const lower = errorMsg.toLowerCase();
  if (lower.includes('syntaxerror')) {
    return 'SyntaxError: Check for missing colons (:) at the end of if/for/def lines, unmatched parentheses, or inconsistent indentation.';
  }
  if (lower.includes('nameerror')) {
    return 'NameError: You referenced a variable or function name before defining it, or misspelled an identifier (Python is case-sensitive).';
  }
  if (lower.includes('typeerror')) {
    return 'TypeError: You combined incompatible data types (e.g. adding a string and an integer without str() or int() conversion).';
  }
  if (lower.includes('keyerror')) {
    return 'KeyError: The dictionary key you requested does not exist. Check spelling or use .get("key") for safe access.';
  }
  if (lower.includes('indexerror')) {
    return 'IndexError: List index is out of range. Remember Python lists are 0-indexed (0 to len(list) - 1).';
  }
  if (lower.includes('zerodivisionerror')) {
    return 'ZeroDivisionError: Division by zero detected. Guard your denominator with an if check before dividing.';
  }
  if (lower.includes('timelimiterror') || lower.includes('time limit')) {
    return 'TimeLimitError: Code execution exceeded the 4-second safety limit. Check for infinite while loops.';
  }
  return 'Inspect the line number and error message above to verify variable types and indentation.';
};

export const executePythonCode = async (
  userCode: string,
  includePrelude: boolean = true
): Promise<PythonExecutionResult> => {
  const trimmed = userCode.trim();
  const startTime = performance.now();

  if (!trimmed) {
    const hint = 'Use print() to display calculation results in the output console.';
    return {
      success: false,
      stdout: '',
      outputLines: [],
      executionTimeMs: 0,
      error: 'Code editor is empty. Enter Python code and click Run.',
      errorType: 'EmptyCode',
      errorHint: hint,
      debugHint: hint,
    };
  }

  try {
    const Sk = await getSkulptInstance();
    let capturedOutput = '';

    Sk.configure({
      output: (text: string) => {
        capturedOutput += text;
      },
      read: (filename: string) => {
        if (
          Sk.builtinFiles === undefined ||
          Sk.builtinFiles['files'][filename] === undefined
        ) {
          throw new Error(`File not found: '${filename}'`);
        }
        return Sk.builtinFiles['files'][filename];
      },
      execLimit: 4000,
      __future__: Sk.python3,
    });

    const fullProgram = includePrelude
      ? `${PYTHON_ANALYTICS_PRELUDE}\n${userCode}`
      : userCode;

    await Sk.misceval.asyncToPromise(() =>
      Sk.importMainWithBody('<stdin>', false, fullProgram, true)
    );

    const elapsed = Math.max(1, Math.round((performance.now() - startTime) * 10) / 10);
    const cleanedStdout = capturedOutput.replace(/\r\n/g, '\n').trimEnd();
    const outputLines = cleanedStdout ? cleanedStdout.split('\n') : [];

    return {
      success: true,
      stdout: cleanedStdout,
      outputLines,
      executionTimeMs: elapsed,
    };
  } catch (err: any) {
    const elapsed = Math.max(1, Math.round((performance.now() - startTime) * 10) / 10);
    let rawError = err ? err.toString() : 'Unknown Python Execution Error';

    if (includePrelude) {
      rawError = rawError.replace(/on line (\d+)/gi, (_match: string, lineStr: string) => {
        const reportedLine = parseInt(lineStr, 10);
        const userLine = Math.max(1, reportedLine - PRELUDE_LINE_COUNT);
        return `on line ${userLine}`;
      });
    }

    const errorTypeMatch = rawError.match(/^([A-Za-z]+Error):/);
    const errorType = errorTypeMatch ? errorTypeMatch[1] : 'RuntimeError';
    const hint = diagnosePythonError(rawError);

    return {
      success: false,
      stdout: '',
      outputLines: [],
      executionTimeMs: elapsed,
      error: rawError,
      errorType,
      errorHint: hint,
      debugHint: hint,
    };
  }
};
