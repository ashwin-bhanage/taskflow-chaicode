import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12 px-4 text-center">
      <div className="rounded-2xl border border-zinc-200/60 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 max-w-md w-full space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
            404
          </h1>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-200">
            Page Not Found
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            The page or task you are looking for does not exist or has been removed from the registry.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/tasks"
            className="block rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow transition-all hover:bg-indigo-500 active:scale-[0.98]"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
