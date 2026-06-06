import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import TaskForm from "@/components/task-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params;

  // Fetch the task record from the database
  const task = await prisma.task.findUnique({
    where: { id },
  });

  // Trigger global Next.js 404 handler if the task does not exist
  if (!task) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Edit Task
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Modify your task details and update your taskflow.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200/50 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <TaskForm initialTask={task} />
      </div>
    </div>
  );
}
