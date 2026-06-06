import React from "react";
import Link from "next/link";
import TaskForm from "@/components/task-form";

export default function NewTaskPage() {
  return (
    <div className="max-w-2xl mx-auto pt-2">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/tasks"
          className="p-2 rounded-lg transition-colors"
          style={{ color: "var(--tf-text-muted)" }}
          onMouseEnter={undefined}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <p className="text-xs font-medium mb-0.5" style={{ color: "var(--tf-text-faint)" }}>
            Tasks
          </p>
          <h1 className="text-lg font-semibold leading-none" style={{ color: "var(--tf-text)" }}>
            New Task
          </h1>
        </div>
      </div>

      <TaskForm />
    </div>
  );
}