import React from 'react';

export const ObservatoryLoader: React.FC<{ message?: string }> = ({
  message = 'Calibrating Observatory Telemetry...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 font-sans select-none"
    >
      <div className="relative flex items-center justify-center">
        {/* Radar Ring Animation */}
        <div className="w-16 h-16 rounded-full border border-lime/20 animate-ping absolute" />
        <div className="w-12 h-12 rounded-xl bg-charcoal border border-charcoal-border flex items-center justify-center shadow-xl relative z-10">
          <div className="w-3.5 h-3.5 rounded-full bg-lime animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-lime">
          {message}
        </p>
        <p className="text-[11px] text-slate-400 font-mono">
          Streaming curriculum modules & execution engines
        </p>
      </div>

      <span className="sr-only">Loading page content...</span>
    </div>
  );
};
