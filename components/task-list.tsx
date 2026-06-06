import React from "react";
import Link from "next/link";
import { TaskPriority, TaskStatus } from "@prisma/client";
import TaskCard from "./task-card";

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskListProps {
  tasks: Task[];
}

function Section({ label, count, children, faded = false }: {
  label: string;
  count: number;
  children: React.ReactNode;
  faded?: boolean;
}) {
  return (
    <section className={faded ? "opacity-60" : ""}>
      <div className="flex items-center gap-2 mb-1 pb-2" style={{ borderBottom: "1px solid var(--tf-border)" }}>
        <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--tf-text-muted)" }}>
          {label} · {count}
        </h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

export default function TaskList({ tasks }: TaskListProps) {
  const pending    = tasks.filter((t) => t.status === "PENDING");
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completed  = tasks.filter((t) => t.status === "COMPLETED");

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: "var(--tf-red-light)" }}>
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            style={{ color: "var(--tf-red)" }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="font-semibold text-sm mb-1" style={{ color: "var(--tf-text)" }}>No tasks yet</h3>
        <p className="text-sm mb-5" style={{ color: "var(--tf-text-muted)" }}>
          Add your first task and start getting things done.
        </p>
        <Link href="/tasks/new"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white rounded-lg px-4 py-2.5 hover:opacity-90"
          style={{ background: "var(--tf-red)" }}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add task
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {inProgress.length > 0 && (
        <Section label="In Progress" count={inProgress.length}>
          {inProgress.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
      {pending.length > 0 && (
        <Section label="Pending" count={pending.length}>
          {pending.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
      {completed.length > 0 && (
        <Section label="Completed" count={completed.length} faded>
          {completed.map((t) => <TaskCard key={t.id} task={t} />)}
        </Section>
      )}
    </div>
  );
}