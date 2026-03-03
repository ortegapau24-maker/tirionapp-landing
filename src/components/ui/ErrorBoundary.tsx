"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    /** Optional custom fallback UI. Receives error and reset function. */
    fallback?: (props: { error: Error; reset: () => void }) => ReactNode;
    /** Optional callback when an error is caught */
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * React Error Boundary for gracefully catching render errors.
 *
 * Use around components that may crash (WebGL/OGL, third-party integrations,
 * streaming SSE chat, etc.) to prevent the entire page from unmounting.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={({ error, reset }) => (
 *   <div>
 *     <p>Something went wrong: {error.message}</p>
 *     <button onClick={reset}>Retry</button>
 *   </div>
 * )}>
 *   <IntegrationSphere />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("[ErrorBoundary] Caught error:", error, errorInfo);
        this.props.onError?.(error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    reset: this.handleReset,
                });
            }

            return (
                <div
                    role="alert"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2rem",
                        gap: "1rem",
                        minHeight: "200px",
                        color: "var(--agency-text-muted, #737373)",
                        fontFamily: "var(--font-geist-sans, system-ui)",
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p style={{ fontSize: "0.875rem", margin: 0 }}>
                        Something went wrong loading this section.
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: "0.5rem 1rem",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            color: "var(--agency-text-main, #fafafa)",
                            background: "var(--agency-surface, #141414)",
                            border: "1px solid var(--agency-border, rgba(255,255,255,0.06))",
                            borderRadius: "0.625rem",
                            cursor: "pointer",
                            fontFamily: "inherit",
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
