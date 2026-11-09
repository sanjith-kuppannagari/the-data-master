import React, { useMemo, useRef, useState } from 'react';
import {
  Database,
  Upload,
  Search,
  ArrowUpDown,
  Table2,
  BarChart3,
  RotateCcw,
  BookmarkPlus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Sigma,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useUser } from '../../context/UserContext';
import {
  computeDatasetNumericStats,
  PRELOADED_PLAYGROUND_DATASETS,
  profileDatasetColumns,
  validateAndParseDatasetFile,
} from '../../services/datasetService';
import { PlaygroundDataset } from '../../types/practice';

export const DatasetPlaygroundPage: React.FC = () => {
  const { user, saveDatasetFinding, deleteDatasetFinding } = useUser();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [uploadedDatasets, setUploadedDatasets] = useState<PlaygroundDataset[]>([]);
  const [activeDatasetId, setActiveDatasetId] = useState<string>(
    PRELOADED_PLAYGROUND_DATASETS[0].id
  );
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Exploration controls
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCol, setFilterCol] = useState<string>('all');
  const [filterVal, setFilterVal] = useState<string>('');
  const [sortCol, setSortCol] = useState<string>('');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'table' | 'chart' | 'stats'>('table');

  // Chart View state
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [chartX, setChartX] = useState<string>('');
  const [chartY, setChartY] = useState<string>('');

  // Save Finding state
  const [findingTitle, setFindingTitle] = useState<string>('');
  const [findingObservation, setFindingObservation] = useState<string>('');
  const [findingMetric, setFindingMetric] = useState<string>('');

  const allDatasets = useMemo(
    () => [...PRELOADED_PLAYGROUND_DATASETS, ...uploadedDatasets],
    [uploadedDatasets]
  );

  const activeDataset = useMemo(
    () =>
      allDatasets.find((d) => d.id === activeDatasetId) ||
      PRELOADED_PLAYGROUND_DATASETS[0],
    [allDatasets, activeDatasetId]
  );

  const columnProfiles = useMemo(
    () => profileDatasetColumns(activeDataset.rows),
    [activeDataset]
  );

  const numericStats = useMemo(
    () => computeDatasetNumericStats(activeDataset.rows),
    [activeDataset]
  );

  const totalMissingCells = useMemo(
    () => columnProfiles.reduce((acc, c) => acc + c.missingCount, 0),
    [columnProfiles]
  );

  // Ensure chart axes default to valid columns when dataset switches
  const effectiveChartX = useMemo(() => {
    if (chartX && columnProfiles.some((c) => c.name === chartX)) return chartX;
    const strCol = columnProfiles.find((c) => c.type === 'string' || c.type === 'date');
    return strCol?.name || columnProfiles[0]?.name || '';
  }, [chartX, columnProfiles]);

  const effectiveChartY = useMemo(() => {
    if (chartY && columnProfiles.some((c) => c.name === chartY)) return chartY;
    const numCol = columnProfiles.find((c) => c.type === 'number');
    return numCol?.name || columnProfiles[1]?.name || columnProfiles[0]?.name || '';
  }, [chartY, columnProfiles]);

  // Filtered & Sorted Rows
  const processedRows = useMemo(() => {
    let rows = [...activeDataset.rows];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      rows = rows.filter((r) =>
        Object.values(r).some(
          (v) => v !== null && v !== undefined && String(v).toLowerCase().includes(q)
        )
      );
    }

    if (filterCol !== 'all' && filterVal.trim() !== '') {
      const f = filterVal.toLowerCase();
      rows = rows.filter((r) => {
        const cell = r[filterCol];
        if (f === 'null' || f === 'missing') {
          return cell === null || cell === undefined || cell === '';
        }
        return String(cell ?? '').toLowerCase().includes(f);
      });
    }

    if (sortCol) {
      rows.sort((a, b) => {
        const va = a[sortCol];
        const vb = b[sortCol];
        if (va === null || va === undefined) return 1;
        if (vb === null || vb === undefined) return -1;
        if (typeof va === 'number' && typeof vb === 'number') {
          return sortAsc ? va - vb : vb - va;
        }
        return sortAsc
          ? String(va).localeCompare(String(vb))
          : String(vb).localeCompare(String(va));
      });
    }

    return rows;
  }, [activeDataset.rows, searchQuery, filterCol, filterVal, sortCol, sortAsc]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = String(event.target?.result || '');
      const validation = validateAndParseDatasetFile(file.name, content, file.size);

      if (!validation.valid || !validation.dataset) {
        setUploadStatus({
          type: 'error',
          message: validation.error || 'Failed to validate uploaded dataset.',
        });
      } else {
        setUploadedDatasets((prev) => [validation.dataset!, ...prev]);
        setActiveDatasetId(validation.dataset.id);
        setUploadStatus({
          type: 'success',
          message: `Successfully validated & loaded "${validation.dataset.name}" (${validation.dataset.rows.length} rows).`,
        });
        handleResetExploration();
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetExploration = () => {
    setSearchQuery('');
    setFilterCol('all');
    setFilterVal('');
    setSortCol('');
    setSortAsc(true);
  };

  const handleToggleSort = (colName: string) => {
    if (sortCol === colName) {
      setSortAsc(!sortAsc);
    } else {
      setSortCol(colName);
      setSortAsc(true);
    }
  };

  const handleSaveFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findingTitle.trim() || !findingObservation.trim()) return;
    saveDatasetFinding({
      datasetId: activeDataset.id,
      datasetName: activeDataset.name,
      title: findingTitle.trim(),
      observation: findingObservation.trim(),
      metricSummary: findingMetric.trim() || undefined,
    });
    setFindingTitle('');
    setFindingObservation('');
    setFindingMetric('');
  };

  const savedFindings = user.savedFindings || [];

  return (
    <div className="space-y-6 pb-14">
      {/* Header & File Upload Bar */}
      <div className="bg-[#171C26] border border-white/10 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#C6F36B] text-xs font-mono uppercase tracking-widest">
            <Database className="w-4 h-4" />
            Dataset Playground • Exploratory Data Analysis & Hygiene Profiler
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F5F3EA]">
            Inspect, Profile & Visualize Real Datasets
          </h1>
          <p className="text-sm text-[#9BA3B4] max-w-2xl">
            Explore preloaded multi-domain sample datasets or upload your own{' '}
            <code className="text-[#75D6D0]">.csv</code> and{' '}
            <code className="text-[#75D6D0]">.json</code> files for automated schema profiling,
            missing-value audits, descriptive statistics, and visual charting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Upload CSV / JSON Dataset
          </button>
          <button
            type="button"
            onClick={handleResetExploration}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#F5F3EA] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Upload Validation Banner */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            uploadStatus.type === 'success'
              ? 'bg-[#C6F36B]/10 border-[#C6F36B]/40 text-[#F5F3EA]'
              : 'bg-red-500/10 border-red-500/40 text-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs">
            {uploadStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-[#C6F36B] shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{uploadStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setUploadStatus(null)}
            className="text-xs text-[#9BA3B4] hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Dataset Selector Strip (Distinguishing Sample vs User-Uploaded Datasets) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {allDatasets.map((ds) => {
          const isSelected = ds.id === activeDataset.id;
          return (
            <button
              key={ds.id}
              type="button"
              onClick={() => {
                setActiveDatasetId(ds.id);
                handleResetExploration();
              }}
              className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'bg-[#C6F36B]/15 border-[#C6F36B] text-[#F5F3EA]'
                  : 'bg-[#171C26] border-white/10 hover:border-white/25 text-[#F5F3EA]/90'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-semibold ${
                      ds.isUploaded
                        ? 'bg-[#FFAA73]/20 text-[#FFAA73]'
                        : 'bg-[#75D6D0]/15 text-[#75D6D0]'
                    }`}
                  >
                    {ds.isUploaded ? 'User Uploaded' : 'Sample Dataset'}
                  </span>
                  <span className="text-[10px] font-mono text-[#9BA3B4]">
                    {ds.rows.length} rows
                  </span>
                </div>
                <div className="font-display text-sm font-bold leading-snug">
                  {ds.name}
                </div>
              </div>
              <div className="text-[11px] text-[#9BA3B4] line-clamp-2">
                {ds.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dataset Dimensions & Schema Profile Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-4">
          <div className="text-[11px] text-[#9BA3B4] uppercase">Dataset Source</div>
          <div className="font-mono text-xs font-bold text-[#75D6D0] mt-1 truncate">
            {activeDataset.isUploaded ? 'User File Upload' : 'Preloaded Curated Sample'}
          </div>
        </div>
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-4">
          <div className="text-[11px] text-[#9BA3B4] uppercase">Dimensions (R × C)</div>
          <div className="font-display text-xl font-bold text-[#F5F3EA]">
            {activeDataset.rows.length} rows × {columnProfiles.length} cols
          </div>
        </div>
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-4">
          <div className="text-[11px] text-[#9BA3B4] uppercase">Numeric Measures</div>
          <div className="font-display text-xl font-bold text-[#C6F36B]">
            {numericStats.length} columns
          </div>
        </div>
        <div className="bg-[#171C26] border border-white/10 rounded-xl p-4">
          <div className="text-[11px] text-[#9BA3B4] uppercase">Missing / Null Values</div>
          <div
            className={`font-display text-xl font-bold ${
              totalMissingCells > 0 ? 'text-[#FFAA73]' : 'text-[#C6F36B]'
            }`}
          >
            {totalMissingCells} cell(s)
          </div>
        </div>
      </div>

      {/* Column Schema & Missing-Value Hygiene Inspector */}
      <div className="bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#75D6D0]" />
            <span className="font-display text-xs font-bold uppercase tracking-wider text-[#F5F3EA]">
              Schema, Data Types & Missing-Value Profile
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#9BA3B4]">
            Click any column in Table View to sort
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10 text-[#9BA3B4] bg-[#101827]">
                <th className="py-2 px-3">Column Name</th>
                <th className="py-2 px-3">Inferred Type</th>
                <th className="py-2 px-3">Unique Values</th>
                <th className="py-2 px-3">Missing Count (%)</th>
                <th className="py-2 px-3">Sample Values</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {columnProfiles.map((col) => (
                <tr key={col.name} className="hover:bg-white/5">
                  <td className="py-2 px-3 font-bold text-[#F5F3EA]">{col.name}</td>
                  <td className="py-2 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                        col.type === 'number'
                          ? 'bg-[#C6F36B]/15 text-[#C6F36B]'
                          : col.type === 'date'
                          ? 'bg-[#75D6D0]/15 text-[#75D6D0]'
                          : 'bg-white/10 text-[#F5F3EA]'
                      }`}
                    >
                      {col.type}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-[#F5F3EA]/90">{col.uniqueCount}</td>
                  <td className="py-2 px-3">
                    {col.missingCount > 0 ? (
                      <span className="text-[#FFAA73] font-bold">
                        {col.missingCount} ({col.missingPercent}%)
                      </span>
                    ) : (
                      <span className="text-emerald-400">0 (0%)</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-[#9BA3B4] truncate max-w-[260px]">
                    {col.sampleValues.map((v) => String(v)).join(', ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Explorer Controls: Search, Column Filter & View Switcher */}
      <div className="bg-[#171C26] border border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1">
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#9BA3B4] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all rows..."
                className="w-full bg-[#101827] border border-white/15 rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
              />
            </div>

            <select
              value={filterCol}
              onChange={(e) => setFilterCol(e.target.value)}
              className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA]"
            >
              <option value="all">Filter by Column (All)</option>
              {columnProfiles.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {filterCol !== 'all' && (
              <input
                type="text"
                value={filterVal}
                onChange={(e) => setFilterVal(e.target.value)}
                placeholder={`Filter ${filterCol} (or type "null")...`}
                className="bg-[#101827] border border-white/15 rounded-lg px-3 py-1.5 text-xs text-[#F5F3EA] focus:outline-none focus:border-[#C6F36B]"
              />
            )}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-[#101827] p-1 rounded-lg border border-white/10">
            <button
              type="button"
              onClick={() => setActiveView('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeView === 'table'
                  ? 'bg-[#C6F36B] text-[#101827]'
                  : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" /> Table View ({processedRows.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveView('stats')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeView === 'stats'
                  ? 'bg-[#C6F36B] text-[#101827]'
                  : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <Sigma className="w-3.5 h-3.5" /> Descriptive Stats
            </button>
            <button
              type="button"
              onClick={() => setActiveView('chart')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeView === 'chart'
                  ? 'bg-[#C6F36B] text-[#101827]'
                  : 'text-[#9BA3B4] hover:text-[#F5F3EA]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Chart View
            </button>
          </div>
        </div>

        {/* 1. TABLE VIEW */}
        {activeView === 'table' && (
          <div className="overflow-x-auto max-h-[420px] border border-white/10 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="bg-[#101827] sticky top-0">
                <tr>
                  {columnProfiles.map((col) => (
                    <th
                      key={col.name}
                      onClick={() => handleToggleSort(col.name)}
                      className="px-3 py-2.5 text-[#75D6D0] font-semibold border-b border-white/10 cursor-pointer hover:bg-white/5 whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.name}</span>
                        <ArrowUpDown className="w-3 h-3 text-[#9BA3B4]" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#0C121E]">
                {processedRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-white/5">
                    {columnProfiles.map((col) => {
                      const val = row[col.name];
                      return (
                        <td
                          key={col.name}
                          className="px-3 py-2 text-[#F5F3EA]/90 whitespace-nowrap"
                        >
                          {val === null || val === undefined || val === '' ? (
                            <span className="px-1.5 py-0.5 rounded bg-[#FFAA73]/15 text-[#FFAA73] text-[10px]">
                              NULL
                            </span>
                          ) : (
                            String(val)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. DESCRIPTIVE STATISTICS VIEW */}
        {activeView === 'stats' && (
          <div className="overflow-x-auto border border-white/10 rounded-xl">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead className="bg-[#101827]">
                <tr className="border-b border-white/10 text-[#75D6D0]">
                  <th className="py-2.5 px-3">Numeric Column</th>
                  <th className="py-2.5 px-3">Valid N</th>
                  <th className="py-2.5 px-3">Mean</th>
                  <th className="py-2.5 px-3">Median</th>
                  <th className="py-2.5 px-3">Std Dev (s)</th>
                  <th className="py-2.5 px-3">Variance (s²)</th>
                  <th className="py-2.5 px-3">Min / Max</th>
                  <th className="py-2.5 px-3">Q1 / Q3</th>
                  <th className="py-2.5 px-3">IQR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-[#0C121E]">
                {numericStats.map((st) => (
                  <tr key={st.column} className="hover:bg-white/5">
                    <td className="py-2.5 px-3 font-bold text-[#F5F3EA]">{st.column}</td>
                    <td className="py-2.5 px-3 text-[#9BA3B4]">
                      {st.count} {st.missing > 0 ? `(${st.missing} null)` : ''}
                    </td>
                    <td className="py-2.5 px-3 text-[#C6F36B] font-bold">{st.mean}</td>
                    <td className="py-2.5 px-3 text-[#75D6D0] font-bold">{st.median}</td>
                    <td className="py-2.5 px-3 text-[#F5F3EA]">{st.stdDev}</td>
                    <td className="py-2.5 px-3 text-[#9BA3B4]">{st.variance}</td>
                    <td className="py-2.5 px-3 text-[#F5F3EA]">
                      {st.min} / {st.max}
                    </td>
                    <td className="py-2.5 px-3 text-[#F5F3EA]">
                      {st.q1} / {st.q3}
                    </td>
                    <td className="py-2.5 px-3 text-[#FFAA73] font-bold">{st.iqr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. INTERACTIVE CHART VIEW */}
        {activeView === 'chart' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 bg-[#101827] p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#9BA3B4]">Chart Type:</span>
                {(['bar', 'line', 'area'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setChartType(t)}
                    className={`px-2.5 py-1 rounded text-xs uppercase font-mono ${
                      chartType === t
                        ? 'bg-[#C6F36B] text-[#101827] font-bold'
                        : 'bg-white/5 text-[#9BA3B4]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#9BA3B4]">X-Axis:</span>
                <select
                  value={effectiveChartX}
                  onChange={(e) => setChartX(e.target.value)}
                  className="bg-[#171C26] border border-white/15 rounded px-2.5 py-1 text-xs font-mono text-[#F5F3EA]"
                >
                  {columnProfiles.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#9BA3B4]">Y-Axis:</span>
                <select
                  value={effectiveChartY}
                  onChange={(e) => setChartY(e.target.value)}
                  className="bg-[#171C26] border border-white/15 rounded px-2.5 py-1 text-xs font-mono text-[#F5F3EA]"
                >
                  {columnProfiles.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="h-[320px] w-full bg-[#101827] border border-white/10 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'bar' ? (
                  <BarChart data={processedRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                    <XAxis dataKey={effectiveChartX} stroke="#9BA3B4" fontSize={11} />
                    <YAxis stroke="#9BA3B4" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171C26',
                        borderColor: '#ffffff20',
                        color: '#F5F3EA',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey={effectiveChartY} fill="#C6F36B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                ) : chartType === 'line' ? (
                  <LineChart data={processedRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                    <XAxis dataKey={effectiveChartX} stroke="#9BA3B4" fontSize={11} />
                    <YAxis stroke="#9BA3B4" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171C26',
                        borderColor: '#ffffff20',
                        color: '#F5F3EA',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={effectiveChartY}
                      stroke="#75D6D0"
                      strokeWidth={3}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={processedRows}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                    <XAxis dataKey={effectiveChartX} stroke="#9BA3B4" fontSize={11} />
                    <YAxis stroke="#9BA3B4" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#171C26',
                        borderColor: '#ffffff20',
                        color: '#F5F3EA',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={effectiveChartY}
                      stroke="#75D6D0"
                      fill="#75D6D0"
                      fillOpacity={0.25}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Save Findings & Analyst Investigation Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleSaveFinding}
          className="lg:col-span-5 bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-3.5"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C6F36B]">
            <BookmarkPlus className="w-4 h-4" />
            Record Analytical Finding ({activeDataset.name})
          </div>

          <div>
            <label className="text-[11px] text-[#9BA3B4] block mb-1">Finding Headline</label>
            <input
              type="text"
              required
              value={findingTitle}
              onChange={(e) => setFindingTitle(e.target.value)}
              placeholder="e.g. Enterprise Software Orders Drive 61% of Total Profit"
              className="w-full bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs text-[#F5F3EA]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#9BA3B4] block mb-1">
              Supporting Metric Summary (Optional)
            </label>
            <input
              type="text"
              value={findingMetric}
              onChange={(e) => setFindingMetric(e.target.value)}
              placeholder="e.g. Mean Profit = $1,052.71 | Missing Discounts = 16.7%"
              className="w-full bg-[#101827] border border-white/15 rounded-lg px-3 py-2 text-xs font-mono text-[#F5F3EA]"
            />
          </div>

          <div>
            <label className="text-[11px] text-[#9BA3B4] block mb-1">
              Detailed Analytical Observation
            </label>
            <textarea
              required
              rows={3}
              value={findingObservation}
              onChange={(e) => setFindingObservation(e.target.value)}
              placeholder="Document the anomaly, correlation, or business takeaway discovered in this dataset..."
              className="w-full bg-[#101827] border border-white/15 rounded-lg p-3 text-xs text-[#F5F3EA]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#C6F36B] hover:bg-[#b5e555] text-xs font-bold text-[#101827] flex items-center justify-center gap-1.5 transition-colors"
          >
            <BookmarkPlus className="w-4 h-4" /> Save Finding to Notebook
          </button>
        </form>

        <div className="lg:col-span-7 bg-[#171C26] border border-white/10 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#75D6D0]">
              Saved Dataset Findings ({savedFindings.length})
            </span>
            <span className="text-[11px] font-mono text-[#9BA3B4]">
              Persisted in Local Profile
            </span>
          </div>

          {savedFindings.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#9BA3B4]">
              No dataset findings saved yet. Record your first insight on the left!
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {savedFindings.map((f) => (
                <div
                  key={f.id}
                  className="bg-[#101827] border border-white/10 rounded-xl p-3.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#F5F3EA]">{f.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#9BA3B4]">
                        {f.createdAt}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteDatasetFinding(f.id)}
                        className="text-[#9BA3B4] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-[#75D6D0]">
                    Dataset: {f.datasetName}
                    {f.metricSummary ? ` • ${f.metricSummary}` : ''}
                  </div>
                  <p className="text-xs text-[#F5F3EA]/85 leading-relaxed">
                    {f.observation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
