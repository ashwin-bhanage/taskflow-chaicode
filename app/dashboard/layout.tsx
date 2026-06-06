import React from "react";
import DashboardNav from "@/components/dashboard-navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">
      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-56 flex-shrink-0">
        <div
          className="rounded-xl p-4"
          style={{
            background: "var(--tf-surface)",
            border: "1px solid var(--tf-border)",
            boxShadow: "var(--tf-shadow)",
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider px-2 mb-3"
            style={{ color: "var(--tf-text-faint)" }}
          >
            Dashboard
          </p>
          <DashboardNav />
        </div>
      </aside>

      {/* ── Content ── */}
      <section className="flex-1 min-w-0">{children}</section>
    </div>
  );
}