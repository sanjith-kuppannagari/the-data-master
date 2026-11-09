import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

export type PracticeDatabaseId = 'ecommerce' | 'hr_analytics' | 'saas_metrics';

export interface SQLColumnMeta {
  name: string;
  type: string;
  notNull?: boolean;
  pk: boolean;
  isPrimaryKey?: boolean;
}

export interface SQLTableMeta {
  name: string;
  tableName?: string;
  rowCount: number;
  columns: SQLColumnMeta[];
}

export interface SQLDatabaseMeta {
  id: PracticeDatabaseId;
  name: string;
  description: string;
  tables: SQLTableMeta[];
}

export interface SQLQueryResult {
  success: boolean;
  columns: string[];
  rows: (string | number | null)[][];
  objectRows?: Record<string, any>[];
  rowCount: number;
  modifiedRows: number;
  isEmptyResult: boolean;
  executionTimeMs: number;
  error?: string;
  errorHint?: string;
}

const DATABASE_SEEDS: Record<
  PracticeDatabaseId,
  { name: string; description: string; seedSql: string }
> = {
  ecommerce: {
    name: 'Global E-Commerce & Orders DB',
    description:
      'Multi-table retail commerce database with customers, products, orders, and order_items.',
    seedSql: `
      CREATE TABLE customers (
        customer_id INTEGER PRIMARY KEY,
        full_name TEXT NOT NULL,
        region TEXT NOT NULL,
        acquisition_channel TEXT NOT NULL,
        signup_date TEXT NOT NULL
      );

      INSERT INTO customers VALUES
        (1, 'Maya Lin', 'North America', 'Organic Search', '2024-11-10'),
        (2, 'Liam O''Connor', 'Europe', 'Paid Social', '2024-11-18'),
        (3, 'Aarav Patel', 'Asia Pacific', 'Direct', '2024-12-02'),
        (4, 'Sofia Rossi', 'Europe', 'Email', '2024-12-14'),
        (5, 'Noah Fischer', 'Europe', 'Organic Search', '2025-01-04'),
        (6, 'Ethan Brooks', 'North America', 'Direct', '2025-01-09'),
        (7, 'Hana Sato', 'Asia Pacific', 'Paid Social', '2025-01-15'),
        (8, 'Lucas Silva', 'Latin America', 'Email', '2025-01-20');

      CREATE TABLE products (
        product_id INTEGER PRIMARY KEY,
        product_name TEXT NOT NULL,
        category TEXT NOT NULL,
        unit_price REAL NOT NULL,
        unit_cost REAL NOT NULL
      );

      INSERT INTO products VALUES
        (101, 'Pro Docking Station', 'Accessories', 240.0, 110.0),
        (102, 'Ergonomic Task Chair', 'Home Office', 520.0, 280.0),
        (103, 'Enterprise Analytics License', 'Software', 490.0, 50.0),
        (104, 'UltraWide 4K Monitor', 'Electronics', 680.0, 390.0),
        (105, 'Noise-Canceling Headset', 'Accessories', 310.0, 140.0),
        (106, 'Cloud Backup Add-on', 'Software', 180.0, 20.0);

      CREATE TABLE orders (
        order_id INTEGER PRIMARY KEY,
        customer_id INTEGER NOT NULL,
        order_date TEXT NOT NULL,
        status TEXT NOT NULL,
        total_amount REAL NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
      );

      INSERT INTO orders VALUES
        (1001, 1, '2025-01-10', 'Completed', 680.0),
        (1002, 2, '2025-01-12', 'Completed', 520.0),
        (1003, 3, '2025-01-15', 'Completed', 310.0),
        (1004, 1, '2025-01-20', 'Completed', 490.0),
        (1005, 4, '2025-01-22', 'Cancelled', 680.0),
        (1006, 5, '2025-02-01', 'Completed', 980.0),
        (1007, 6, '2025-02-05', 'Completed', 1200.0),
        (1008, 7, '2025-02-11', 'Completed', 420.0),
        (1009, 2, '2025-02-14', 'Completed', 140.0),
        (1010, 8, '2025-02-19', 'Completed', 360.0),
        (1011, 6, '2025-02-24', 'Completed', 150.0);

      CREATE TABLE order_items (
        item_id INTEGER PRIMARY KEY,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        line_total REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
      );

      INSERT INTO order_items VALUES
        (1, 1001, 104, 1, 680.0),
        (2, 1002, 102, 1, 520.0),
        (3, 1003, 105, 1, 310.0),
        (4, 1004, 103, 1, 490.0),
        (5, 1006, 103, 2, 980.0),
        (6, 1007, 104, 1, 680.0),
        (7, 1007, 102, 1, 520.0);
    `,
  },
  hr_analytics: {
    name: 'Enterprise Workforce & Compensation DB',
    description:
      'Organizational HR database tracking departments, active employees, salaries, and performance ratings.',
    seedSql: `
      CREATE TABLE departments (
        dept_id INTEGER PRIMARY KEY,
        dept_name TEXT NOT NULL,
        location TEXT NOT NULL
      );

      INSERT INTO departments VALUES
        (10, 'Data Science', 'New York'),
        (20, 'Engineering', 'San Francisco'),
        (30, 'Product', 'London'),
        (40, 'Sales', 'Chicago');

      CREATE TABLE employees (
        emp_id INTEGER PRIMARY KEY,
        full_name TEXT NOT NULL,
        dept_id INTEGER NOT NULL,
        salary REAL NOT NULL,
        tenure_years REAL NOT NULL,
        performance_rating REAL NOT NULL,
        is_active INTEGER NOT NULL,
        FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
      );

      INSERT INTO employees VALUES
        (1, 'Aarav Mehta', 10, 145000, 4.2, 4.9, 1),
        (2, 'Elena Rostova', 10, 125000, 2.8, 4.5, 1),
        (3, 'Marcus Vance', 20, 140000, 5.0, 4.7, 1),
        (4, 'Chloe Park', 20, 118000, 2.1, 4.2, 1),
        (5, 'Devon Brooks', 20, 105000, 1.4, 3.8, 0),
        (6, 'Nadia Sterling', 30, 130000, 3.6, 4.6, 1),
        (7, 'Julian Cruz', 40, 98000, 2.5, 4.1, 1),
        (8, 'Hannah Abbott', 40, 86000, 1.2, 3.9, 1);
    `,
  },
  saas_metrics: {
    name: 'CloudPulse B2B SaaS Telemetry DB',
    description:
      'B2B subscription accounts and monthly usage telemetry with MRR, active users, and churn status.',
    seedSql: `
      CREATE TABLE accounts (
        account_id INTEGER PRIMARY KEY,
        company_name TEXT NOT NULL,
        plan_tier TEXT NOT NULL,
        mrr_usd REAL NOT NULL,
        active_seats INTEGER NOT NULL,
        is_churned INTEGER NOT NULL
      );

      INSERT INTO accounts VALUES
        (201, 'Vertex Labs', 'Enterprise', 4200, 48, 0),
        (202, 'NovaFreight', 'Growth', 950, 14, 0),
        (203, 'BluePeak Retail', 'Starter', 290, 2, 1),
        (204, 'OmniHealth', 'Enterprise', 5600, 62, 0),
        (205, 'PulseMedia', 'Growth', 1100, 6, 1),
        (206, 'Kinetix AI', 'Enterprise', 3800, 39, 0),
        (207, 'Cedar FinTech', 'Growth', 1250, 22, 0);

      CREATE TABLE monthly_telemetry (
        record_id INTEGER PRIMARY KEY,
        account_id INTEGER NOT NULL,
        month TEXT NOT NULL,
        api_calls INTEGER NOT NULL,
        support_tickets INTEGER NOT NULL,
        FOREIGN KEY (account_id) REFERENCES accounts(account_id)
      );

      INSERT INTO monthly_telemetry VALUES
        (1, 201, '2025-01', 145000, 1),
        (2, 202, '2025-01', 38000, 4),
        (3, 203, '2025-01', 4200, 9),
        (4, 204, '2025-01', 210000, 1),
        (5, 205, '2025-01', 12000, 11),
        (6, 206, '2025-01', 128000, 2);
    `,
  },
};

