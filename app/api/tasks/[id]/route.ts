import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// PATCH /api/tasks/[id] - Update a task (title, description, and/or status)
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);

    if (!body) {
      return errorResponse("Malformed JSON request body", 400);
    }

    // Verify task exists in DB
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return errorResponse("Task not found", 404);
    }

    const { title, description, status } = body;
    const updateData: Record<string, unknown> = {};

    // Validate and build dynamic update body
    if (title !== undefined) {
      if (typeof title !== "string" || title.trim() === "") {
        return errorResponse("Task title cannot be empty", 400);
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      if (description !== null && typeof description !== "string") {
        return errorResponse("Task description must be a string or null", 400);
      }
      updateData.description = description ? description.trim() : null;
    }

    if (status !== undefined) {
      if (status !== "PENDING" && status !== "COMPLETED") {
        return errorResponse("Task status must be either 'PENDING' or 'COMPLETED'", 400);
      }
      updateData.status = status;
    }

    // Perform database update
    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: updatedTask }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/tasks/[id] error:", error);
    return errorResponse("Failed to update task", 500);
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    // Verify task exists in DB
    const existingTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!existingTask) {
      return errorResponse("Task not found", 404);
    }

    // Delete from PostgreSQL
    await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: `Task with ID ${id} was deleted successfully.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /api/tasks/[id] error:", error);
    return errorResponse("Failed to delete task", 500);
  }
}
