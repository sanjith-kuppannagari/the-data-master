export interface CellEvalResult {
  value: string | number | boolean;
  isFormula: boolean;
  errorCode?: '#NAME?' | '#VALUE!' | '#DIV/0!' | '#N/A' | '#REF!' | '#ERROR!';
  errorHint?: string;
}

const KNOWN_FUNCTIONS = new Set([
  'SUM',
  'AVERAGE',
  'AVG',
  'COUNT',
  'COUNTA',
  'MIN',
  'MAX',
  'IF',
  'SUMIF',
  'COUNTIF',
  'VLOOKUP',
  'XLOOKUP',
  'UPPER',
  'LOWER',
  'TRIM',
  'LEN',
  'LEFT',
  'RIGHT',
  'CONCAT',
  'ROUND',
  'ABS',
  'YEAR',
  'MONTH',
  'DAY',
]);

function colLetterToIndex(col: string): number {
  const clean = col.replace(/\$/g, '').toUpperCase();
  let index = 0;
  for (let i = 0; i < clean.length; i++) {
    index = index * 26 + (clean.charCodeAt(i) - 64);
  }
  return index - 1;
}

function indexToColLetter(index: number): string {
  let col = '';
  let n = index + 1;
  while (n > 0) {
    const rem = (n - 1) % 26;
    col = String.fromCharCode(65 + rem) + col;
    n = Math.floor((n - 1) / 26);
  }
  return col;
}

export function normalizeCellRef(ref: string): string {
  return ref.replace(/\$/g, '').trim().toUpperCase();
}

export function expandCellRange(rangeStr: string): string[] {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return [];
  const startMatch = normalizeCellRef(parts[0]).match(/^([A-Z]+)(\d+)$/);
  const endMatch = normalizeCellRef(parts[1]).match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return [];

  const startCol = colLetterToIndex(startMatch[1]);
  const endCol = colLetterToIndex(endMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);

  const cMin = Math.min(startCol, endCol);
  const cMax = Math.max(startCol, endCol);
  const rMin = Math.min(startRow, endRow);
  const rMax = Math.max(startRow, endRow);

  const refs: string[] = [];
  for (let r = rMin; r <= rMax; r++) {
    for (let c = cMin; c <= cMax; c++) {
      refs.push(`${indexToColLetter(c)}${r}`);
    }
  }
  return refs;
}

export function expandCellRange2D(rangeStr: string): string[][] {
  const parts = rangeStr.split(':');
  if (parts.length !== 2) return [];
  const startMatch = normalizeCellRef(parts[0]).match(/^([A-Z]+)(\d+)$/);
  const endMatch = normalizeCellRef(parts[1]).match(/^([A-Z]+)(\d+)$/);
  if (!startMatch || !endMatch) return [];

  const startCol = colLetterToIndex(startMatch[1]);
  const endCol = colLetterToIndex(endMatch[1]);
  const startRow = parseInt(startMatch[2], 10);
  const endRow = parseInt(endMatch[2], 10);

  const cMin = Math.min(startCol, endCol);
  const cMax = Math.max(startCol, endCol);
  const rMin = Math.min(startRow, endRow);
  const rMax = Math.max(startRow, endRow);

  const matrix: string[][] = [];
  for (let r = rMin; r <= rMax; r++) {
    const rowRefs: string[] = [];
    for (let c = cMin; c <= cMax; c++) {
      rowRefs.push(`${indexToColLetter(c)}${r}`);
    }
    matrix.push(rowRefs);
  }
  return matrix;
}

