"use client";

import React, { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error details to an error reporting service
    console.error("Global Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 text-center">
      <div className="rounded-2xl border border-rose-100 bg-rose-50/10 p-8 shadow-md dark:border-rose-950/20 dark:bg-zinc-950 max-w-md w-full space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
            Something went wrong!
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            An unexpected error occurred while processing your request. Please try refreshing the dynamic components.
          </p>
          {error.message && (
            <p className="text-xs font-mono bg-zinc-100 dark:bg-zinc-900 text-rose-600 dark:text-rose-400 p-2.5 rounded-lg max-w-full overflow-x-auto truncate">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-indigo-500 active:scale-[0.98]"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 flex justify-center items-center"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
