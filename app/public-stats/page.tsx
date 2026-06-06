import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

// ISR: rebuild at most once every 60 seconds
export const revalidate = 60;

export default async function PublicStatsPage() {
  const [totalTasks, completedTasks, pendingTasks] = await Promise.all([
    prisma.task.count(),
    prisma.task.count({ where: { status: "COMPLETED" } }),
    prisma.task.count({ where: { status: "PENDING" } }),
  ]);

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lastCachedAt = new Date().toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const metricCards = [
    {
      label: "Total Tasks Created",
      value: totalTasks,
      sub: "Across all time",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      color: "var(--tf-text)",
      iconColor: "var(--tf-text-muted)",
      iconBg: "var(--tf-surface-2)",
    },
    {
      label: "Tasks Completed",
      value: completedTasks,
      sub: "Work finished ✓",
      icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "var(--tf-green)",
      iconColor: "var(--tf-green)",
      iconBg: "var(--tf-green-light)",
    },
    {
      label: "Tasks Pending",
      value: pendingTasks,
      sub: "Still to do",
      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
      color: "var(--tf-amber)",
      iconColor: "var(--tf-amber)",
      iconBg: "var(--tf-amber-light)",
    },
    {
      label: "Completion Rate",
      value: `${completionRate}%`,
      sub: completionRate === 100 ? "All done! 🎉" : "Keep going!",
      icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
      color: "var(--tf-red)",
      iconColor: "var(--tf-red)",
      iconBg: "var(--tf-red-light)",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-3"
            style={{ background: "var(--tf-amber-light)", color: "var(--tf-amber)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--tf-amber)" }}></span>
            ISR · Revalidates every 60s
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--tf-text)" }}>
            Public Analytics
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--tf-text-muted)" }}>
            Globally cached task statistics — served at CDN speed.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs" style={{ color: "var(--tf-text-faint)" }}>Last cached at</p>
          <p className="text-sm font-mono font-semibold mt-0.5" style={{ color: "var(--tf-text)" }}>
            {lastCachedAt}
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {metricCards.map((m, i) => (
          <div
            key={i}
            className="rounded-xl p-5"
            style={{
              background: "var(--tf-surface)",
              border: "1px solid var(--tf-border)",
              boxShadow: "var(--tf-shadow)",
            }}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <p className="text-xs font-medium" style={{ color: "var(--tf-text-muted)" }}>{m.label}</p>
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: m.iconBg }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={m.iconColor} strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={m.icon} />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold" style={{ color: m.color }}>{m.value}</p>
            <p className="text-xs mt-2" style={{ color: "var(--tf-text-faint)" }}>{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="rounded-xl p-6"
        style={{
          background: "var(--tf-surface)",
          border: "1px solid var(--tf-border)",
          boxShadow: "var(--tf-shadow)",
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>Overall Completion</h2>
          <span className="text-sm font-bold" style={{ color: completionRate >= 50 ? "var(--tf-green)" : "var(--tf-red)" }}>
            {completionRate}%
          </span>
        </div>
        <div className="h-2.5 rounded-full w-full overflow-hidden" style={{ background: "var(--tf-border)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${completionRate}%`,
              background: completionRate === 100
                ? "var(--tf-green)"
                : `linear-gradient(to right, var(--tf-red), var(--tf-amber))`,
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs" style={{ color: "var(--tf-text-faint)" }}>0%</span>
          <span className="text-xs" style={{ color: "var(--tf-text-faint)" }}>100%</span>
        </div>
      </div>

      {/* ISR Explainer */}
      <div
        className="rounded-xl p-6 space-y-4"
        style={{
          background: "var(--tf-surface)",
          border: "1px solid var(--tf-amber-light)",
          borderLeftWidth: "4px",
          borderLeftColor: "var(--tf-amber)",
        }}
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="var(--tf-amber)" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>
            How Incremental Static Regeneration works
          </h3>
        </div>

        <div className="space-y-3">
          {[
            { step: "1", title: "First visit", desc: "Next.js builds and caches this page on the first request, serving static HTML instantly." },
            { step: "2", title: "Within 60 seconds", desc: "All subsequent visitors receive the same cached static page — zero database queries." },
            { step: "3", title: "After 60 seconds", desc: "The next visitor triggers a background rebuild with fresh database data." },
            { step: "4", title: "Result", desc: "The following visitors receive the newly rebuilt page, and the cycle repeats." },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <span
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: "var(--tf-amber-light)", color: "var(--tf-amber)" }}
              >
                {s.step}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>{s.title}</p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--tf-text-muted)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3" style={{ borderTop: "1px solid var(--tf-border)" }}>
          <div className="flex items-center justify-between text-xs" style={{ color: "var(--tf-text-faint)" }}>
            <span>Revalidation interval: <strong>60 seconds</strong></span>
            <Link href="/dashboard" className="font-medium" style={{ color: "var(--tf-red)" }}>
              View live dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
