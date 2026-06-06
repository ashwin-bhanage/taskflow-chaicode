"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { TaskStatus, TaskPriority } from "@/types";

export interface ActionResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Runtime constants — $Enums has no runtime value in Prisma v7
const VALID_STATUSES   = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;
const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;

const revalidateAll = (id?: string) => {
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
  revalidatePath("/public-stats");
  if (id) revalidatePath(`/tasks/${id}`);
};

export async function createTaskAction(
  title: string,
  description?: string,
  priority?: TaskPriority,
  dueDate?: string | null
): Promise<ActionResponse> {
  if (!title?.trim()) return { success: false, error: "Task title is required" };

  if (priority && !VALID_PRIORITIES.includes(priority as any))
    return { success: false, error: `Invalid priority: ${priority}` };

  try {
    const task = await prisma.task.create({
      data: {
        title:       title.trim(),
        description: description?.trim() || null,
        status:      "PENDING",
        priority:    priority ?? "MEDIUM",
        dueDate:     dueDate ? new Date(dueDate) : null,
      },
    });
    revalidateAll();
    return { success: true, data: task };
  } catch (error) {
    console.error("createTaskAction error:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskAction(
  id: string,
  data: {
    title:       string;
    description?: string;
    priority?:   TaskPriority;
    dueDate?:    string | null;
  }
): Promise<ActionResponse> {
  if (!id)              return { success: false, error: "Task ID is required" };
  if (!data.title?.trim()) return { success: false, error: "Task title is required" };

  if (data.priority && !VALID_PRIORITIES.includes(data.priority as any))
    return { success: false, error: `Invalid priority: ${data.priority}` };

  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title:       data.title.trim(),
        description: data.description?.trim() || null,
        priority:    data.priority ?? "MEDIUM",
        dueDate:     data.dueDate ? new Date(data.dueDate) : null,
      },
    });
    revalidateAll(id);
    return { success: true, data: task };
  } catch (error) {
    console.error("updateTaskAction error:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function updateTaskStatusAction(
  id: string,
  status: TaskStatus
): Promise<ActionResponse> {
  if (!id) return { success: false, error: "Task ID is required" };

  // plain array check — no Object.values(enum) which fails at runtime in Prisma v7
  if (!VALID_STATUSES.includes(status as any))
    return { success: false, error: `Invalid status: ${status}` };

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { status },
    });
    revalidateAll(id);
    return { success: true, data: task };
  } catch (error) {
    console.error("updateTaskStatusAction error:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteTaskAction(id: string): Promise<ActionResponse> {
  if (!id) return { success: false, error: "Task ID is required" };

  try {
    await prisma.task.delete({ where: { id } });
    revalidateAll();
    return { success: true };
  } catch (error) {
    console.error("deleteTaskAction error:", error);
    return { success: false, error: "Failed to delete task" };
  }
}