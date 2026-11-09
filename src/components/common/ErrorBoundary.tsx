import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[THE DATA MASTER] Unhandled Render Exception Caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleResetToSafe = (): void => {
    window.location.href = '/platform/dashboard';
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="min-h-screen bg-midnight text-slate-100 flex flex-col items-center justify-center p-6 font-sans select-none"
        >
          <div className="w-full max-w-lg p-8 rounded-2xl bg-charcoal border border-charcoal-border shadow-2xl space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-rose-400 font-bold block">
                  Diagnostic Alert
                </span>
                <h1 className="text-xl font-heading font-extrabold text-white">
                  Observatory Render Interrupted
                </h1>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              An unexpected runtime error occurred within this view. Your saved progress, practice streaks, and dataset findings remain safely preserved in local storage.
            </p>

            {this.state.error && (
              <div className="p-3.5 rounded-xl bg-midnight border border-charcoal-border overflow-hidden">
                <p className="text-[11px] font-mono text-rose-300 break-words">
                  {this.state.error.name}: {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 rounded-xl bg-lime hover:bg-lime/90 text-midnight font-heading font-bold text-xs flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Current View
              </button>
              <button
                type="button"
                onClick={this.handleResetToSafe}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-midnight hover:bg-charcoal-elevated border border-charcoal-border text-slate-200 text-xs font-heading font-semibold flex items-center justify-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-lime focus-visible:outline-none"
              >
                <Home className="w-4 h-4" />
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
