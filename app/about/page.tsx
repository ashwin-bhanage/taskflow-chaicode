import React from "react";
import Link from "next/link";

export const dynamic = "error";

const features = [
  {
    title: "Full CRUD Task Management",
    desc: "Create, update, complete, and delete tasks in real-time with server-backed actions — no page reloads needed.",
    icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4",
    color: "var(--tf-red)",
    bg: "var(--tf-red-light)",
  },
  {
    title: "Server-Side Rendering",
    desc: "Dashboard statistics fetch live data from PostgreSQL on every request — always accurate, never stale.",
    icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
    color: "var(--tf-blue)",
    bg: "var(--tf-blue-light)",
  },
  {
    title: "Static Site Generation",
    desc: "This about page is pre-built at compile time and served instantly from the CDN edge — zero database cost.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    color: "var(--tf-green)",
    bg: "var(--tf-green-light)",
  },
  {
    title: "Incremental Static Regeneration",
    desc: "Public analytics are cached and serve instantly, while refreshing from the database every 60 seconds in the background.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18",
    color: "var(--tf-amber)",
    bg: "var(--tf-amber-light)",
  },
  {
    title: "Server Actions",
    desc: "Mutations (create/update/delete) run as secure RPC-style server functions — no API boilerplate required.",
    icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "var(--tf-red)",
    bg: "var(--tf-red-light)",
  },
  {
    title: "REST API Routes",
    desc: "Dedicated HTTP JSON endpoints at /api/tasks expose all CRUD operations for programmatic and external access.",
    icon: "M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "var(--tf-blue)",
    bg: "var(--tf-blue-light)",
  },
];

const techStack = [
  { name: "Next.js 16", role: "App Framework", icon: "⬛" },
  { name: "React 19", role: "UI Library", icon: "⚛️" },
  { name: "TypeScript 5", role: "Type Safety", icon: "🔷" },
  { name: "Tailwind CSS 4", role: "Styling", icon: "🎨" },
  { name: "Prisma 7", role: "ORM", icon: "🔺" },
  { name: "PostgreSQL", role: "Database", icon: "🐘" },
  { name: "Neon", role: "DB Hosting", icon: "☁️" },
  { name: "Vercel", role: "Deployment", icon: "▲" },
];

const renderingStrategies = [
  { route: "/", label: "Home", type: "SSR", color: "var(--tf-blue)", bg: "var(--tf-blue-light)" },
  { route: "/tasks", label: "Task List", type: "SSR", color: "var(--tf-blue)", bg: "var(--tf-blue-light)" },
  { route: "/dashboard", label: "Dashboard", type: "SSR", color: "var(--tf-blue)", bg: "var(--tf-blue-light)" },
  { route: "/about", label: "About", type: "SSG", color: "var(--tf-green)", bg: "var(--tf-green-light)" },
  { route: "/public-stats", label: "Public Stats", type: "ISR", color: "var(--tf-amber)", bg: "var(--tf-amber-light)" },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-6 space-y-14">

      {/* Hero */}
      <div className="text-center space-y-4">
        <div
          className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold"
          style={{ background: "var(--tf-red-light)", color: "var(--tf-red)" }}
        >
          Built for learning & production
        </div>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: "var(--tf-text)" }}>
          About TaskFlow
        </h1>
        <p className="text-base leading-relaxed" style={{ color: "var(--tf-text-muted)", maxWidth: "32rem", margin: "0 auto" }}>
          A full-stack personal task management application demonstrating production-grade Next.js 15+ patterns — SSR, SSG, ISR, Server Actions, and REST APIs — all backed by a cloud PostgreSQL database.
        </p>
        <Link
          href="/tasks"
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white mt-2"
          style={{ background: "var(--tf-red)" }}
        >
          Try it now →
        </Link>
      </div>

      {/* Features Grid */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--tf-text-faint)" }}>
          Features
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-xl p-5 space-y-3"
              style={{
                background: "var(--tf-surface)",
                border: "1px solid var(--tf-border)",
                boxShadow: "var(--tf-shadow)",
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: f.bg }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke={f.color} strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                </svg>
              </div>
              <h3 className="font-semibold text-sm" style={{ color: "var(--tf-text)" }}>
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--tf-text-muted)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Rendering strategies */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--tf-text-faint)" }}>
          Rendering Strategies
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--tf-border)", background: "var(--tf-surface)" }}
        >
          {renderingStrategies.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-5 py-3.5"
              style={{ borderBottom: i < renderingStrategies.length - 1 ? "1px solid var(--tf-border)" : "none" }}
            >
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono px-2 py-0.5 rounded" style={{ background: "var(--tf-surface-2)", color: "var(--tf-text-muted)" }}>
                  {s.route}
                </code>
                <span className="text-sm" style={{ color: "var(--tf-text)" }}>{s.label}</span>
              </div>
              <span
                className="text-xs font-bold rounded-md px-2.5 py-1"
                style={{ background: s.bg, color: s.color }}
              >
                {s.type}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: "var(--tf-text-faint)" }}>
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {techStack.map((t, i) => (
            <div
              key={i}
              className="rounded-xl p-4 flex flex-col items-center text-center gap-2"
              style={{
                background: "var(--tf-surface)",
                border: "1px solid var(--tf-border)",
                boxShadow: "var(--tf-shadow)",
              }}
            >
              <span className="text-2xl">{t.icon}</span>
              <span className="text-sm font-semibold" style={{ color: "var(--tf-text)" }}>{t.name}</span>
              <span className="text-xs" style={{ color: "var(--tf-text-faint)" }}>{t.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
