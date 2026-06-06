import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  let isConnected = false;

  try {
    await prisma.$queryRaw`SELECT 1`;
    isConnected = true;
  } catch {
    isConnected = false;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-16">
      {/* Hero */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold mb-2"
          style={{ background: "var(--tf-red-light)", color: "var(--tf-red)" }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--tf-red)" }}></span>
          Personal Task Manager
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight" style={{ color: "var(--tf-text)" }}>
          Organize your work<br />& life, finally.
        </h1>
        <p className="text-base sm:text-lg" style={{ color: "var(--tf-text-muted)", maxWidth: "32rem", margin: "0 auto" }}>
          TaskFlow helps you track everything you need to do — from quick errands to ambitious projects — all in one focused place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <Link
            href="/tasks/new"
            className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: "var(--tf-red)" }}
          >
            Start for free
          </Link>
          <Link
            href="/tasks"
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{ border: "1px solid var(--tf-border)", color: "var(--tf-text)", background: "var(--tf-surface)" }}
          >
            View my tasks
          </Link>
        </div>
      </div>

      {/* Feature triptych */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          {
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            ),
            title: "Simple task tracking",
            desc: "Add tasks in seconds. Check them off as you go.",
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
            title: "Real-time dashboard",
            desc: "Track completion rates and task stats at a glance.",
          },
          {
            icon: (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
              </svg>
            ),
            title: "Always in sync",
            desc: "PostgreSQL-backed. Your data is always persisted.",
          },
        ].map((f, i) => (
          <div
            key={i}
            className="rounded-xl p-5 space-y-3"
            style={{ background: "var(--tf-surface)", border: "1px solid var(--tf-border)" }}
          >
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: "var(--tf-red-light)", color: "var(--tf-red)" }}>
              {f.icon}
            </div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>{f.title}</h3>
            <p className="text-sm" style={{ color: "var(--tf-text-muted)" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* DB Status */}
      <div
        className="rounded-xl px-5 py-4 flex items-center gap-4"
        style={{ background: "var(--tf-surface)", border: "1px solid var(--tf-border)" }}
      >
        <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isConnected ? "bg-green-400" : "bg-rose-400"}`}></span>
          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isConnected ? "bg-green-500" : "bg-rose-500"}`}></span>
        </span>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--tf-text)" }}>
            {isConnected ? "Database connected" : "Database connection failed"}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--tf-text-muted)" }}>
            {isConnected
              ? "PostgreSQL on Neon Cloud is live and accepting connections."
              : "Check your DATABASE_URL in the .env file."}
          </p>
        </div>
      </div>
    </div>
  );
}
