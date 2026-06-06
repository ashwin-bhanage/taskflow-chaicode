import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalTasks, completedTasks, pendingTasks, inProgressTasks] =
    await Promise.all([
      prisma.task.count(),
      prisma.task.count({ where: { status: "COMPLETED" } }),
      prisma.task.count({ where: { status: "PENDING" } }),
      prisma.task.count({ where: { status: "IN_PROGRESS" } }),
    ]);

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: "Total",
      value: totalTasks,
      sub: "All tasks",
      valueColor: "var(--tf-text)",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: "Completed",
      value: completedTasks,
      sub: `${completionRate}% done`,
      valueColor: "var(--tf-green)",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      sub: "Active",
      valueColor: "var(--tf-blue)",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      label: "Pending",
      value: pendingTasks,
      sub: "Not started",
      valueColor: "var(--tf-amber)",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // bar segments for stacked progress
  const segments = [
    { pct: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,  color: "var(--tf-green)" },
    { pct: totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0, color: "var(--tf-blue)"  },
    { pct: totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0,    color: "var(--tf-border)" },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--tf-text)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--tf-text-muted)" }}>
            Task overview and completion stats
          </p>
        </div>
        <a
          href="/tasks/new"
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold text-white"
          style={{ background: "var(--tf-red)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New task
        </a>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 flex flex-col gap-3"
            style={{
              background: "var(--tf-surface)",
              border: "1px solid var(--tf-border)",
              boxShadow: "var(--tf-shadow)",
            }}
          >
            {/* icon */}
            <span style={{ color: s.valueColor }}>{s.icon}</span>

            {/* value */}
            <div>
              <p
                className="text-2xl font-bold leading-none tabular-nums"
                style={{ color: s.valueColor }}
              >
                {s.value}
              </p>
              <p className="text-xs mt-1.5 font-medium" style={{ color: "var(--tf-text-muted)" }}>
                {s.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--tf-text-faint)" }}>
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Progress Card ── */}
      <div
        className="rounded-xl p-5"
        style={{
          background: "var(--tf-surface)",
          border: "1px solid var(--tf-border)",
          boxShadow: "var(--tf-shadow)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>
              Completion rate
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--tf-text-faint)" }}>
              Across all tasks
            </p>
          </div>
          <span
            className="text-2xl font-bold tabular-nums"
            style={{ color: completionRate === 100 ? "var(--tf-green)" : "var(--tf-red)" }}
          >
            {completionRate}%
          </span>
        </div>

        {/* Stacked progress bar */}
        <div className="h-2 rounded-full w-full flex overflow-hidden" style={{ background: "var(--tf-border)" }}>
          {segments.map((seg, i) => (
            <div
              key={i}
              className="h-full transition-all duration-700"
              style={{ width: `${seg.pct}%`, background: seg.color }}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-3">
          {[
            { label: "Completed",   color: "var(--tf-green)" },
            { label: "In progress", color: "var(--tf-blue)"  },
            { label: "Pending",     color: "var(--tf-border-hover)" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
              <span className="text-xs" style={{ color: "var(--tf-text-faint)" }}>{l.label}</span>
            </div>
          ))}
        </div>

        {/* Status message */}
        <div
          className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--tf-border)" }}
        >
          <p className="text-sm" style={{ color: "var(--tf-text-muted)" }}>
            {totalTasks === 0
              ? "No tasks yet. Add your first one."
              : completionRate === 100
              ? "🎉 All tasks completed!"
              : `${completedTasks} of ${totalTasks} tasks done.`}
          </p>
          <Link
            href="/tasks"
            className="text-sm font-medium shrink-0 ml-4"
            style={{ color: "var(--tf-red)" }}
          >
            View all →
          </Link>
        </div>
      </div>

      {/* ── Quick breakdown table ── */}
      {totalTasks > 0 && (
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--tf-surface)",
            border: "1px solid var(--tf-border)",
            boxShadow: "var(--tf-shadow)",
          }}
        >
          <div className="px-5 py-3.5" style={{ borderBottom: "1px solid var(--tf-border)" }}>
            <h2 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>
              Breakdown
            </h2>
          </div>
          {[
            { label: "Completed",   value: completedTasks,   pct: completionRate,                                                    color: "var(--tf-green)" },
            { label: "In Progress", value: inProgressTasks,  pct: totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0, color: "var(--tf-blue)"  },
            { label: "Pending",     value: pendingTasks,     pct: totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0,     color: "var(--tf-amber)" },
          ].map((row, i, arr) => (
            <div
              key={row.label}
              className="flex items-center gap-4 px-5 py-3"
              style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--tf-border)" : undefined }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: row.color }} />
              <span className="text-sm flex-1" style={{ color: "var(--tf-text-muted)" }}>
                {row.label}
              </span>
              <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--tf-text)" }}>
                {row.value}
              </span>
              <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--tf-border)" }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${row.pct}%`, background: row.color }}
                />
              </div>
              <span className="text-xs w-8 text-right tabular-nums" style={{ color: "var(--tf-text-faint)" }}>
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}