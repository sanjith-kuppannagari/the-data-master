import { Domain } from '../types/curriculum';

export const CURRICULUM_DOMAINS: Domain[] = [
  {
    id: 'domain-1',
    slug: 'excel-spreadsheet-analytics',
    number: 1,
    name: 'Excel & Spreadsheet Analytics',
    classification: 'CORE SKILL',
    defaultPriority: 'Level 1',
    tagline: 'The universal workbench for exploratory data manipulation and modeling',
    description: 'Master spreadsheet modeling from cell references to dynamic arrays, Power Query transformations, DAX relational models, and interactive executive dashboards.',
    tools: ['Microsoft Excel', 'Google Sheets', 'Power Query', 'Power Pivot'],
    prerequisites: ['Basic computer literacy and comfort with numerical data'],
    learningObjectives: [
      'Master formula design including conditional logic, lookup functions, and dynamic arrays.',
      'Transform messy raw data reliably with Power Query automation.',
      'Design relational data models and author DAX measures in Power Pivot.',
      'Build executive-ready interactive business dashboards with slicers and KPI cards.'
    ],
    recommendedProjects: [
      'Executive Sales Performance Dashboard with dynamic date filtering',
      'Corporate Inventory Turnover & Reorder Point Optimizer',
      'Automated Monthly Financial Statement & Budget Variance Model'
    ],
    icon: 'Sheet',
    accent: 'lime',
    topics: [
      {
        id: 'd1-t1',
        title: 'Spreadsheet Fundamentals',
        description: 'Core workbook architecture, cell addressing, data formats, and navigation shortcuts.',
        subtopics: [
          'Workbook structure: sheets, rows, columns, ranges, and cell references',
          'Data types: numeric, text, boolean, date/time, and currency formats',
          'Custom formatting syntax and error codes (#N/A, #VALUE!, #REF!)',
          'Grid navigation, selection mechanics, and productivity keyboard shortcuts'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 60,
        xpReward: 30
      },
      {
        id: 'd1-t2',
        title: 'Formulas & Computational Functions',
        description: 'Essential mathematical, logical, lookup, and modern dynamic array functions.',
        subtopics: [
          'Basic arithmetic & statistical aggregations (SUM, AVERAGE, MIN, MAX, COUNT, COUNTA)',
          'Conditional logic (IF, AND, OR, IFS, SWITCH, nested branching)',
          'Conditional aggregations (SUMIF, SUMIFS, COUNTIF, COUNTIFS, AVERAGEIFS)',
          'Modern and legacy lookups (XLOOKUP, VLOOKUP, HLOOKUP, INDEX & MATCH)',
          'Text & date manipulation (LEFT, RIGHT, MID, TEXTSPLIT, DATE, DATEDIF, EOMONTH)',
          'Dynamic arrays & spilling (FILTER, UNIQUE, SORT, SORTBY, SEQUENCE, XMATCH)'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 120,
        xpReward: 60
      },
      {
        id: 'd1-t3',
        title: 'Data Cleaning, Validation & What-If Analysis',
        description: 'Sanitizing imported datasets, enforcing validation rules, and scenario modeling.',
        subtopics: [
          'Text to columns, flash fill, duplicate removal, and whitespace trimming',
          'Data validation rules, custom formula criteria, and dropdown controls',
          'Conditional formatting rules with custom logic expressions',
          'Goal Seek, Scenario Manager, and Solver linear optimization constraints'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd1-t4',
        title: 'Advanced Excel: Power Query, Power Pivot & DAX',
        description: 'Industrial ETL and relational modeling inside spreadsheets.',
        subtopics: [
          'Pivot Tables, calculated fields, groupings, and timeline slicers',
          'Power Query ETL: unpivoting, merging queries, appending datasets, and M basics',
          'Power Pivot: creating star-schema relationships between worksheet tables',
          'DAX fundamentals: CALCULATE, RELATED, SUMX, and time-intelligence expressions',
          'Introduction to VBA macros and automated routine workflows (optional)'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 150,
        xpReward: 80
      },
      {
        id: 'd1-t5',
        title: 'Practical Business Dashboards',
        description: 'Assembling coherent, visual, interactive decision-support tools.',
        subtopics: [
          'Design principles for spreadsheet dashboards (grid alignment, visual hierarchy)',
          'Sales revenue and pipeline tracking dashboard',
          'Financial budget vs. actual variance analysis',
          'Inventory monitoring and reorder alerts system',
          'Employee HR headcount, turnover, and performance tracker'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 90
      }
    ]
  },
  {
    id: 'domain-2',
    slug: 'sql-database-management',
    number: 2,
    name: 'SQL & Database Management',
    classification: 'CORE SKILL',
    defaultPriority: 'Level 1',
    tagline: 'The authoritative language for querying, transforming, and modeling relational data',
    description: 'Gain complete mastery over relational database management systems, multi-table joins, subqueries, CTEs, advanced analytical window functions, query optimization, and dimensional modeling.',
    tools: ['PostgreSQL', 'MySQL', 'SQL Server', 'SQLite'],
    prerequisites: ['Basic understanding of tabular data'],
    learningObjectives: [
      'Write robust SQL queries for complex multi-table analytical questions.',
      'Employ window functions for running totals, rankings, and cohort lag/lead analysis.',
      'Optimize query execution plans using indexing strategies.',
      'Design relational schemas adhering to normalization principles and dimensional star schemas.'
    ],
    recommendedProjects: [
      'E-Commerce Customer Lifecycle & Cohort Retention Analysis (SQL)',
      'Fintech Fraud Detection & Suspicious Transaction Aggregator',
      'SaaS Subscription Churn, MRR, and ARR Dimensional Data Mart'
    ],
    icon: 'Database',
    accent: 'lime',
    topics: [
      {
        id: 'd2-t1',
        title: 'Database Architecture & Relational Concepts',
        description: 'RDBMS fundamentals, relational constraints, and schema modeling.',
        subtopics: [
          'DBMS vs RDBMS concepts and client-server database architecture',
          'Relational tables, primary keys, composite keys, and foreign key integrity',
          'Entity-Relationship (ER) diagrams and cardinality (1:1, 1:N, N:M)',
          'Data types across PostgreSQL, MySQL, and SQLite (integer, numeric, text, timestamps)'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 60,
        xpReward: 30
      },
      {
        id: 'd2-t2',
        title: 'SQL Query Fundamentals & Filtering',
        description: 'Writing foundational extraction queries and conditional filtering.',
        subtopics: [
          'SELECT projections, column aliases, DISTINCT deduplication, and LIMIT/TOP pagination',
          'WHERE filtering: comparison, logical (AND/OR/NOT), IN, BETWEEN, and LIKE pattern matching',
          'ORDER BY sorting with NULLS FIRST / NULLS LAST handling',
          'Conditional branching with CASE WHEN THEN ELSE END',
          'Handling NULLs with COALESCE, NULLIF, and IS NULL / IS NOT NULL'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 90,
        xpReward: 45
      },
      {
        id: 'd2-t3',
        title: 'Aggregations, Grouping & Multi-Table Joins',
        description: 'Combining disparate relational datasets and calculating aggregate summaries.',
        subtopics: [
          'Aggregate functions (COUNT, SUM, AVG, MIN, MAX) and NULL handling',
          'GROUP BY multi-dimensional rollups and HAVING clause post-filtering',
          'INNER JOIN, LEFT (OUTER) JOIN, RIGHT JOIN, and FULL OUTER JOIN mechanics',
          'CROSS JOIN Cartesian products and SELF JOIN hierarchical queries',
          'Set operations: UNION, UNION ALL, INTERSECT, and EXCEPT / MINUS'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 120,
        xpReward: 65
      },
      {
        id: 'd2-t4',
        title: 'Subqueries, CTEs & Temporary Structures',
        description: 'Modularizing complex analytical queries with common table expressions.',
        subtopics: [
          'Scalar, column, and correlated subqueries in SELECT, WHERE, and FROM clauses',
          'Common Table Expressions (WITH cte_name AS ...) and recursive CTEs',
          'Materialized views vs standard database views for analytical caching',
          'Temporary tables and session-scoped intermediate data stores'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 110,
        xpReward: 70
      },
      {
        id: 'd2-t5',
        title: 'Analytical Window Functions',
        description: 'Computing partitions, rankings, running aggregations, and row offsets.',
        subtopics: [
          'OVER clause structure: PARTITION BY and ORDER BY framing',
          'Ranking functions: ROW_NUMBER(), RANK(), DENSE_RANK(), and NTILE()',
          'Offset functions: LAG() and LEAD() for period-over-period comparisons',
          'Cumulative & moving window aggregations (SUM, AVG with ROWS BETWEEN framing)'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 90
      },
      {
        id: 'd2-t6',
        title: 'Performance Optimization & Dimensional Modeling',
        description: 'Execution plans, indexing strategies, and analytical schemas.',
        subtopics: [
          'EXPLAIN and EXPLAIN ANALYZE query plan inspection',
          'B-Tree and composite indexing best practices and anti-patterns',
          'Database normalization (1NF, 2NF, 3NF, BCNF) vs intentional analytical denormalization',
          'Dimensional modeling: Star schema, Snowflake schema, Fact and Dimension tables',
          'Slowly Changing Dimensions (SCD Type 1, Type 2, Type 3) fundamentals'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 160,
        xpReward: 100
      }
    ]
  },
  {
    id: 'domain-3',
    slug: 'python-programming-data-analytics',
    number: 3,
    name: 'Python Programming for Data Analytics',
    classification: 'CORE SKILL',
    defaultPriority: 'Level 1',
    tagline: 'The premier open-source language for computational data analysis and scripting',
    description: 'Develop production-grade analytical Python skills, from control flow and data structures to high-performance NumPy arrays, Pandas DataFrames, and visualization libraries.',
    tools: ['Python', 'Jupyter Notebook', 'Google Colab', 'VS Code'],
    prerequisites: ['Basic logical thinking and familiarity with variables'],
    learningObjectives: [
      'Write clean, idiomatic Python code with modular functions and exception handling.',
      'Perform high-throughput vectorised computations with NumPy arrays.',
      'Wrangle, reshape, aggregate, and inspect complex datasets using Pandas.',
      'Produce exploratory and publication-quality visual plots with Seaborn and Plotly.'
    ],
    recommendedProjects: [
      'Automated Multi-Source Web Scraping & Daily Market Intelligence Pipeline',
      'Exploratory Customer Demographics & Behavioral Profiling Notebook',
      'Interactive Streamlit or Plotly Analytical Dashboard'
    ],
    icon: 'Terminal',
    accent: 'lime',
    topics: [
      {
        id: 'd3-t1',
        title: 'Python Syntax & Core Data Structures',
        description: 'Variables, primitive types, operators, flow control, and data containers.',
        subtopics: [
          'Variable assignment, type dynamic casting, and string formatting (f-strings)',
          'Logical comparisons, conditional branching (if/elif/else), and ternary operators',
          'Loops (for, while, range, enumerate, zip) and loop control (break, continue)',
          'Python data structures: Lists, Tuples, Sets, and Dictionaries',
          'List, dictionary, and set comprehensions for clean expressions',
          'User-defined functions (*args, **kwargs, lambda functions, docstrings)'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 90,
        xpReward: 45
      },
      {
        id: 'd3-t2',
        title: 'Intermediate Python & Development Workflow',
        description: 'Modules, filesystem operations, error handling, and notebook environments.',
        subtopics: [
          'File I/O: reading and writing text, JSON, and CSV files safely using context managers',
          'Defensive programming with try/except/finally blocks and custom exceptions',
          'Virtual environments (venv, conda) and dependency management with pip/requirements.txt',
          'Jupyter Notebook & Google Colab workflow, cell execution state, and markdown annotations',
          'Object-Oriented Programming (OOP) fundamentals for reusable analytical utilities'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 100,
        xpReward: 55
      },
      {
        id: 'd3-t3',
        title: 'High-Performance Numerical Computing with NumPy',
        description: 'N-dimensional arrays, vectorization, broadcasting, and numerical routines.',
        subtopics: [
          'NumPy ndarray creation, attributes (shape, dtype, ndim), and memory efficiency',
          'Array indexing, boolean masking, slicing, and fancy indexing',
          'Vectorized arithmetic and universal functions (ufuncs) vs Python loops',
          'Broadcasting rules for multi-dimensional mathematical operations',
          'Linear algebra operations (dot products, matrix inversions, eigenvalues)'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 110,
        xpReward: 65
      },
      {
        id: 'd3-t4',
        title: 'Data Wrangling & Transformation with Pandas',
        description: 'DataFrames, Series, filtering, grouping, merging, and reshaping.',
        subtopics: [
          'Series and DataFrame architecture, index mechanics, and loading data (read_csv, read_sql)',
          'Data inspection (.info(), .describe(), .head(), .value_counts())',
          'Data selection & assignment (.loc, .iloc, conditional query expressions)',
          'Data cleaning: .dropna(), .fillna(), .replace(), and type conversions with .astype()',
          'Grouped aggregations with .groupby(), .agg(), and transform methods',
          'Relational operations: .merge(), .join(), .concat(), and multi-level indexing',
          'Reshaping: .pivot_table(), .melt(), .stack(), and .unstack()'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 150,
        xpReward: 85
      },
      {
        id: 'd3-t5',
        title: 'Data Ingestion & Visualization Libraries',
        description: 'Visual storytelling with Matplotlib/Seaborn and external data extraction.',
        subtopics: [
          'Exploratory charts with Matplotlib (figure/axes architecture, formatting, subplots)',
          'Statistical graphics with Seaborn (pairplot, heatmap, boxplot, violinplot, histplot)',
          'Interactive dashboards and visualizations with Plotly Express',
          'Web scraping fundamentals with BeautifulSoup and Requests',
          'Consuming external REST APIs and parsing nested JSON data structures'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 80
      }
    ]
  },
  {
    id: 'domain-4',
    slug: 'mathematics-statistics',
    number: 4,
    name: 'Mathematics & Statistics',
    classification: 'CORE SKILL',
    defaultPriority: 'Level 1',
    tagline: 'The mathematical rigor behind probability, inference, hypothesis testing, and modeling',
    description: 'Ground analytical thinking in solid statistical theory: probability distributions, Central Limit Theorem, confidence intervals, hypothesis tests (t-tests, ANOVA, Chi-Square), and regression mechanics.',
    tools: ['Python', 'SciPy', 'Statsmodels', 'Excel'],
    prerequisites: ['Basic arithmetic and foundational algebra'],
    learningObjectives: [
      'Summarize distributions accurately avoiding common misleading summary traps.',
      'Apply probability laws, conditional probability, and Bayes’ Theorem to real business events.',
      'Formulate null and alternative hypotheses, choose appropriate tests, and interpret p-values.',
      'Quantify relationships with Pearson/Spearman correlation and ordinary least squares regression.'
    ],
    recommendedProjects: [
      'Statistical A/B Experiment Analysis on Landing Page Conversion Rates',
      'Healthcare Clinical Trial Hypothesis Testing & Power Analysis',
      'Housing Price Ordinary Least Squares (OLS) Regression Diagnostic Model'
    ],
    icon: 'Sigma',
    accent: 'lime',
    topics: [
      {
        id: 'd4-t1',
        title: 'Descriptive Statistics & Data Distributions',
        description: 'Measures of central tendency, dispersion, skewness, and visual distribution shape.',
        subtopics: [
          'Measures of central tendency: Mean, Median, Mode and resilience to outliers',
          'Measures of dispersion: Range, Interquartile Range (IQR), Variance, Standard Deviation',
          'Z-scores and standardization of continuous variables',
          'Distribution shape: Skewness, Kurtosis, and bimodal/multimodal patterns',
          'Five-number summary and box-and-whisker plot interpretation'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 70,
        xpReward: 35
      },
      {
        id: 'd4-t2',
        title: 'Probability Theory & Probability Distributions',
        description: 'Random variables, conditional probability, Bayes rule, and distribution families.',
        subtopics: [
          'Probability axioms, sample spaces, joint, marginal, and conditional probability',
          'Bayes’ Theorem and real-world Bayesian updating in fraud/medical testing',
          'Discrete distributions: Bernoulli, Binomial, and Poisson distributions',
          'Continuous distributions: Uniform, Exponential, and Normal (Gaussian) distributions',
          'The Central Limit Theorem (CLT) and the distribution of sample means'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 110,
        xpReward: 60
      },
      {
        id: 'd4-t3',
        title: 'Inferential Statistics & Hypothesis Testing',
        description: 'Formulating hypotheses, significance levels, p-values, and parametric tests.',
        subtopics: [
          'Point estimation, standard error, and Confidence Interval construction',
          'Null Hypothesis (H0) vs. Alternative Hypothesis (H1) framing',
          'Type I (alpha) and Type II (beta) errors, statistical power, and sample sizing',
          'One-sample, two-sample, and paired Student’s t-tests',
          'Z-tests for large sample proportions and means',
          'P-value interpretation, confidence intervals, and avoiding p-hacking'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 130,
        xpReward: 75
      },
      {
        id: 'd4-t4',
        title: 'Categorical & Multi-Group Statistical Tests',
        description: 'Chi-Square tests of independence and Analysis of Variance (ANOVA).',
        subtopics: [
          'Chi-Square Goodness-of-Fit test for categorical frequency distributions',
          'Chi-Square Test of Independence for contingency tables',
          'One-Way Analysis of Variance (ANOVA) for comparing multiple group means',
          'Two-Way ANOVA and interaction effect interpretations',
          'Post-hoc pairwise tests (Tukey HSD) and family-wise error adjustments',
          'Non-parametric alternatives: Mann-Whitney U and Kruskal-Wallis tests'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 75
      },
      {
        id: 'd4-t5',
        title: 'Correlation, Regression & Linear Algebra Foundations',
        description: 'Linear associations, OLS estimation, and vector/matrix fundamentals.',
        subtopics: [
          'Covariance vs. Pearson and Spearman rank correlation coefficients',
          'Simple and multiple Ordinary Least Squares (OLS) linear regression',
          'Regression diagnostic metrics: R-squared, Adjusted R-squared, RMSE, MAE',
          'Checking OLS assumptions: linearity, homoscedasticity, normality of residuals, multicollinearity',
          'Linear algebra fundamentals: vectors, matrices, dot products, and eigenvectors'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 85
      }
    ]
  },
  {
    id: 'domain-5',
    slug: 'data-visualization-bi',
    number: 5,
    name: 'Data Visualization & Business Intelligence',
    classification: 'CORE SKILL',
    defaultPriority: 'Level 1',
    tagline: 'Translating complex datasets into intuitive visual interfaces and business intelligence systems',
    description: 'Learn human-perception visual encoding principles, chart selection mechanics, and industrial mastery across Tableau, Power BI, Looker Studio, and enterprise reporting pipelines.',
    tools: ['Tableau', 'Power BI', 'Looker Studio', 'Qlik Sense', 'Looker', 'Apache Superset'],
    prerequisites: ['Foundational understanding of metrics and dimensions'],
    learningObjectives: [
      'Choose the exact correct visualization type for time-series, categorical, and correlation data.',
      'Build end-to-end Tableau workbooks with parameters, calculated fields, and dashboard actions.',
      'Develop Power BI reports utilizing DAX measures and relational data models.',
      'Deploy enterprise KPI reporting practices with automated data refresh and governance.'
    ],
    recommendedProjects: [
      'Global Supply Chain Logistics & Fulfillment Operations Control Dashboard (Power BI)',
      'SaaS Executive Revenue, Churn & Customer Health Scorecard (Tableau)',
      'Marketing Campaign Multi-Channel Attribution Report (Looker Studio)'
    ],
    icon: 'PieChart',
    accent: 'cyan',
    topics: [
      {
        id: 'd5-t1',
        title: 'Perceptual Design Principles & Chart Taxonomy',
        description: 'Gestalt laws, pre-attentive attributes, and deliberate visual encoding.',
        subtopics: [
          'Pre-attentive attributes (color, size, shape, position, orientation)',
          'Gestalt principles of visual grouping (proximity, similarity, enclosure, continuity)',
          'Chart selection taxonomy: comparison, composition, distribution, and relationship',
          'Common visualization mistakes (truncated axes, 3D charts, rainbow color palettes)',
          'Accessibility standards: color-blind safe palettes and high-contrast styling'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 60,
        xpReward: 35
      },
      {
        id: 'd5-t2',
        title: 'Tableau Desktop & Tableau Public Mastery',
        description: 'Building interactive visual stories, calculated fields, and dashboard actions.',
        subtopics: [
          'Dimensions vs. Measures, Discrete (blue) vs. Continuous (green) pills',
          'Marks card: detail, tooltip, color, and size encoding',
          'Calculated fields, table calculations, and Level of Detail (LOD) expressions (FIXED, INCLUDE, EXCLUDE)',
          'Parameters, dynamic sets, and interactive dashboard filter/highlight actions',
          'Publishing, embedding, and sharing workbooks to Tableau Public'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 140,
        xpReward: 80
      },
      {
        id: 'd5-t3',
        title: 'Power BI Desktop & Enterprise Ecosystem',
        description: 'Data ingestion, star-schema modeling, DAX measures, and report publishing.',
        subtopics: [
          'Power BI ecosystem: Desktop, Service, Gateway, and Mobile experiences',
          'Data modeling: active vs inactive relationships, cross-filter direction, and star schema',
          'DAX calculation essentials: calculated columns vs DAX measures',
          'Advanced DAX: CALCULATE filter context modification and time-intelligence (YTD, SAMEPERIODLASTYEAR)',
          'Visual formatting, drill-through pages, bookmarks, and custom themes'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 150,
        xpReward: 85
      },
      {
        id: 'd5-t4',
        title: 'Modern BI Tools: Looker Studio, Qlik & Open Source',
        description: 'Exploration of Google Looker Studio, enterprise Qlik, and open-source Apache Superset.',
        subtopics: [
          'Google Looker Studio: connecting BigQuery/Sheets, blended data sources, and automated scheduling',
          'Looker & LookML concepts: dimensions, measures, views, and explores',
          'Qlik Sense associative data engine fundamentals',
          'Apache Superset: open-source SQL exploration and dashboarding'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd5-t5',
        title: 'Enterprise KPI Dashboards & BI Governance',
        description: 'Designing mission-critical business scorecards, alert thresholds, and security.',
        subtopics: [
          'Executive KPI scorecard architecture (Leading vs. Lagging indicators)',
          'Threshold alerts, trend indicators, and target progress visualizers',
          'Row-Level Security (RLS) implementation in Power BI and Tableau',
          'Scheduled dataset refreshes, data lineage, and BI governance lifecycle'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 110,
        xpReward: 65
      }
    ]
  },
  {
    id: 'domain-6',
    slug: 'data-cleaning-prep-eda',
    number: 6,
    name: 'Data Cleaning, Preparation & Exploratory Data Analysis',
    classification: 'CORE SKILL',
    defaultPriority: 'Level 1',
    tagline: 'Transforming messy, incomplete real-world records into clean, trustworthy analytical assets',
    description: 'Master the 80% of real analytical work: identifying anomalies, resolving missing data mechanisms, detecting multivariate outliers, scaling features, and conducting exhaustive EDA.',
    tools: ['Python (Pandas/NumPy)', 'OpenRefine', 'Excel', 'SQL'],
    prerequisites: ['Python basics or SQL fundamentals'],
    learningObjectives: [
      'Diagnose missing data mechanisms (MCAR, MAR, MNAR) and apply appropriate imputation.',
      'Detect outliers using both parametric (Z-score) and non-parametric (IQR, Isolation Forest) methods.',
      'Engineer robust categorical and continuous features through scaling and encoding.',
      'Execute systematic univariate, bivariate, and multivariate exploratory data analysis.'
    ],
    recommendedProjects: [
      'Dirty Healthcare Electronic Health Record (EHR) Sanitization Pipeline',
      'Multivariate Credit Card Default Exploratory Data Analysis with Interactive Profiling',
      'Real Estate Feature Engineering & Outlier Transformation Pipeline'
    ],
    icon: 'Sparkles',
    accent: 'lime',
    topics: [
      {
        id: 'd6-t1',
        title: 'Data Ingestion & Integrity Auditing',
        description: 'Assessing raw data quality, structural integrity, schema mismatch, and encoding.',
        subtopics: [
          'Data types and structures: structured, semi-structured (JSON/XML), and unstructured records',
          'Schema validation: identifying type mismatches, truncated strings, and formatting corruptions',
          'Character encoding issues (UTF-8, Latin-1, ASCII) and delimiter misalignments',
          'Data quality dimensions: accuracy, completeness, consistency, timeliness, and uniqueness'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 60,
        xpReward: 30
      },
      {
        id: 'd6-t2',
        title: 'Missing Values & Duplicate Remediation',
        description: 'Detecting missingness mechanisms and executing valid imputation strategies.',
        subtopics: [
          'Missing data mechanisms: MCAR (Completely at Random), MAR (at Random), MNAR (Not at Random)',
          'Imputation techniques: mean, median, mode, forward/backward fill, and KNN imputation',
          'Exact vs. fuzzy duplicate detection and record deduplication strategies',
          'Assessing the systemic risks of naive listwise deletion'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd6-t3',
        title: 'Outlier Detection & Anomalies',
        description: 'Identifying, interpreting, and treating statistical outliers.',
        subtopics: [
          'Parametric outlier detection with Z-Scores and modified Z-Scores',
          'Non-parametric outlier detection using the Interquartile Range (IQR) fence rule',
          'Multivariate outlier identification using Mahalanobis distance and Isolation Forests',
          'Treating outliers: retention, trimming, winsorization, and log transformations'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 100,
        xpReward: 60
      },
      {
        id: 'd6-t4',
        title: 'Data Transformations & Feature Engineering',
        description: 'Scaling continuous features, encoding categoricals, and generating derived metrics.',
        subtopics: [
          'Continuous variable scaling: Min-Max Normalization, Standard Scaling, and Robust Scaling',
          'Categorical encoding: One-Hot Encoding, Label/Ordinal Encoding, and Target Encoding',
          'Feature creation: date/time decomposition, ratios, interaction terms, and binning',
          'Text sanitization basics: case folding, regex cleaning, and stopword removal'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 110,
        xpReward: 65
      },
      {
        id: 'd6-t5',
        title: 'Systematic Exploratory Data Analysis (EDA)',
        description: 'Exhaustive data profiling, hypothesis generation, and pattern discovery.',
        subtopics: [
          'Univariate analysis: continuous distributions, histograms, KDE plots, and value counts',
          'Bivariate analysis: scatter plots, cross-tabulations, and group-by aggregations',
          'Multivariate analysis: correlation heatmaps, pairplots, and dimensional projection',
          'Automated data profiling tools (ydata-profiling, sweetviz) and metadata documentation'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 130,
        xpReward: 75
      }
    ]
  },
  {
    id: 'domain-7',
    slug: 'business-understanding-analytical-thinking',
    number: 7,
    name: 'Business Understanding & Analytical Thinking',
    classification: 'MAJOR DIFFERENTIATOR',
    defaultPriority: 'Level 2',
    tagline: 'Bridging technical data manipulation with commercial value creation and strategic impact',
    description: 'Transform from a passive query writer into a high-leverage strategic advisor. Understand corporate finance, customer unit economics, KPI trees, root-cause frameworks, and executive trade-off evaluation.',
    tools: ['Business Frameworks', 'Financial Models', 'KPI Trees', 'Issue Trees'],
    prerequisites: ['Foundational business awareness and curiosity about commercial systems'],
    learningObjectives: [
      'Deconstruct company business models, revenue engines, and unit economics.',
      'Construct hierarchical KPI trees connecting frontline metrics to top-line enterprise valuation.',
      'Conduct rigorous structured problem solving using MECE, 5 Whys, and Fishbone frameworks.',
      'Quantify the trade-offs, ROI, and break-even points of recommended business interventions.'
    ],
    recommendedProjects: [
      'Comprehensive E-Commerce Unit Economics & Margin Deconstruction Case Study',
      'Root-Cause Analysis on B2B SaaS Churn Spike with Executive Action Plan',
      'Capital Allocation & Cost-Benefit Model for Warehouse Automation'
    ],
    icon: 'Briefcase',
    accent: 'orange',
    topics: [
      {
        id: 'd7-t1',
        title: 'Business Models, Economics & Unit Financials',
        description: 'Deconstructing how enterprises monetize, generate margin, and sustain operations.',
        subtopics: [
          'Business model archetypes: B2B SaaS, E-Commerce, Marketplace, Subscription, and Ad-funded',
          'Revenue, Cost of Goods Sold (COGS), Gross Profit, Operating Expenses (OpEx), and Net Profit',
          'Unit economics: Customer Acquisition Cost (CAC), Lifetime Value (LTV), LTV/CAC ratio, Payback Period',
          'Cash flow dynamics, working capital, and Break-Even analysis',
          'Reading financial statements (Income Statement, Balance Sheet, Cash Flow) as an analyst'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 80,
        xpReward: 45
      },
      {
        id: 'd7-t2',
        title: 'Functional Analytics Domains',
        description: 'Understanding the distinct analytical mandates of departmental business units.',
        subtopics: [
          'Sales analytics: pipeline velocity, win rates, quota attainment, and lead conversion funnels',
          'Marketing analytics: attribution models, ROAS (Return on Ad Spend), CPC, and campaign efficacy',
          'Customer analytics: cohort retention, Net Promoter Score (NPS), and churn segmentation',
          'Operations & Supply Chain analytics: fulfillment latency, inventory turn, and capacity utilization',
          'HR analytics: employee attrition predictive drivers, time-to-hire, and headcount productivity'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 110,
        xpReward: 65
      },
      {
        id: 'd7-t3',
        title: 'Structured Analytical Problem Solving',
        description: 'Applying consulting problem-solving frameworks to messy real-world dilemmas.',
        subtopics: [
          'MECE principle (Mutually Exclusive, Collectively Exhaustive) and issue trees',
          'Root-cause analysis methods: The 5 Whys and Ishikawa (Fishbone) diagrams',
          'Pareto Principle (80/20 Rule) for prioritizing analytical interventions',
          'Strategic frameworks: SWOT, PESTLE, and Porter’s Five Forces from a data perspective',
          'Hypothesis-driven problem solving: prioritizing high-impact validation tests'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 100,
        xpReward: 60
      },
      {
        id: 'd7-t4',
        title: 'Enterprise KPI Trees & Metric Architectures',
        description: 'Constructing robust indicator systems connecting tactical actions to corporate goals.',
        subtopics: [
          'North Star metric definition and leading vs. lagging performance indicators',
          'Constructing hierarchical metric trees (decomposing Revenue into Traffic × Conversion × AOV)',
          'Counter-metrics: avoiding toxic optimizations (e.g., maximizing conversions while destroying margins)',
          'Setting achievable statistical baseline benchmarks and SLA targets'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 100,
        xpReward: 65
      },
      {
        id: 'd7-t5',
        title: 'Decision Modeling & Cost-Benefit Analysis',
        description: 'Evaluating strategic scenarios, risk assessments, and executive recommendations.',
        subtopics: [
          'Cost-Benefit Analysis (CBA) and Net Present Value (NPV) fundamentals',
          'Decision tree modeling under uncertain market conditions',
          'Sensitivity analysis: identifying the most volatile input levers in a model',
          'Translating data findings into unambiguous, risk-adjusted operational recommendations'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 75
      }
    ]
  },
  {
    id: 'domain-8',
    slug: 'communication-presentation-storytelling',
    number: 8,
    name: 'Communication, Presentation & Data Storytelling',
    classification: 'PROFESSIONAL SKILL',
    defaultPriority: 'Level 2',
    tagline: 'Articulating complex technical conclusions into compelling, executive-ready narratives',
    description: 'Ensure your findings are heard and acted upon. Learn structured executive writing, verbal stakeholder alignment, data narrative frameworks, presentation slide design, and defending conclusions against scrutiny.',
    tools: ['PowerPoint', 'Google Slides', 'Narrative Frameworks', 'Notion/Docs'],
    prerequisites: ['Willingness to empathize with non-technical audiences'],
    learningObjectives: [
      'Structure executive communications using Barbara Minto’s Pyramid Principle.',
      'Architect data narratives with clear exposition, conflict, resolution, and action.',
      'Design clean, uncluttered presentation decks with strong visual hierarchy.',
      'Defend analytical findings calmly and credibly during tough stakeholder Q&A.'
    ],
    recommendedProjects: [
      'Executive Board Memo & 5-Slide Deck on Pricing Strategy Revision',
      'Stakeholder Retrospective Report on Q3 Revenue Miss with Action Roadmap',
      'Live Video or Audio Presentation Walkthrough of a Complex Dashboard'
    ],
    icon: 'MessageSquare',
    accent: 'cyan',
    topics: [
      {
        id: 'd8-t1',
        title: 'Written Business Communication & The Pyramid Principle',
        description: 'Drafting structured memos, concise emails, and executive summaries.',
        subtopics: [
          'The Minto Pyramid Principle: starting with the answer (BLUF: Bottom Line Up Front)',
          'Writing crisp Executive Summaries that non-technical leaders can digest in 60 seconds',
          'Tone, precision, and eliminating passive analytical jargon',
          'Documenting analytical assumptions, caveats, and methodology boundaries transparently'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 70,
        xpReward: 40
      },
      {
        id: 'd8-t2',
        title: 'Narrative Data Storytelling Architecture',
        description: 'Transforming cold numbers into an engaging, problem-solving journey.',
        subtopics: [
          'The narrative arc in analytics: Context → Tension/Conflict → Data Evidence → Resolution',
          'Highlighting the human and commercial stakes behind statistical metrics',
          'Designing visual transitions between high-level overview and granular evidence',
          'Call-to-Action (CTA) engineering: guiding stakeholders directly to decision points'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd8-t3',
        title: 'Executive Presentation Design & Deck Architecture',
        description: 'Creating professional slide decks that amplify data rather than obscure it.',
        subtopics: [
          'Slide layout principles: the "One Slide, One Takeaway" rule',
          'Action titles vs. topic titles (e.g., "Retention Dropped 14%" vs. "Retention Overview")',
          'Data visual integration: stripping away chart junk, annotations, and visual anchors',
          'Color psychology for executive presentations (focus color vs. baseline muted tones)'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 80,
        xpReward: 45
      },
      {
        id: 'd8-t4',
        title: 'Verbal Delivery & Stakeholder Management',
        description: 'Presenting to cross-functional leaders, active listening, and managing room dynamics.',
        subtopics: [
          'Tailoring depth for varied audiences (Product Managers vs CFO vs Engineering Leads)',
          'Pacing, vocal modulation, and commanding the room in remote and in-person settings',
          'Dashboard walkthrough techniques: orienting the viewer before revealing insights',
          'Active listening and stakeholder alignment before presenting controversial data'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 90,
        xpReward: 55
      },
      {
        id: 'd8-t5',
        title: 'Defending Analytical Conclusions & Critical Scrutiny',
        description: 'Managing skepticism, hostile questions, and unverified data claims.',
        subtopics: [
          'Anticipating stakeholder objections and stress-testing conclusions beforehand',
          'Handling tough questions gracefully: "I don’t know, but here is how we can verify"',
          'Defending against confirmation bias and executive pet hypotheses',
          'Distinguishing correlation from causation when stakeholders demand definitive proof'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 100,
        xpReward: 60
      }
    ]
  },
  {
    id: 'domain-9',
    slug: 'portfolio-projects-case-studies',
    number: 9,
    name: 'Portfolio, Practical Projects & Case Studies',
    classification: 'CAREER DIFFERENTIATOR / PRACTICAL SKILL',
    defaultPriority: 'Level 2',
    tagline: 'Demonstrating tangible problem-solving ability through public, production-grade projects',
    description: 'Move beyond theoretical knowledge to concrete, verifiable proof of competence. Learn end-to-end project execution, Git repository hygiene, README documentation, and public portfolio presentation.',
    tools: ['Git', 'GitHub', 'Tableau Public', 'Jupyter', 'Kaggle', 'UCI ML Repo'],
    prerequisites: ['Completion of at least two Core Skill domains (SQL, Excel, or Python)'],
    learningObjectives: [
      'Execute the complete 6-stage project lifecycle from problem definition to executive readout.',
      'Curate authentic, non-generic datasets from public and API repositories.',
      'Maintain clean, professional GitHub repositories with comprehensive README documentation.',
      'Construct a distinctive digital portfolio that stands out to hiring managers and recruiters.'
    ],
    recommendedProjects: [
      'End-to-End Retail Omnichannel Revenue & Customer Churn Investigation',
      'Municipal Open Data Transportation & Commuter Density Analysis',
      'Public Financial Market Sentiment vs. Price Movement Tracker'
    ],
    icon: 'FolderGit2',
    accent: 'orange',
    topics: [
      {
        id: 'd9-t1',
        title: 'The End-to-End Analytical Project Workflow',
        description: 'The six stages of a successful, professional portfolio project.',
        subtopics: [
          'Stage 1: Business problem identification and stakeholder scoping',
          'Stage 2: Data sourcing, auditing, and ethical data acquisition',
          'Stage 3: Data cleaning, reshaping, and validation pipeline',
          'Stage 4: In-depth exploratory analysis and statistical testing',
          'Stage 5: Visualization, dashboarding, and interactive artifacts',
          'Stage 6: Strategic recommendations, limitations, and future work documentation'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 80,
        xpReward: 45
      },
      {
        id: 'd9-t2',
        title: 'Dataset Sourcing & Curation Strategy',
        description: 'Finding unique, compelling real-world data and avoiding cliché datasets.',
        subtopics: [
          'Why to avoid overused datasets (Titanic, Iris, Boston Housing) in a professional portfolio',
          'Sourcing high-value public data: Data.gov, World Bank, Kaggle, Google Dataset Search, and UCI',
          'Building unique datasets via public government APIs and ethical web scraping',
          'Dataset licensing, attribution, anonymization, and data usage compliance'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd9-t3',
        title: 'Git, GitHub & Technical Documentation Hygiene',
        description: 'Version control best practices, repository structure, and README storytelling.',
        subtopics: [
          'Git fundamentals: init, commit, branching, pull requests, and merge conflicts',
          'Structuring an analytical repository: data/, notebooks/, src/, reports/, assets/',
          'Crafting high-impact README files with architecture diagrams, key charts, and live links',
          'Cleaning notebooks before publishing (clearing redundant outputs, modularizing code)'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 110,
        xpReward: 65
      },
      {
        id: 'd9-t4',
        title: 'Tiered Project Execution & Complexity Ladder',
        description: 'Progressing from beginner exploratory notebooks to multi-tool enterprise architectures.',
        subtopics: [
          'Tier 1 (Beginner): Single-tool deep dive (e.g., pure SQL or Excel financial dashboard)',
          'Tier 2 (Intermediate): Combined stack (SQL extraction + Python wrangling + Tableau visual)',
          'Tier 3 (Advanced): Full-stack data product with automation, cloud database, and live web view',
          'Scoring projects on analytical rigor, business impact, and code cleanliness'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 70
      },
      {
        id: 'd9-t5',
        title: 'Portfolio Presentation & Professional Distribution',
        description: 'Packaging your projects into a public portfolio that commands recruiter attention.',
        subtopics: [
          'Building a personal portfolio website: structure, bio, project showcases, and contact points',
          'Publishing workbooks to Tableau Public and creating interactive web embeds',
          'Writing insightful LinkedIn project launch posts with carousel slide takeaways',
          'Preparing your project walkthrough for 15-minute live technical interviews'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 100,
        xpReward: 60
      }
    ]
  },
  {
    id: 'domain-10',
    slug: 'data-engineering-warehousing-fundamentals',
    number: 10,
    name: 'Data Engineering & Data Warehousing Fundamentals',
    classification: 'ADDITIONAL TECHNICAL KNOWLEDGE',
    defaultPriority: 'Level 4',
    tagline: 'Understanding the underlying infrastructure, pipelines, and warehouses supporting analytics',
    description: 'Learn how data arrives at your analytical query editor. Understand ETL vs ELT pipelines, orchestration with Airflow, data warehouses (Snowflake, BigQuery), data lakes, and distributed Spark computing.',
    tools: ['Apache Airflow', 'Apache Spark', 'BigQuery', 'Snowflake', 'AWS Redshift', 'dbt'],
    prerequisites: ['Intermediate SQL and basic Python knowledge'],
    learningObjectives: [
      'Distinguish between traditional ETL and modern cloud ELT design paradigms.',
      'Understand the architectural differences between OLTP, OLAP, Data Lakes, and Lakehouses.',
      'Design dimensional schemas with Fact and Dimension tables and handle SCDs.',
      'Appreciate distributed computing principles behind Spark and cloud data warehouses.'
    ],
    recommendedProjects: [
      'Automated Daily ELT Pipeline with Python, DuckDB, and dbt Transformation Tests',
      'Cloud Data Warehouse Star-Schema Design on Google BigQuery',
      'Batch PySpark Log Aggregation and Analytics Pipeline'
    ],
    icon: 'Layers',
    accent: 'ivory',
    topics: [
      {
        id: 'd10-t1',
        title: 'Pipeline Architectures: ETL vs. ELT & Ingestion',
        description: 'How data travels from transactional production systems to analytical lakes.',
        subtopics: [
          'Batch processing vs. real-time stream processing paradigms',
          'Traditional ETL (Extract, Transform, Load) vs. Modern Cloud ELT (Extract, Load, Transform)',
          'Data ingestion patterns: full snapshot vs. change data capture (CDC)',
          'Data validation gates, pipeline schema drift, and ingestion error handling'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 80,
        xpReward: 45
      },
      {
        id: 'd10-t2',
        title: 'Storage Paradigms: OLTP, OLAP, Warehouses & Lakes',
        description: 'Comparing operational transactional stores with analytical column-oriented engines.',
        subtopics: [
          'OLTP (row-oriented, normalized, ACID) vs. OLAP (column-oriented, denormalized, vector scan)',
          'Data Warehouses (BigQuery, Snowflake, Redshift) architecture and compute/storage decoupling',
          'Data Lakes (Amazon S3, Azure ADLS, Parquet format) vs. modern Lakehouses (Delta Lake, Iceberg)',
          'Data Marts: departmental analytical sub-stores and semantic layers'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 100,
        xpReward: 60
      },
      {
        id: 'd10-t3',
        title: 'Dimensional Modeling & Slowly Changing Dimensions',
        description: 'Kimball dimensional modeling principles for performant analytical schemas.',
        subtopics: [
          'Fact tables (additive, semi-additive, non-additive facts) and grain selection',
          'Dimension tables: conformed dimensions, degenerate dimensions, and role-playing dimensions',
          'Star schema vs. Snowflake schema: performance trade-offs in cloud warehouses',
          'Slowly Changing Dimensions (SCD Type 0, Type 1 overwrite, Type 2 historical records, Type 3)'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 70
      },
      {
        id: 'd10-t4',
        title: 'Orchestration & Transformation Frameworks (dbt & Airflow)',
        description: 'Scheduling analytical runs, testing data quality, and DAG pipelines.',
        subtopics: [
          'Directed Acyclic Graphs (DAGs) in workflow orchestration (Apache Airflow basics)',
          'dbt (data build tool) fundamentals: modular SQL models, ref() macros, and documentation',
          'Automated data testing: uniqueness, not_null, accepted_values, and relationship checks',
          'Data lineage graphs and CI/CD deployment for analytical models'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 130,
        xpReward: 75
      },
      {
        id: 'd10-t5',
        title: 'Big Data Fundamentals & Distributed Computing',
        description: 'Scaling past single-machine RAM limits using distributed data engines.',
        subtopics: [
          'Hadoop ecosystem context: HDFS, MapReduce, and legacy big data architecture',
          'Apache Spark fundamentals: RDDs, DataFrames, in-memory processing, and lazy evaluation',
          'PySpark syntax: distributed filtering, aggregations, and window functions',
          'Cloud ecosystem overview: comparing AWS, Google Cloud, and Microsoft Azure data offerings'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 85
      }
    ]
  },
  {
    id: 'domain-11',
    slug: 'advanced-analytics-ml-experimentation',
    number: 11,
    name: 'Advanced Analytics, Machine Learning & Experimentation',
    classification: 'ADVANCED / OPTIONAL FOR ENTRY-LEVEL ANALYSTS',
    defaultPriority: 'Level 4',
    tagline: 'Predictive modeling, supervised algorithms, time-series forecasting, and rigorous A/B testing',
    description: 'Elevate beyond descriptive reporting into predictive insight and scientific experimentation. Master Supervised Learning (Regression, Classification), Unsupervised Clustering, Time-Series (ARIMA), and causal A/B testing.',
    tools: ['Scikit-learn', 'Statsmodels', 'XGBoost', 'Jupyter'],
    prerequisites: ['Python for Data Analytics and Mathematics & Statistics'],
    learningObjectives: [
      'Build and evaluate supervised classification and regression models with Scikit-learn.',
      'Perform customer segmentation using unsupervised K-Means and hierarchical clustering.',
      'Design, power, and analyze end-to-end randomized controlled A/B experiments.',
      'Forecast business demand and time-series trends using decomposition and ARIMA.'
    ],
    recommendedProjects: [
      'Customer Churn Prediction Model with Feature Importance & Retention Policy',
      'E-Commerce Customer Segmentation using RFM and K-Means Clustering',
      'Retail Sales Demand Time-Series Forecasting with Trend/Seasonality Decomposition'
    ],
    icon: 'BrainCircuit',
    accent: 'ivory',
    topics: [
      {
        id: 'd11-t1',
        title: 'Machine Learning Workflow & Core Concepts',
        description: 'Supervised vs. unsupervised learning, train/test splits, and bias-variance tradeoff.',
        subtopics: [
          'Machine Learning taxonomy: Supervised, Unsupervised, and Reinforcement Learning',
          'Train, validation, and test dataset partitioning and cross-validation strategies (K-Fold)',
          'The Bias-Variance tradeoff: underfitting, overfitting, and regularization techniques (L1/L2)',
          'Feature scaling and leakage prevention inside Scikit-learn Pipelines'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd11-t2',
        title: 'Supervised Learning: Classification & Regression',
        description: 'Implementing algorithms and interpreting performance evaluation metrics.',
        subtopics: [
          'Logistic Regression for probability scoring and classification decisions',
          'Decision Trees, Random Forests, and Gradient Boosted Trees (XGBoost/LightGBM)',
          'Classification metrics: Confusion Matrix, Precision, Recall, F1-Score, ROC-AUC curve',
          'Regression algorithms and residual analysis (RMSE, MAE, R-squared)',
          'Feature importance extraction and model explainability (SHAP basics)'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 80
      },
      {
        id: 'd11-t3',
        title: 'Unsupervised Learning & Clustering',
        description: 'Discovering hidden groupings, customer segmentation, and dimensionality reduction.',
        subtopics: [
          'K-Means clustering algorithm: centroid convergence and distance metrics',
          'Optimal cluster selection: Elbow Method and Silhouette Analysis',
          'Hierarchical clustering and dendrogram interpretation',
          'Principal Component Analysis (PCA) for dimensionality reduction and visualization',
          'Business application: RFM (Recency, Frequency, Monetary) behavioral customer clustering'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 70
      },
      {
        id: 'd11-t4',
        title: 'Scientific Experimentation & Rigorous A/B Testing',
        description: 'Designing online experiments, determining sample size, and calculating lift.',
        subtopics: [
          'Randomized controlled trials in digital products and statistical hypothesis framing',
          'Sample size calculation and minimum detectable effect (MDE) based on statistical power',
          'Randomization unit, bucketing, and network spillover/contamination risks',
          'Interpreting A/B test results: conversion lift, p-values, and confidence intervals',
          'Common experimentation pitfalls: peeking at data, multiple testing problem, novelty effect'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 130,
        xpReward: 80
      },
      {
        id: 'd11-t5',
        title: 'Time-Series Analysis & Forecasting',
        description: 'Analyzing temporal trends, seasonality, stationarity, and predictive forecasting.',
        subtopics: [
          'Components of time-series data: Trend, Seasonality, Cyclical patterns, and Residual noise',
          'Time-series decomposition (additive vs. multiplicative models)',
          'Stationarity testing: Augmented Dickey-Fuller (ADF) test and differencing methods',
          'Autoregressive Integrated Moving Average (ARIMA and SARIMA) modeling',
          'Evaluating time-series forecast accuracy: MAPE, MASE, and expanding window backtesting'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 140,
        xpReward: 85
      }
    ]
  },
  {
    id: 'domain-12',
    slug: 'ai-generative-ai-data-analytics',
    number: 12,
    name: 'AI & Generative AI for Data Analytics',
    classification: 'EMERGING PROFESSIONAL SKILL',
    defaultPriority: 'Level 4',
    tagline: 'Leveraging modern LLMs, prompt engineering, and AI copilot workflows for enhanced productivity',
    description: 'Transform how you write SQL, debug Python, generate summaries, and interrogate datasets with Generative AI. Master prompt engineering, Text-to-SQL agents, Retrieval-Augmented Generation (RAG), and responsible AI ethics.',
    tools: ['ChatGPT', 'Claude', 'Gemini', 'GitHub Copilot', 'LangChain', 'Text-to-SQL'],
    prerequisites: ['Basic SQL and Python analytics literacy'],
    learningObjectives: [
      'Harness LLMs to accelerate SQL query authoring, Python debugging, and formula generation.',
      'Employ systematic prompt engineering patterns for precise, hallucination-free outputs.',
      'Understand the architecture of Text-to-SQL pipelines and conversational data agents.',
      'Enforce responsible AI practices: privacy boundaries, bias auditing, and verification checks.'
    ],
    recommendedProjects: [
      'Automated Executive Insights & Anomaly Summarizer using LLM APIs',
      'Domain-Specific Text-to-SQL Query Assistant with Schema Validation',
      'AI-Powered Customer Feedback Sentiment & Topic Clustering Pipeline'
    ],
    icon: 'Sparkle',
    accent: 'ivory',
    topics: [
      {
        id: 'd12-t1',
        title: 'Generative AI & LLM Foundations for Analysts',
        description: 'How modern Transformer models process tokens, predict sequences, and assist cognition.',
        subtopics: [
          'AI vs Machine Learning vs Deep Learning vs Generative AI definitions',
          'Large Language Model architecture basics: tokens, attention mechanisms, and context windows',
          'Strengths and failure modes of LLMs (hallucinations, non-determinism, mathematical blind spots)',
          'The evolving role of the data analyst in an AI-augmented workplace'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 60,
        xpReward: 35
      },
      {
        id: 'd12-t2',
        title: 'Prompt & Context Engineering for Data Tasks',
        description: 'Systematic prompt patterns for structured, repeatable analytical output.',
        subtopics: [
          'Role prompting, task instruction, and explicit output formatting (JSON, markdown, SQL)',
          'Zero-shot, Few-shot prompting, and Chain-of-Thought (CoT) reasoning for calculations',
          'Context injection: passing schema definitions, data dictionaries, and metric definitions',
          'Techniques for minimizing hallucinations and enforcing factual verification'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 80,
        xpReward: 50
      },
      {
        id: 'd12-t3',
        title: 'AI-Assisted Workflow Acceleration',
        description: 'Speeding up SQL drafting, Python code authoring, and spreadsheet formulas.',
        subtopics: [
          'AI-assisted SQL: translating natural language questions into relational queries',
          'AI-assisted Python: generating Pandas transformations, regex expressions, and plotting code',
          'AI-assisted Excel: generating complex nested formulas, dynamic arrays, and VBA scripts',
          'Automated data cleaning with LLMs: normalizing inconsistent categories and entity resolution',
          'Automated narrative report generation and executive bullet point drafting'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 100,
        xpReward: 60
      },
      {
        id: 'd12-t4',
        title: 'Text-to-SQL, RAG & Autonomous Data Agents',
        description: 'Architecting systems that allow non-technical stakeholders to talk to datasets.',
        subtopics: [
          'Text-to-SQL pipeline architecture: schema indexing, prompt construction, and execution guardrails',
          'Retrieval-Augmented Generation (RAG) for internal company documentation and metric catalogs',
          'Autonomous analytical agents: multi-step reasoning, tool-calling, and query execution loops',
          'Conversational analytics platforms: opportunities, security challenges, and adoption roadblocks'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 75
      },
      {
        id: 'd12-t5',
        title: 'Responsible AI, Verification & Enterprise Governance',
        description: 'Safeguarding proprietary data, auditing bias, and enforcing human-in-the-loop review.',
        subtopics: [
          'Data privacy & security: preventing proprietary datasets and PII from training external models',
          'Human-in-the-loop validation: why every AI-generated query must be verified before execution',
          'Model bias, fairness, and ethical issues in automated algorithmic decision-making',
          'Enterprise policies on AI usage, intellectual property, and reproducibility auditing'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 90,
        xpReward: 55
      }
    ]
  },
  {
    id: 'domain-13',
    slug: 'data-governance-security-ethics',
    number: 13,
    name: 'Data Governance, Security & Ethics',
    classification: 'PROFESSIONAL KNOWLEDGE',
    defaultPriority: 'Level 3',
    tagline: 'Preserving data integrity, legal compliance, user privacy, and ethical responsibility',
    description: 'Understand the legal frameworks, security protocols, and ethical guardrails protecting user data. Learn Master Data Management (MDM), access controls, PII anonymization, GDPR, and India’s DPDP Act.',
    tools: ['MDM Frameworks', 'PII Masking', 'GDPR/DPDP Compliance Tools', 'Access Control (RBAC)'],
    prerequisites: ['Foundational database knowledge'],
    learningObjectives: [
      'Implement enterprise data governance models with defined ownership and stewardship.',
      'Enforce security controls including Role-Based Access Control (RBAC) and encryption.',
      'Identify and anonymize Personally Identifiable Information (PII) using robust masking.',
      'Comply with global data privacy regulations including GDPR and India’s DPDP Act.'
    ],
    recommendedProjects: [
      'Enterprise Data Catalog & Lineage Mapping for Customer Financial Records',
      'PII Masking & Automated Anonymization Utility for Analytical Sandbox Databases',
      'Regulatory Compliance & Data Retention Audit Plan for Multi-National Platform'
    ],
    icon: 'ShieldCheck',
    accent: 'orange',
    topics: [
      {
        id: 'd13-t1',
        title: 'Data Governance Frameworks & Stewardship',
        description: 'Establishing accountability, ownership, cataloging, and quality standards.',
        subtopics: [
          'Data governance definition, corporate objectives, and operational steering committees',
          'Data ownership, data stewardship, and data custodianship roles and responsibilities',
          'Data quality frameworks: monitoring accuracy, completeness, validity, and consistency',
          'Data catalogs, metadata management, and business glossaries',
          'Master Data Management (MDM): golden records and single source of truth architecture'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 80,
        xpReward: 45
      },
      {
        id: 'd13-t2',
        title: 'Data Security, Authentication & Access Control',
        description: 'Securing database storage, transit channels, and role-based permissions.',
        subtopics: [
          'Authentication (AuthN) vs. Authorization (AuthZ) mechanisms',
          'Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC) in databases',
          'Encryption standards: Data at Rest (AES-256) vs. Data in Transit (TLS/SSL)',
          'Database security hardening: SQL injection prevention, auditing logs, and backup protocols'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 50
      },
      {
        id: 'd13-t3',
        title: 'Data Privacy, PII & Anonymization Techniques',
        description: 'Protecting individual identities in analytical research and reporting.',
        subtopics: [
          'Personally Identifiable Information (PII) definitions: direct vs. indirect identifiers',
          'Anonymization vs. Pseudonymization vs. Tokenization techniques',
          'Data masking methods: hashing, redaction, perturbation, and synthetic data generation',
          'Re-identification risks: the mosaic effect and differential privacy principles'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 100,
        xpReward: 60
      },
      {
        id: 'd13-t4',
        title: 'Regulatory Compliance: GDPR & India’s DPDP Act',
        description: 'Navigating international and regional data protection mandates.',
        subtopics: [
          'GDPR principles: lawfulness, purpose limitation, data minimization, and right to be forgotten',
          'India’s Digital Personal Data Protection (DPDP) Act: obligations of Data Fiduciaries and Data Principals',
          'Consent management workflows, withdrawal mechanisms, and parental consent for minors',
          'Cross-border data transfer restrictions, data localization, and breach notification penalties'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 110,
        xpReward: 65
      },
      {
        id: 'd13-t5',
        title: 'Analytical Ethics, Fairness & Algorithmic Bias',
        description: 'Ensuring analytical models do not perpetuate discrimination or social harms.',
        subtopics: [
          'Historical and sampling bias in training data and reporting',
          'Algorithmic fairness definitions: demographic parity, equalized odds, and calibration',
          'Transparency, explainability, and the right to human intervention in automated decisions',
          'Ethical dilemmas in data monetization, user tracking, and surveillance capitalism'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 90,
        xpReward: 55
      }
    ]
  },
  {
    id: 'domain-14',
    slug: 'professional-tools-productivity-job-readiness',
    number: 14,
    name: 'Professional Tools, Productivity & Job Readiness',
    classification: 'CAREER PREPARATION',
    defaultPriority: 'Level 5',
    tagline: 'Modern tooling, agile workflows, technical interviewing, and career placement strategy',
    description: 'Bridge the gap between academic analytics and corporate reality. Master VS Code, command-line tooling, Jira agile workflows, technical interview formats (SQL, Python, Excel, Business Case), ATS resumes, and LinkedIn.',
    tools: ['VS Code', 'Git/GitHub', 'Jira', 'Trello', 'Confluence', 'ATS Scanners'],
    prerequisites: ['Completion of Core Skills (Excel, SQL, Python, Statistics)'],
    learningObjectives: [
      'Configure a modern developer workstation with VS Code, Git, and terminal utilities.',
      'Operate productively in modern Agile and Scrum team environments with Jira and Confluence.',
      'Ace technical interviews across live SQL coding, Python algorithms, and Excel tests.',
      'Author ATS-optimized resumes and build an authoritative professional presence on LinkedIn.'
    ],
    recommendedProjects: [
      'Comprehensive Technical Interview Prep Portfolio with 50 Solved SQL & Python LeetCode Challenges',
      'ATS-Optimized Data Analyst Resume with Quantified Impact Metrics',
      'B2B Product Analytics Business Case Study Solution Deck'
    ],
    icon: 'Briefcase',
    accent: 'ivory',
    topics: [
      {
        id: 'd14-t1',
        title: 'Developer Environments & Command-Line Productivity',
        description: 'Setting up an industrial analytics workstation with VS Code, terminal, and Git.',
        subtopics: [
          'Modern code editors: VS Code extensions (Python, SQLTools, GitLens, Prettier)',
          'Command-line (CLI) fundamentals: navigating filesystems, grep, curl, and pipe redirection',
          'Environment isolation with virtual environments and package lock files',
          'Configuring SSH keys, GitHub authentication, and remote development setups'
        ],
        difficulty: 'beginner',
        estimatedMinutes: 70,
        xpReward: 35
      },
      {
        id: 'd14-t2',
        title: 'Agile Methodologies & Team Collaboration Tools',
        description: 'Participating in corporate sprints, issue tracking, and documentation.',
        subtopics: [
          'Agile and Scrum framework: sprints, daily standups, backlog grooming, and retrospectives',
          'Kanban boards and workflow visualization with Jira and Trello',
          'Writing technical specs, data dictionaries, and analytical findings in Confluence/Notion',
          'Collaborative peer review: pull request etiquette and constructive code reviews'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 80,
        xpReward: 45
      },
      {
        id: 'd14-t3',
        title: 'Technical Interview Mastery (SQL, Python, Excel & Stats)',
        description: 'Simulating and conquering live technical interview assessments.',
        subtopics: [
          'Live SQL interview patterns: self-joins, ranking with window functions, and retention cohorts',
          'Python technical challenges: string parsing, data restructuring, and algorithmic efficiency',
          'Excel timed tests: multi-criteria lookups, pivot table synthesis, and speed modeling',
          'Statistical screening questions: explaining p-values, CLT, and A/B testing trade-offs to engineers'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 150,
        xpReward: 90
      },
      {
        id: 'd14-t4',
        title: 'Business Case Study & Analytical Take-Home Tests',
        description: 'Solving complex scenario take-home challenges and presenting to panels.',
        subtopics: [
          'Frameworks for tackling 48-hour take-home analytical assignments',
          'Managing scope: delivering an end-to-end minimum viable solution before polishing',
          'Structuring the presentation readout for interview panels',
          'Behavioral interview mastery: answering with the STAR method (Situation, Task, Action, Result)'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 75
      },
      {
        id: 'd14-t5',
        title: 'Career Branding, Resumes, LinkedIn & ATS Optimization',
        description: 'Positioning yourself effectively in the job market to land interview callbacks.',
        subtopics: [
          'How Applicant Tracking Systems (ATS) parse resumes and optimizing keyword density',
          'Writing bullet points that showcase business impact (e.g., "Achieved X by doing Y, resulting in Z")',
          'Optimizing your LinkedIn profile headline, featured projects, and recommendations',
          'Strategic networking: cold outreach scripts that actually get responses from hiring managers'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 90,
        xpReward: 55
      }
    ]
  },
  {
    id: 'domain-15',
    slug: 'industry-specific-analytics',
    number: 15,
    name: 'Industry-Specific Analytics',
    classification: 'SPECIALIZATION / CAREER DEVELOPMENT',
    defaultPriority: 'Level 3',
    tagline: 'Applying analytical methods to the distinct operational realities of major economic sectors',
    description: 'Master vertical domain nuance. Investigate datasets and KPIs across E-Commerce, Financial Services, B2B SaaS, Healthcare, Supply Chain, and Sports analytics.',
    tools: ['Industry Datasets', 'Financial Models', 'Healthcare Metrics', 'Logistics Simulators'],
    prerequisites: ['Core Skills (SQL, Python/Excel, Business Understanding)'],
    learningObjectives: [
      'Calculate industry-specific KPIs across retail, SaaS, finance, healthcare, and logistics.',
      'Analyze real-world sector datasets and navigate domain-specific constraints.',
      'Identify regulatory, operational, and customer patterns unique to each industry vertical.',
      'Tailor portfolio projects to align directly with target industry job descriptions.'
    ],
    recommendedProjects: [
      'Fintech Credit Risk Default Probability & Delinquency Scorecard',
      'E-Commerce Cart Abandonment & Checkout Funnel Drop-off Diagnostic',
      'Hospital Patient Length of Stay (LOS) & Readmission Rate Reduction Model'
    ],
    icon: 'TrendingUp',
    accent: 'orange',
    topics: [
      {
        id: 'd15-t1',
        title: 'E-Commerce & Retail Analytics',
        description: 'Customer shopping dynamics, cart funnels, merchandising, and inventory turnover.',
        subtopics: [
          'Key retail metrics: GMV, AOV, Conversion Rate, Cart Abandonment Rate, and Return Rate',
          'Market Basket Analysis: Association Rule Mining (Support, Confidence, Lift)',
          'Merchandise hierarchy: category sales velocity, sell-through rate, and markdown elasticity',
          'Omnichannel attribution and cross-device customer journey stitching'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 100,
        xpReward: 60
      },
      {
        id: 'd15-t2',
        title: 'Financial Services & Fintech Analytics',
        description: 'Risk assessment, fraud detection, credit scoring, and wealth metrics.',
        subtopics: [
          'Fintech metrics: Transaction Volume (TPV), Net Interest Margin, Delinquency Rate, Charge-off Rate',
          'Credit risk modeling: calculating default probabilities and building scorecard cutoff thresholds',
          'Fraud detection: anomaly scoring on high-velocity transaction streams',
          'Portfolio performance: Sharpe ratio, Value at Risk (VaR), and asset allocation modeling'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 70
      },
      {
        id: 'd15-t3',
        title: 'B2B SaaS & Digital Product Analytics',
        description: 'Subscription mechanics, user activation, feature retention, and MRR growth.',
        subtopics: [
          'SaaS financial metrics: Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), Churn',
          'Net Retention Rate (NRR) vs. Gross Retention Rate (GRR) dynamics',
          'Product engagement: Daily Active Users / Monthly Active Users (DAU/MAU stickiness)',
          'Cohort retention curves, feature adoption funnels, and user activation milestones'
        ],
        difficulty: 'intermediate',
        estimatedMinutes: 110,
        xpReward: 65
      },
      {
        id: 'd15-t4',
        title: 'Healthcare & Life Sciences Analytics',
        description: 'Clinical outcomes, hospital operations, patient journeys, and compliance.',
        subtopics: [
          'Healthcare metrics: Length of Stay (LOS), 30-day Readmission Rates, Patient Wait Times',
          'Electronic Health Record (EHR) data structures and clinical coding (ICD-10, CPT)',
          'Clinical trial analytics: Kaplan-Meier survival curves and adverse event reporting',
          'HIPAA compliance and patient data anonymization constraints'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 120,
        xpReward: 70
      },
      {
        id: 'd15-t5',
        title: 'Supply Chain, Logistics & Sports Analytics',
        description: 'Fulfillment efficiency, inventory safety stock, and athletic performance modeling.',
        subtopics: [
          'Supply chain KPIs: On-Time In-Full (OTIF), Order Lead Time, Days of Inventory on Hand (DOH)',
          'Economic Order Quantity (EOQ) calculation and reorder point determination',
          'Route optimization and transportation fleet capacity utilization',
          'Sports analytics fundamentals: expected goals (xG), player efficiency ratings, and load monitoring'
        ],
        difficulty: 'advanced',
        estimatedMinutes: 110,
        xpReward: 65
      }
    ]
  }
];

export const getDomainById = (id: string): Domain | undefined => {
  return CURRICULUM_DOMAINS.find(d => d.id === id);
};

export const getDomainBySlug = (slug: string): Domain | undefined => {
  return CURRICULUM_DOMAINS.find(d => d.slug === slug);
};

export const getDomainsByClassification = (classification: string): Domain[] => {
  return CURRICULUM_DOMAINS.filter(d => d.classification === classification);
};

export const getDomainsByPriority = (priority: string): Domain[] => {
  return CURRICULUM_DOMAINS.filter(d => d.defaultPriority === priority);
};