let sqlJsPromise: Promise<SqlJsStatic> | null = null;
const dbInstances: Partial<Record<PracticeDatabaseId, Database>> = {};

async function getSqlRuntime(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    const isBrowser =
      typeof window !== 'undefined' && typeof window.document !== 'undefined';
    sqlJsPromise = initSqlJs(
      isBrowser
        ? {
            locateFile: (file: string) => `/${file}`,
          }
        : undefined
    );
  }
  return sqlJsPromise;
}

async function getOrInitDatabase(
  dbId: PracticeDatabaseId,
  forceReset: boolean = false
): Promise<Database> {
  const SQL = await getSqlRuntime();
  if (forceReset && dbInstances[dbId]) {
    try {
      dbInstances[dbId]?.close();
    } catch {
      // ignore
    }
    delete dbInstances[dbId];
  }
  if (!dbInstances[dbId]) {
    const db = new SQL.Database();
    db.run(DATABASE_SEEDS[dbId].seedSql);
    dbInstances[dbId] = db;
  }
  return dbInstances[dbId]!;
}

export async function resetSQLDatabase(dbId: PracticeDatabaseId): Promise<void> {
  await getOrInitDatabase(dbId, true);
}

export async function getDatabaseSchema(
  dbId: PracticeDatabaseId
): Promise<SQLDatabaseMeta> {
  const db = await getOrInitDatabase(dbId);
  const seed = DATABASE_SEEDS[dbId];
  const tblRes = db.exec(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  );
  const tableNames =
    tblRes.length > 0 ? tblRes[0].values.map((r) => String(r[0])) : [];

  const tables: SQLTableMeta[] = tableNames.map((tName) => {
    const pragma = db.exec(`PRAGMA table_info("${tName}");`);
    const columns: SQLColumnMeta[] =
      pragma.length > 0
        ? pragma[0].values.map((c) => ({
            name: String(c[1]),
            type: String(c[2] || 'TEXT'),
            notNull: Boolean(c[3]),
            pk: Boolean(c[5]),
            isPrimaryKey: Boolean(c[5]),
          }))
        : [];
    const countRes = db.exec(`SELECT COUNT(*) FROM "${tName}";`);
    const rowCount =
      countRes.length > 0 && countRes[0].values.length > 0
        ? Number(countRes[0].values[0][0])
        : 0;

    return {
      name: tName,
      tableName: tName,
      rowCount,
      columns,
    };
  });

  return {
    id: dbId,
    name: seed.name,
    description: seed.description,
    tables,
  };
}

