import React from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { TaskPriority } from "@prisma/client";
import TaskList from "@/components/task-list";

export const dynamic = "force-dynamic";

// Prisma returns enum strings — sort HIGH → MEDIUM → LOW manually
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  HIGH:   0,
  MEDIUM: 1,
  LOW:    2,
};

export default async function TasksPage() {
  const tasks = await prisma.task.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Sort: by priority first, then createdAt (already desc from DB)
  const sorted = [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );

  // IN_PROGRESS counts as remaining — not just PENDING
  const remainingCount = tasks.filter(
    (t) => t.status === "PENDING" || t.status === "IN_PROGRESS"
  ).length;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--tf-text)" }}>
            My Tasks
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--tf-text-muted)" }}>
            {remainingCount > 0
              ? `${remainingCount} task${remainingCount === 1 ? "" : "s"} remaining`
              : "All done! Great work."}
          </p>
        </div>
        <Link
          href="/tasks/new"
          className="flex items-center gap-1.5 text-sm font-semibold text-white rounded-lg px-4 py-2.5 hover:opacity-90"
          style={{ background: "var(--tf-red)" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add task
        </Link>
      </div>

      <TaskList tasks={sorted} />
    </div>
  );
}