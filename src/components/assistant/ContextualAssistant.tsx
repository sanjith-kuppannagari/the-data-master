import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import {
  interpretRuntimeError,
  explainAnalyticalConcept,
  AssistantResponse,
} from '../../services/learningAssistantEngine';
import {
  Brain,
  X,
  Search,
  Sparkles,
  HelpCircle,
  Code2,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const ContextualAssistant: React.FC = () => {
  const { user, updateProfile } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [activeResponse, setActiveResponse] = useState<AssistantResponse | null>(null);

  const isEnabled = user.preferences?.enableAIAssistant !== false;

  if (!isEnabled) return null;

  const quickPrompts = [
    'Window Function',
    'CTE',
    'HAVING vs WHERE',
    'p-value',
    'Tukey Fences',
    'LTV:CAC',
    'Simpson\'s Paradox',
  ];

  const handleQuery = (query: string) => {
    if (!query.trim()) return;

    const lower = query.toLowerCase();
    // Check if looks like a runtime error or a concept
    if (
      lower.includes('error') ||
      lower.includes('near') ||
      lower.includes('syntax') ||
      lower.includes('keyerror') ||
      lower.includes('zerodivision')
    ) {
      const resp = interpretRuntimeError(query, lower.includes('key') ? 'python' : 'sql');
      setActiveResponse(resp);
    } else {
      const resp = explainAnalyticalConcept(query);
      setActiveResponse(resp);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(queryInput);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none font-sans">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Pedagogical Learning Assistant"
          aria-expanded={isOpen}
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-charcoal border border-lime/40 text-soft-ivory shadow-xl hover:border-lime hover:scale-105 transition-all text-xs font-semibold group focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
          title="Open Pedagogical Learning Assistant"
        >
          <div className="w-5 h-5 rounded-full bg-lime/10 border border-lime/40 flex items-center justify-center text-lime group-hover:bg-lime group-hover:text-midnight transition-colors">
            <Brain className="w-3.5 h-3.5" />
          </div>
          <span>Curriculum Assistant</span>
        </button>
      )}

      {/* Assistant Modal Window */}
      {isOpen && (
        <div
          role="region"
          aria-label="Observatory Learning Assistant Dialog"
          className="w-96 sm:w-[420px] bg-charcoal border border-charcoal-border rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-charcoal-border bg-charcoal-muted flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-lime/10 border border-lime/30 text-lime">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-soft-ivory font-mono uppercase tracking-wider">
                  Observatory Learning Assistant
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  Deterministic Local Engine • Zero Cloud Tracking
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
              className="p-1 rounded-lg text-slate-400 hover:text-soft-ivory hover:bg-midnight transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4 scrollbar-thin text-xs">
            {/* Quick Prompt Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Quick Concept Lookups:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map(prompt => (
                  <button
                    key={prompt}
                    onClick={() => {
                      setQueryInput(prompt);
                      handleQuery(prompt);
                    }}
                    className="px-2 py-0.5 rounded-md bg-midnight border border-charcoal-border text-[11px] font-mono text-cyan hover:border-cyan hover:text-soft-ivory transition-all"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={handleFormSubmit} className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={e => setQueryInput(e.target.value)}
                  placeholder="Ask a concept or paste a SQL/Python error..."
                  className="w-full pl-8 pr-3 py-2 bg-midnight border border-charcoal-border rounded-xl text-xs text-soft-ivory focus:outline-none focus:border-lime"
                />
              </div>
            </form>

            {/* Response Card */}
            {activeResponse ? (
              <div className="p-4 rounded-xl bg-midnight/80 border border-lime/30 space-y-3">
                <div className="flex items-center justify-between border-b border-charcoal-border pb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-lime">
                    {activeResponse.topic}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {activeResponse.disclaimer}
                  </span>
                </div>

                <p className="text-slate-200 leading-relaxed font-sans text-xs">
                  {activeResponse.explanation}
                </p>

                {activeResponse.actionableSteps.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan block font-bold">
                      Recommended Steps:
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-300">
                      {activeResponse.actionableSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-lime font-mono shrink-0">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeResponse.codeExample && (
                  <pre className="p-2.5 rounded-lg bg-charcoal border border-charcoal-border text-[11px] font-mono text-cyan overflow-x-auto">
                    {activeResponse.codeExample}
                  </pre>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-midnight/40 border border-charcoal-border text-center text-slate-400 text-xs space-y-2">
                <HelpCircle className="w-6 h-6 text-slate-500 mx-auto" />
                <p>
                  Ask any analytical concept (e.g. "p-value", "CTE", "HAVING vs WHERE") or paste an execution error message to receive instant pedagogical breakdown.
                </p>
              </div>
            )}

            {/* Privacy & Engine Transparency Note */}
            <div className="p-2.5 rounded-lg bg-midnight/50 border border-charcoal-border text-[10px] text-slate-500 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan shrink-0 mt-0.5" />
              <span>
                100% Client-Side Pedagogical Engine. Operates entirely in your browser without transmitting private data or credentials to external APIs.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