export function diagnoseSQLError(errorMessage: string): string {
  const msg = errorMessage.toLowerCase();
  if (msg.includes('no such table')) {
    return 'Table Not Found: Check the Schema Inspector on the left for the exact table name and verify the active database.';
  }
  if (msg.includes('no such column')) {
    return "Column Not Found: Check column spelling in the Schema Inspector, or make sure string literals use single quotes ('Completed') rather than double quotes.";
  }
  if (msg.includes('misuse of aggregate')) {
    return 'Aggregate Misuse: Aggregate functions like SUM(), COUNT(), and AVG() cannot be used inside a WHERE clause. Move aggregate conditions into a HAVING clause after GROUP BY.';
  }
  if (msg.includes('syntax error')) {
    return 'SQL Syntax Error: Check for missing commas in SELECT, unmatched parentheses, or clause ordering (SELECT -> FROM -> JOIN -> WHERE -> GROUP BY -> HAVING -> ORDER BY -> LIMIT).';
  }
  if (msg.includes('ambiguous column')) {
    return 'Ambiguous Column: Prefix columns shared by joined tables with their table alias (e.g., c.customer_id or o.customer_id).';
  }
  return 'Check your SQL syntax, table/column names in the schema panel, and clause order.';
}

export async function executeSQLQuery(
  dbId: PracticeDatabaseId,
  sql: string
): Promise<SQLQueryResult> {
  const trimmed = sql.trim();
  const start = performance.now();

  if (!trimmed) {
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      modifiedRows: 0,
      isEmptyResult: false,
      executionTimeMs: 0,
      error: 'Query is empty.',
      errorHint: 'Enter a valid SQL statement such as SELECT * FROM orders LIMIT 5;',
    };
  }

  try {
    const db = await getOrInitDatabase(dbId);
    const isDml = /\b(INSERT|UPDATE|DELETE)\b/i.test(trimmed);
    const execResults = db.exec(trimmed);
    const elapsed = Math.max(1, Math.round((performance.now() - start) * 10) / 10);
    const modifiedRows = isDml ? db.getRowsModified() : 0;

    if (execResults.length === 0) {
      return {
        success: true,
        columns: [],
        rows: [],
        rowCount: 0,
        modifiedRows,
        isEmptyResult: true,
        executionTimeMs: elapsed,
      };
    }

    const last = execResults[execResults.length - 1];
    const columns = last.columns;
    const rows = last.values as (string | number | null)[][];

    return {
      success: true,
      columns,
      rows,
      rowCount: rows.length,
      modifiedRows,
      isEmptyResult: rows.length === 0,
      executionTimeMs: elapsed,
    };
  } catch (err: any) {
    const elapsed = Math.max(1, Math.round((performance.now() - start) * 10) / 10);
    const rawMsg = err?.message || String(err);
    return {
      success: false,
      columns: [],
      rows: [],
      rowCount: 0,
      modifiedRows: 0,
      isEmptyResult: false,
      executionTimeMs: elapsed,
      error: rawMsg,
      errorHint: diagnoseSQLError(rawMsg),
    };
  }
}