function splitTopLevelArgs(argStr: string): string[] {
  const args: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;

  for (let i = 0; i < argStr.length; i++) {
    const ch = argStr[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      current += ch;
    } else if (!inQuotes && ch === '(') {
      depth++;
      current += ch;
    } else if (!inQuotes && ch === ')') {
      depth--;
      current += ch;
    } else if (!inQuotes && depth === 0 && ch === ',') {
      args.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) {
    args.push(current.trim());
  }
  return args;
}

function parseRawScalar(raw: string | number | boolean | undefined): string | number | boolean {
  if (raw === undefined || raw === null) return '';
  if (typeof raw === 'number' || typeof raw === 'boolean') return raw;
  const trimmed = String(raw).trim();
  if (trimmed === '') return '';
  if (/^true$/i.test(trimmed)) return true;
  if (/^false$/i.test(trimmed)) return false;
  const num = Number(trimmed);
  if (!Number.isNaN(num) && trimmed !== '') return num;
  return trimmed;
}

function matchesSpreadsheetCriteria(cellVal: string | number | boolean, criteriaRaw: string | number | boolean): boolean {
  const critStr = String(criteriaRaw).replace(/^"|"$/g, '').trim();
  const opMatch = critStr.match(/^(>=|<=|<>|>|<|=)(.*)$/);
  if (opMatch) {
    const op = opMatch[1];
    const rhsRaw = opMatch[2].trim();
    const rhsNum = Number(rhsRaw);
    const cellNum = Number(cellVal);
    const bothNumeric = !Number.isNaN(rhsNum) && rhsRaw !== '' && !Number.isNaN(cellNum) && String(cellVal) !== '';

    if (bothNumeric) {
      if (op === '>') return cellNum > rhsNum;
      if (op === '<') return cellNum < rhsNum;
      if (op === '>=') return cellNum >= rhsNum;
      if (op === '<=') return cellNum <= rhsNum;
      if (op === '=') return cellNum === rhsNum;
      if (op === '<>') return cellNum !== rhsNum;
    } else {
      const a = String(cellVal).toLowerCase();
      const b = rhsRaw.toLowerCase();
      if (op === '=') return a === b;
      if (op === '<>') return a !== b;
      if (op === '>') return a > b;
      if (op === '<') return a < b;
      if (op === '>=') return a >= b;
      if (op === '<=') return a <= b;
    }
  }

  const critNum = Number(critStr);
  const cellNum = Number(cellVal);
  if (!Number.isNaN(critNum) && critStr !== '' && !Number.isNaN(cellNum) && String(cellVal) !== '') {
    return cellNum === critNum;
  }
  return String(cellVal).toLowerCase() === critStr.toLowerCase();
}

export function evaluateSpreadsheetCell(
  cellRef: string,
  grid: Record<string, string | number>,
  visited: Set<string> = new Set()
): CellEvalResult {
  const normRef = normalizeCellRef(cellRef);
  if (visited.has(normRef)) {
    return {
      value: '#REF!',
      isFormula: true,
      errorCode: '#REF!',
      errorHint: `Circular cell reference detected involving ${normRef}.`,
    };
  }

  const raw = grid[normRef];
  if (raw === undefined || raw === null || raw === '') {
    return { value: '', isFormula: false };
  }

  if (typeof raw === 'number') {
    return { value: raw, isFormula: false };
  }

  const str = String(raw).trim();
  if (!str.startsWith('=')) {
    return { value: parseRawScalar(str), isFormula: false };
  }

  const nextVisited = new Set(visited);
  nextVisited.add(normRef);

  const expr = str.slice(1).trim();
  return evaluateExpression(expr, grid, nextVisited);
}

export function evaluateFormulaString(
  formulaOrValue: string,
  grid: Record<string, string | number>
): CellEvalResult {
  const trimmed = formulaOrValue.trim();
  if (!trimmed.startsWith('=')) {
    return { value: parseRawScalar(trimmed), isFormula: false };
  }
  return evaluateExpression(trimmed.slice(1).trim(), grid, new Set());
}

function getCellValue(ref: string, grid: Record<string, string | number>, visited: Set<string>): CellEvalResult {
  const norm = normalizeCellRef(ref);
  const match = norm.match(/^([A-Z]+)(\d+)$/);
  if (!match) {
    return {
      value: '#REF!',
      isFormula: true,
      errorCode: '#REF!',
      errorHint: `Invalid cell reference "${ref}".`,
    };
  }
  const rowNum = parseInt(match[2], 10);
  if (rowNum < 1 || rowNum > 500) {
    return {
      value: '#REF!',
      isFormula: true,
      errorCode: '#REF!',
      errorHint: `Cell reference "${ref}" is out of grid bounds.`,
    };
  }
  return evaluateSpreadsheetCell(norm, grid, visited);
}

function resolveArgsToFlatValues(
  args: string[],
  grid: Record<string, string | number>,
  visited: Set<string>
): { values: (string | number | boolean)[]; error?: CellEvalResult } {
  const values: (string | number | boolean)[] = [];
  for (const arg of args) {
    if (arg.includes(':') && !arg.startsWith('"')) {
      const refs = expandCellRange(arg);
      if (refs.length === 0) {
        return {
          values: [],
          error: {
            value: '#REF!',
            isFormula: true,
            errorCode: '#REF!',
            errorHint: `Invalid cell range "${arg}". Use format like B2:B8.`,
          },
        };
      }
      for (const r of refs) {
        const res = getCellValue(r, grid, visited);
        if (res.errorCode) return { values: [], error: res };
        values.push(res.value);
      }
    } else {
      const res = evaluateExpression(arg, grid, visited);
      if (res.errorCode) return { values: [], error: res };
      values.push(res.value);
    }
  }
  return { values };
}

function evaluateFunctionCall(
  funcNameRaw: string,
  argsStr: string,
  grid: Record<string, string | number>,
  visited: Set<string>
): CellEvalResult {
  const fn = funcNameRaw.trim().toUpperCase();
  if (!KNOWN_FUNCTIONS.has(fn)) {
    return {
      value: '#NAME?',
      isFormula: true,
      errorCode: '#NAME?',
      errorHint: `Unknown spreadsheet function "${funcNameRaw}". Supported functions include SUM, AVERAGE, COUNT, COUNTA, MIN, MAX, IF, SUMIF, COUNTIF, VLOOKUP, XLOOKUP, ROUND, UPPER, LOWER, TRIM, LEN, LEFT, RIGHT.`,
    };
  }

  const args = splitTopLevelArgs(argsStr);

  if (fn === 'SUM') {
    const resolved = resolveArgsToFlatValues(args, grid, visited);
    if (resolved.error) return resolved.error;
    let sum = 0;
    for (const v of resolved.values) {
      if (v === '' || typeof v === 'boolean') continue;
      const num = Number(v);
      if (Number.isNaN(num)) {
        // Ignore text labels in ranges, but if passed directly as scalar literal error out
        continue;
      }
      sum += num;
    }
    return { value: Math.round(sum * 10000) / 10000, isFormula: true };
  }

  if (fn === 'AVERAGE' || fn === 'AVG') {
    const resolved = resolveArgsToFlatValues(args, grid, visited);
    if (resolved.error) return resolved.error;
    const nums = resolved.values
      .filter((v) => v !== '' && typeof v !== 'boolean' && !Number.isNaN(Number(v)))
      .map((v) => Number(v));
    if (nums.length === 0) {
      return {
        value: '#DIV/0!',
        isFormula: true,
        errorCode: '#DIV/0!',
        errorHint: 'AVERAGE requires at least one numeric cell in the specified range.',
      };
    }
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    return { value: Math.round(avg * 10000) / 10000, isFormula: true };
  }

  if (fn === 'COUNT') {
    const resolved = resolveArgsToFlatValues(args, grid, visited);
    if (resolved.error) return resolved.error;
    const count = resolved.values.filter(
      (v) => v !== '' && typeof v !== 'boolean' && !Number.isNaN(Number(v))
    ).length;
    return { value: count, isFormula: true };
  }

  if (fn === 'COUNTA') {
    const resolved = resolveArgsToFlatValues(args, grid, visited);
    if (resolved.error) return resolved.error;
    const count = resolved.values.filter((v) => v !== '' && v !== null && v !== undefined).length;
    return { value: count, isFormula: true };
  }

  if (fn === 'MIN' || fn === 'MAX') {
    const resolved = resolveArgsToFlatValues(args, grid, visited);
    if (resolved.error) return resolved.error;
    const nums = resolved.values
      .filter((v) => v !== '' && typeof v !== 'boolean' && !Number.isNaN(Number(v)))
      .map((v) => Number(v));
    if (nums.length === 0) return { value: 0, isFormula: true };
    return {
      value: fn === 'MIN' ? Math.min(...nums) : Math.max(...nums),
      isFormula: true,
    };
  }

  if (fn === 'IF') {
    if (args.length < 2 || args.length > 3) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: 'IF requires 2 or 3 arguments: =IF(condition, value_if_true, [value_if_false]).',
      };
    }
    const condRes = evaluateExpression(args[0], grid, visited);
    if (condRes.errorCode) return condRes;
    const isTruthy = Boolean(condRes.value) && condRes.value !== 0 && condRes.value !== 'FALSE';
    if (isTruthy) {
      return evaluateExpression(args[1], grid, visited);
    }
    if (args.length === 3) {
      return evaluateExpression(args[2], grid, visited);
    }
    return { value: false, isFormula: true };
  }

  if (fn === 'COUNTIF') {
    if (args.length !== 2) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: 'COUNTIF requires 2 arguments: =COUNTIF(range, criteria).',
      };
    }
    const refs = expandCellRange(args[0]);
    if (refs.length === 0) {
      return {
        value: '#REF!',
        isFormula: true,
        errorCode: '#REF!',
        errorHint: `Invalid range "${args[0]}" in COUNTIF.`,
      };
    }
    const critRes = evaluateExpression(args[1], grid, visited);
    if (critRes.errorCode) return critRes;

    let count = 0;
    for (const r of refs) {
      const cellRes = getCellValue(r, grid, visited);
      if (cellRes.errorCode) return cellRes;
      if (matchesSpreadsheetCriteria(cellRes.value, critRes.value)) {
        count++;
      }
    }
    return { value: count, isFormula: true };
  }

  if (fn === 'SUMIF') {
    if (args.length < 2 || args.length > 3) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: 'SUMIF requires 2 or 3 arguments: =SUMIF(range, criteria, [sum_range]).',
      };
    }
    const critRefs = expandCellRange(args[0]);
    const sumRefs = args.length === 3 ? expandCellRange(args[2]) : critRefs;
    if (critRefs.length === 0 || sumRefs.length === 0) {
      return {
        value: '#REF!',
        isFormula: true,
        errorCode: '#REF!',
        errorHint: 'Invalid range in SUMIF.',
      };
    }
    const critRes = evaluateExpression(args[1], grid, visited);
    if (critRes.errorCode) return critRes;

    let sum = 0;
    for (let i = 0; i < critRefs.length; i++) {
      const checkCell = getCellValue(critRefs[i], grid, visited);
      if (checkCell.errorCode) return checkCell;
      if (matchesSpreadsheetCriteria(checkCell.value, critRes.value)) {
        const sumCellRef = sumRefs[i];
        if (sumCellRef) {
          const valRes = getCellValue(sumCellRef, grid, visited);
          if (valRes.errorCode) return valRes;
          const n = Number(valRes.value);
          if (!Number.isNaN(n)) sum += n;
        }
      }
    }
    return { value: Math.round(sum * 10000) / 10000, isFormula: true };
  }

  if (fn === 'VLOOKUP') {
    if (args.length < 3 || args.length > 4) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: 'VLOOKUP requires 3 or 4 arguments: =VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup]).',
      };
    }
    const lookupRes = evaluateExpression(args[0], grid, visited);
    if (lookupRes.errorCode) return lookupRes;
    const matrix = expandCellRange2D(args[1]);
    if (matrix.length === 0) {
      return {
        value: '#REF!',
        isFormula: true,
        errorCode: '#REF!',
        errorHint: `Invalid table range "${args[1]}" in VLOOKUP.`,
      };
    }
    const colIndexRes = evaluateExpression(args[2], grid, visited);
    if (colIndexRes.errorCode) return colIndexRes;
    const colIdx = Number(colIndexRes.value) - 1;
    if (Number.isNaN(colIdx) || colIdx < 0 || colIdx >= matrix[0].length) {
      return {
        value: '#REF!',
        isFormula: true,
        errorCode: '#REF!',
        errorHint: `Column index ${colIndexRes.value} is outside the table range "${args[1]}".`,
      };
    }

    for (const rowRefs of matrix) {
      const firstCell = getCellValue(rowRefs[0], grid, visited);
      if (firstCell.errorCode) return firstCell;
      if (String(firstCell.value).toLowerCase() === String(lookupRes.value).toLowerCase()) {
        return getCellValue(rowRefs[colIdx], grid, visited);
      }
    }
    return {
      value: '#N/A',
      isFormula: true,
      errorCode: '#N/A',
      errorHint: `VLOOKUP could not find "${lookupRes.value}" in the first column of ${args[1]}.`,
    };
  }

  if (fn === 'XLOOKUP') {
    if (args.length < 3 || args.length > 4) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: 'XLOOKUP requires 3 or 4 arguments: =XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found]).',
      };
    }
    const lookupRes = evaluateExpression(args[0], grid, visited);
    if (lookupRes.errorCode) return lookupRes;
    const lookupRefs = expandCellRange(args[1]);
    const returnRefs = expandCellRange(args[2]);
    if (lookupRefs.length === 0 || lookupRefs.length !== returnRefs.length) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: 'XLOOKUP lookup_array and return_array must be valid ranges of equal length.',
      };
    }

    for (let i = 0; i < lookupRefs.length; i++) {
      const check = getCellValue(lookupRefs[i], grid, visited);
      if (check.errorCode) return check;
      if (String(check.value).toLowerCase() === String(lookupRes.value).toLowerCase()) {
        return getCellValue(returnRefs[i], grid, visited);
      }
    }
    if (args.length === 4) {
      return evaluateExpression(args[3], grid, visited);
    }
    return {
      value: '#N/A',
      isFormula: true,
      errorCode: '#N/A',
      errorHint: `XLOOKUP could not find "${lookupRes.value}" in ${args[1]}.`,
    };
  }

  if (fn === 'UPPER' || fn === 'LOWER' || fn === 'TRIM' || fn === 'LEN') {
    if (args.length !== 1) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `${fn} requires exactly 1 argument.`,
      };
    }
    const argRes = evaluateExpression(args[0], grid, visited);
    if (argRes.errorCode) return argRes;
    const strVal = String(argRes.value);
    if (fn === 'UPPER') return { value: strVal.toUpperCase(), isFormula: true };
    if (fn === 'LOWER') return { value: strVal.toLowerCase(), isFormula: true };
    if (fn === 'TRIM') return { value: strVal.trim().replace(/\s+/g, ' '), isFormula: true };
    return { value: strVal.length, isFormula: true };
  }

  if (fn === 'LEFT' || fn === 'RIGHT') {
    if (args.length < 1 || args.length > 2) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `${fn} requires 1 or 2 arguments: =${fn}(text, [num_chars]).`,
      };
    }
    const textRes = evaluateExpression(args[0], grid, visited);
    if (textRes.errorCode) return textRes;
    const count = args.length === 2 ? Number(evaluateExpression(args[1], grid, visited).value) : 1;
    if (Number.isNaN(count) || count < 0) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `Second argument to ${fn} must be a non-negative number.`,
      };
    }
    const s = String(textRes.value);
    return {
      value: fn === 'LEFT' ? s.slice(0, count) : s.slice(Math.max(0, s.length - count)),
      isFormula: true,
    };
  }

  if (fn === 'CONCAT') {
    const resolved = resolveArgsToFlatValues(args, grid, visited);
    if (resolved.error) return resolved.error;
    return { value: resolved.values.map((v) => String(v)).join(''), isFormula: true };
  }

  if (fn === 'ROUND' || fn === 'ABS') {
    const first = evaluateExpression(args[0] || '', grid, visited);
    if (first.errorCode) return first;
    const num = Number(first.value);
    if (Number.isNaN(num)) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `${fn} expects a numeric first argument, received "${first.value}".`,
      };
    }
    if (fn === 'ABS') return { value: Math.abs(num), isFormula: true };
    const digits = args.length >= 2 ? Number(evaluateExpression(args[1], grid, visited).value) : 0;
    const factor = Math.pow(10, Number.isNaN(digits) ? 0 : digits);
    return { value: Math.round(num * factor) / factor, isFormula: true };
  }

  if (fn === 'YEAR' || fn === 'MONTH' || fn === 'DAY') {
    const first = evaluateExpression(args[0] || '', grid, visited);
    if (first.errorCode) return first;
    const d = new Date(String(first.value));
    if (Number.isNaN(d.getTime())) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `Could not parse "${first.value}" as a valid date for ${fn}().`,
      };
    }
    if (fn === 'YEAR') return { value: d.getUTCFullYear(), isFormula: true };
    if (fn === 'MONTH') return { value: d.getUTCMonth() + 1, isFormula: true };
    return { value: d.getUTCDate(), isFormula: true };
  }

  return {
    value: '#NAME?',
    isFormula: true,
    errorCode: '#NAME?',
    errorHint: `Unrecognized function "${fn}".`,
  };
}

