"use client";

import React, { useTransition, useState } from "react";
import Link from "next/link";
import { TaskPriority, TaskStatus } from "@prisma/client";
import { updateTaskStatusAction, deleteTaskAction } from "@/actions/tasks";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  HIGH:   { label: "High",   color: "var(--tf-red)"   },
  MEDIUM: { label: "Medium", color: "var(--tf-amber)" },
  LOW:    { label: "Low",    color: "var(--tf-green)" },
};

const STATUS_CYCLE: Record<TaskStatus, TaskStatus> = {
  PENDING:     "IN_PROGRESS",
  IN_PROGRESS: "COMPLETED",
  COMPLETED:   "PENDING",
};

function formatDueDate(date: Date) {
  const today    = new Date(); today.setHours(0,0,0,0);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const due      = new Date(date);  due.setHours(0,0,0,0);

  if (due.getTime() === today.getTime())    return { label: "Today",    overdue: false };
  if (due.getTime() === tomorrow.getTime()) return { label: "Tomorrow", overdue: false };
  const overdue = due < today;
  return {
    label: due.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    overdue,
  };
}

// Circle shows status: empty=PENDING, half=IN_PROGRESS, filled=COMPLETED
function StatusCircle({ status }: { status: TaskStatus }) {
  const isCompleted  = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";

  return (
    <div
      className="flex-shrink-0 flex items-center justify-center rounded-full border-2 transition-all"
      style={{
        width: "18px",
        height: "18px",
        borderColor: isCompleted
          ? "var(--tf-green)"
          : isInProgress
          ? "var(--tf-blue)"
          : "var(--tf-text-faint)",
        background: isCompleted
          ? "var(--tf-green)"
          : isInProgress
          ? "var(--tf-blue-light)"
          : "transparent",
      }}
    >
      {isCompleted && (
        <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {isInProgress && (
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: "var(--tf-blue)" }}
        />
      )}
    </div>
  );
}

export default function TaskCard({ task }: { task: Task }) {
  const [isPending, startTransition] = useTransition();
  const priority = PRIORITY_CONFIG[task.priority] ?? PRIORITY_CONFIG["MEDIUM"];
  const isCompleted = task.status === "COMPLETED";
  const due = task.dueDate ? formatDueDate(new Date(task.dueDate)) : null;

  const handleStatusCycle = () => {
    startTransition(async () => {
      await updateTaskStatusAction(task.id, STATUS_CYCLE[task.status]);
    });
  };

  const handleDelete = () => {
    if (confirm("Delete this task permanently?")) {
      startTransition(async () => {
        await deleteTaskAction(task.id);
      });
    }
  };

  return (
    <div
      className="group flex items-start gap-3 px-2 py-3 rounded-lg transition-colors"
      style={{
        borderBottom: "1px solid var(--tf-border)",
        opacity: isPending ? 0.5 : 1,
        pointerEvents: isPending ? "none" : "auto",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--tf-surface-2)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {/* Status circle — cycles PENDING → IN_PROGRESS → COMPLETED → PENDING */}
      <button
        type="button"
        onClick={handleStatusCycle}
        disabled={isPending}
        className="mt-0.5"
        aria-label="Cycle task status"
        title={`Status: ${task.status.replace("_", " ")} — click to advance`}
      >
        <StatusCircle status={task.status} />
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-snug truncate"
          style={{
            color: isCompleted ? "var(--tf-text-faint)" : "var(--tf-text)",
            textDecoration: isCompleted ? "line-through" : "none",
          }}
        >
          {task.title}
        </p>

        {task.description && (
          <p
            className="text-xs mt-0.5 truncate"
            style={{
              color: "var(--tf-text-faint)",
              textDecoration: isCompleted ? "line-through" : "none",
            }}
          >
            {task.description}
          </p>
        )}

        {/* Meta tags row */}
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {/* Priority badge */}
          <span
            className="text-xs font-medium flex items-center gap-1"
            style={{ color: priority.color }}
          >
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H9.5l-1-1H5a2 2 0 00-2 2z" />
            </svg>
            {priority.label}
          </span>

          {/* Due date badge */}
          {due && (
            <span
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: due.overdue ? "var(--tf-red)" : "var(--tf-text-faint)" }}
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {due.overdue ? `Overdue · ${due.label}` : due.label}
            </span>
          )}

          {/* IN_PROGRESS label */}
          {task.status === "IN_PROGRESS" && (
            <span className="text-xs font-medium" style={{ color: "var(--tf-blue)" }}>
              In progress
            </span>
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5">
        <Link
          href={`/tasks/${task.id}`}
          title="Edit task"
          className="p-1.5 rounded-md transition-colors"
          style={{ color: "var(--tf-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--tf-border)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={handleDelete}
          title="Delete task"
          className="p-1.5 rounded-md transition-colors"
          style={{ color: "var(--tf-text-muted)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--tf-red-light)";
            e.currentTarget.style.color = "var(--tf-red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--tf-text-muted)";
          }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}