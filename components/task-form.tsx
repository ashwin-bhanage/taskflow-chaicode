"use client";

import React, { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TaskPriority } from "@prisma/client";
import { createTaskAction, updateTaskAction } from "@/actions/tasks";

interface InitialTask {
  id: string;
  title: string;
  description: string | null;
  priority: TaskPriority;
  dueDate: Date | null;
}

interface TaskFormProps {
  initialTask?: InitialTask;
}

// ── Priority config ─────────────────────────────────────────
const PRIORITIES: {
  value: TaskPriority;
  label: string;
  color: string;
  bg: string;
}[] = [
  { value: "HIGH",   label: "High",   color: "var(--tf-red)",   bg: "var(--tf-red-light)"   },
  { value: "MEDIUM", label: "Medium", color: "var(--tf-amber)", bg: "var(--tf-amber-light)" },
  { value: "LOW",    label: "Low",    color: "var(--tf-green)", bg: "var(--tf-green-light)" },
];

const getPriority = (v: TaskPriority) => PRIORITIES.find((p) => p.value === v)!;

// ── Small icons ─────────────────────────────────────────────
const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6H9.5l-1-1H5a2 2 0 00-2 2z" />
  </svg>
);

const ChevronIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

// ── Priority Dropdown ────────────────────────────────────────
function PriorityDropdown({
  value,
  onChange,
  disabled,
}: {
  value: TaskPriority;
  onChange: (v: TaskPriority) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getPriority(value);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
        style={{
          border: `1px solid ${current.color}`,
          color: current.color,
          background: current.bg,
        }}
      >
        <FlagIcon />
        {current.label}
        <ChevronIcon />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-1 rounded-lg overflow-hidden z-50 min-w-[120px]"
          style={{
            background: "var(--tf-surface)",
            border: "1px solid var(--tf-border)",
            boxShadow: "var(--tf-shadow-md)",
          }}
        >
          {PRIORITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => { onChange(p.value); setOpen(false); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left transition-colors"
              style={{ color: p.color }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--tf-surface-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: p.color }}
              />
              {p.label}
              {p.value === value && (
                <svg className="w-3 h-3 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Due Date Button ──────────────────────────────────────────
function DueDatePicker({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const isOverdue =
    value && new Date(value) < new Date(new Date().toDateString());

  const formatted = value
    ? new Date(value).toLocaleDateString(undefined, { month: "short", day: "numeric" })
    : null;

  return (
    <div className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.showPicker()}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors"
        style={{
          border: "1px solid var(--tf-border)",
          color: isOverdue
            ? "var(--tf-red)"
            : value
            ? "var(--tf-blue)"
            : "var(--tf-text-muted)",
          background: isOverdue
            ? "var(--tf-red-light)"
            : value
            ? "var(--tf-blue-light)"
            : "transparent",
        }}
      >
        <CalendarIcon />
        {formatted ?? "Due date"}
        {value && (
          <span
            onClick={(e) => { e.stopPropagation(); onChange(""); }}
            className="ml-0.5 hover:opacity-70"
          >
            ×
          </span>
        )}
      </button>
      {/* hidden native date input — triggered by button above */}
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        tabIndex={-1}
      />
    </div>
  );
}

// ── Main Form ────────────────────────────────────────────────
export default function TaskForm({ initialTask }: TaskFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle]           = useState(initialTask?.title ?? "");
  const [description, setDescription] = useState(initialTask?.description ?? "");
  const [priority, setPriority]     = useState<TaskPriority>(initialTask?.priority ?? "MEDIUM");
  const [dueDate, setDueDate]       = useState(
    initialTask?.dueDate
      ? new Date(initialTask.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [error, setError]           = useState<string | null>(null);
  const [isFocused, setIsFocused]   = useState(false);

  const isEditing  = !!initialTask;
  const charCount  = title.length;
  const charLimit  = 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title.trim()) { setError("Task name is required."); return; }

    startTransition(async () => {
      const result = isEditing
        ? await updateTaskAction(initialTask.id, { title, description, priority, dueDate: dueDate || null })
        : await createTaskAction(title, description, priority, dueDate || null);

      if (result.success) router.push("/tasks");
      else setError(result.error ?? "Something went wrong.");
    });
  };

  return (
    <div className="space-y-3">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl overflow-visible"
        style={{
          border: `1px solid ${isFocused ? "var(--tf-border-hover)" : "var(--tf-border)"}`,
          background: "var(--tf-surface)",
          boxShadow: isFocused ? "var(--tf-shadow-md)" : "var(--tf-shadow)",
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setIsFocused(false);
        }}
      >
        {/* ── Inputs ── */}
        <div className="px-4 pt-4 pb-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              disabled={isPending}
              autoFocus
              maxLength={charLimit}
              className="flex-1 text-sm font-semibold placeholder:font-normal placeholder:text-[var(--tf-text-faint)] outline-none bg-transparent"
              style={{ color: "var(--tf-text)" }}
            />
            {charCount > 70 && (
              <span
                className="text-xs shrink-0 tabular-nums mt-0.5"
                style={{ color: charCount > 90 ? "var(--tf-red)" : "var(--tf-text-faint)" }}
              >
                {charLimit - charCount}
              </span>
            )}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add a description…"
            disabled={isPending}
            rows={3}
            className="w-full text-sm outline-none bg-transparent resize-none placeholder:text-[var(--tf-text-faint)] leading-relaxed"
            style={{ color: "var(--tf-text-muted)" }}
          />
        </div>

        <div style={{ borderTop: "1px solid var(--tf-border)" }} />

        {/* ── Meta row: due date + priority ── */}
        <div className="flex items-center gap-2 px-3 py-2.5 flex-wrap">
          <DueDatePicker value={dueDate} onChange={setDueDate} disabled={isPending} />
          <PriorityDropdown value={priority} onChange={setPriority} disabled={isPending} />
        </div>

        <div style={{ borderTop: "1px solid var(--tf-border)" }} />

        {/* ── Actions ── */}
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-xs hidden sm:block" style={{ color: "var(--tf-text-faint)" }}>
            <kbd className="font-sans">⌘</kbd> + <kbd className="font-sans">Enter</kbd> to save
          </p>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              disabled={isPending}
              onClick={() => router.push("/tasks")}
              className="px-3.5 py-1.5 rounded-lg text-sm font-medium"
              style={{ color: "var(--tf-text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--tf-surface-2)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !title.trim()}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "var(--tf-red)" }}
              onMouseEnter={(e) => { if (!isPending && title.trim()) e.currentTarget.style.background = "var(--tf-red-hover)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--tf-red)")}
            >
              {isPending ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving…
                </span>
              ) : isEditing ? "Save changes" : "Add task"}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div
          className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-medium"
          style={{ background: "var(--tf-red-light)", color: "var(--tf-red)" }}
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}