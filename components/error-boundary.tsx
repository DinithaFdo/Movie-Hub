/**
 * Error Boundary Component - Graceful error handling
 */

"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[var(--bg-base)] to-[var(--bg-elevated)] text-center px-4">
            <div className="animate-fade-in space-y-6 max-w-md">
              <div className="flex justify-center">
                <div className="rounded-full bg-destructive/10 p-4">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  Oops! Something went wrong
                </h2>
                <p className="text-[var(--text-secondary)]">
                  We encountered an unexpected error. Please try again.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="text-left bg-[var(--bg-elevated)] rounded-lg p-4 border border-[var(--border-default)]">
                  <summary className="cursor-pointer font-mono text-xs text-[var(--text-muted)]">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto max-h-40 text-destructive">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <button
                onClick={() => {
                  this.setState({ hasError: false });
                  window.location.reload();
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 font-semibold text-black transition-all hover:bg-[var(--primary-light)] hover:scale-105"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