function findMatchingCloseParen(str: string, openIdx: number): number {
  let depth = 0;
  let inQuotes = false;
  for (let i = openIdx; i < str.length; i++) {
    const ch = str[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch === '(') depth++;
    else if (!inQuotes && ch === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function evaluateExpression(
  exprRaw: string,
  grid: Record<string, string | number>,
  visited: Set<string>
): CellEvalResult {
  let expr = exprRaw.trim();
  if (expr === '') return { value: '', isFormula: true };

  // Strip redundant outer parentheses if balanced
  while (expr.startsWith('(') && findMatchingCloseParen(expr, 0) === expr.length - 1) {
    expr = expr.slice(1, -1).trim();
  }

  // String literal
  if (expr.startsWith('"') && expr.endsWith('"') && expr.length >= 2) {
    const inner = expr.slice(1, -1);
    if (!inner.includes('"')) {
      return { value: inner, isFormula: true };
    }
  }

  // Pure function call e.g. SUM(B2:B5)
  const fnMatch = expr.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*\(/);
  if (fnMatch) {
    const openIdx = expr.indexOf('(');
    const closeIdx = findMatchingCloseParen(expr, openIdx);
    if (closeIdx === -1) {
      return {
        value: '#ERROR!',
        isFormula: true,
        errorCode: '#ERROR!',
        errorHint: 'Missing closing parenthesis ")" in formula.',
      };
    }
    if (closeIdx === expr.length - 1) {
      const fnName = fnMatch[1];
      const argsStr = expr.slice(openIdx + 1, closeIdx);
      return evaluateFunctionCall(fnName, argsStr, grid, visited);
    }
  }

  // Comparison operators at top level (=, <>, >=, <=, >, <)
  const compOps = ['>=', '<=', '<>', '=', '>', '<'];
  for (const op of compOps) {
    const idx = findTopLevelOperator(expr, op);
    if (idx !== -1) {
      const leftRes = evaluateExpression(expr.slice(0, idx), grid, visited);
      if (leftRes.errorCode) return leftRes;
      const rightRes = evaluateExpression(expr.slice(idx + op.length), grid, visited);
      if (rightRes.errorCode) return rightRes;

      const lNum = Number(leftRes.value);
      const rNum = Number(rightRes.value);
      const bothNum =
        !Number.isNaN(lNum) &&
        String(leftRes.value) !== '' &&
        !Number.isNaN(rNum) &&
        String(rightRes.value) !== '';

      let boolVal = false;
      if (bothNum) {
        if (op === '=') boolVal = lNum === rNum;
        else if (op === '<>') boolVal = lNum !== rNum;
        else if (op === '>') boolVal = lNum > rNum;
        else if (op === '<') boolVal = lNum < rNum;
        else if (op === '>=') boolVal = lNum >= rNum;
        else if (op === '<=') boolVal = lNum <= rNum;
      } else {
        const lStr = String(leftRes.value).toLowerCase();
        const rStr = String(rightRes.value).toLowerCase();
        if (op === '=') boolVal = lStr === rStr;
        else if (op === '<>') boolVal = lStr !== rStr;
        else if (op === '>') boolVal = lStr > rStr;
        else if (op === '<') boolVal = lStr < rStr;
        else if (op === '>=') boolVal = lStr >= rStr;
        else if (op === '<=') boolVal = lStr <= rStr;
      }
      return { value: boolVal, isFormula: true };
    }
  }

  // Addition and Subtraction at top level (right-to-left scan for left associativity)
  const addSubIdx = findRightmostAdditiveOperator(expr);
  if (addSubIdx !== -1) {
    const op = expr[addSubIdx];
    const leftRes = evaluateExpression(expr.slice(0, addSubIdx), grid, visited);
    if (leftRes.errorCode) return leftRes;
    const rightRes = evaluateExpression(expr.slice(addSubIdx + 1), grid, visited);
    if (rightRes.errorCode) return rightRes;

    const lNum = leftRes.value === '' ? 0 : Number(leftRes.value);
    const rNum = rightRes.value === '' ? 0 : Number(rightRes.value);
    if (Number.isNaN(lNum) || Number.isNaN(rNum)) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `Cannot perform arithmetic "${op}" on text values ("${leftRes.value}" and "${rightRes.value}").`,
      };
    }
    const result = op === '+' ? lNum + rNum : lNum - rNum;
    return { value: Math.round(result * 10000) / 10000, isFormula: true };
  }

  // Multiplication and Division at top level
  const mulDivIdx = findRightmostMultiplicativeOperator(expr);
  if (mulDivIdx !== -1) {
    const op = expr[mulDivIdx];
    const leftRes = evaluateExpression(expr.slice(0, mulDivIdx), grid, visited);
    if (leftRes.errorCode) return leftRes;
    const rightRes = evaluateExpression(expr.slice(mulDivIdx + 1), grid, visited);
    if (rightRes.errorCode) return rightRes;

    const lNum = leftRes.value === '' ? 0 : Number(leftRes.value);
    const rNum = rightRes.value === '' ? 0 : Number(rightRes.value);
    if (Number.isNaN(lNum) || Number.isNaN(rNum)) {
      return {
        value: '#VALUE!',
        isFormula: true,
        errorCode: '#VALUE!',
        errorHint: `Cannot perform arithmetic "${op}" on non-numeric values ("${leftRes.value}" and "${rightRes.value}").`,
      };
    }
    if (op === '/' && rNum === 0) {
      return {
        value: '#DIV/0!',
        isFormula: true,
        errorCode: '#DIV/0!',
        errorHint: 'Division by zero (#DIV/0!). Check that your denominator cell is not 0 or empty.',
      };
    }
    const result = op === '*' ? lNum * rNum : lNum / rNum;
    return { value: Math.round(result * 10000) / 10000, isFormula: true };
  }

  // Single cell reference e.g. B2 or $B$2
  if (/^\$?[A-Za-z]{1,2}\$?\d+$/.test(expr)) {
    return getCellValue(expr, grid, visited);
  }

  // Numeric or boolean literal
  if (/^true$/i.test(expr)) return { value: true, isFormula: true };
  if (/^false$/i.test(expr)) return { value: false, isFormula: true };
  const numVal = Number(expr);
  if (!Number.isNaN(numVal)) {
    return { value: numVal, isFormula: true };
  }

  // Bare identifier without quotes or unknown function name
  return {
    value: '#NAME?',
    isFormula: true,
    errorCode: '#NAME?',
    errorHint: `Unrecognized formula name or unquoted text "${expr}". Wrap text literals in double quotes like "${expr}".`,
  };
}

function findTopLevelOperator(expr: string, op: string): number {
  let depth = 0;
  let inQuotes = false;
  for (let i = 0; i <= expr.length - op.length; i++) {
    const ch = expr[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch === '(') depth++;
    else if (!inQuotes && ch === ')') depth--;
    else if (!inQuotes && depth === 0) {
      if (expr.slice(i, i + op.length) === op) {
        // Make sure '=' doesn't match inside '>=', '<=', '<>'
        if (op === '=' && i > 0 && ['>', '<'].includes(expr[i - 1])) continue;
        if ((op === '>' || op === '<') && (expr[i + 1] === '=' || expr[i + 1] === '>')) continue;
        return i;
      }
    }
  }
  return -1;
}

function findRightmostAdditiveOperator(expr: string): number {
  let depth = 0;
  let inQuotes = false;
  for (let i = expr.length - 1; i > 0; i--) {
    const ch = expr[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch === ')') depth++;
    else if (!inQuotes && ch === '(') depth--;
    else if (!inQuotes && depth === 0 && (ch === '+' || ch === '-')) {
      const prev = expr.slice(0, i).trim();
      if (prev.length > 0 && !['+', '-', '*', '/', '(', '=', '<', '>', ','].includes(prev[prev.length - 1])) {
        return i;
      }
    }
  }
  return -1;
}

function findRightmostMultiplicativeOperator(expr: string): number {
  let depth = 0;
  let inQuotes = false;
  for (let i = expr.length - 1; i > 0; i--) {
    const ch = expr[i];
    if (ch === '"') inQuotes = !inQuotes;
    else if (!inQuotes && ch === ')') depth++;
    else if (!inQuotes && ch === '(') depth--;
    else if (!inQuotes && depth === 0 && (ch === '*' || ch === '/')) {
      return i;
    }
  }
  return -1;
}

export function evaluateFullGrid(
  grid: Record<string, string | number>,
  cols: string[] = ['A', 'B', 'C', 'D', 'E', 'F'],
  rowCount: number = 10
): Record<string, CellEvalResult> {
  const results: Record<string, CellEvalResult> = {};
  for (let r = 1; r <= rowCount; r++) {
    for (const c of cols) {
      const ref = `${c}${r}`;
      results[ref] = evaluateSpreadsheetCell(ref, grid);
    }
  }
  return results;
}
