import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Helper function to return structured errors
function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message },
    { status }
  );
}

// GET /api/tasks - Retrieve all tasks ordered by recent creation
export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: tasks }, { status: 200 });
  } catch (error) {
    console.error("GET /api/tasks error:", error);
    return errorResponse("Failed to fetch tasks from the database", 500);
  }
}

// POST /api/tasks - Create a new task with validation
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return errorResponse("Malformed JSON request body", 400);
    }

    const { title, description, status } = body;

    // Validation
    if (!title || typeof title !== "string" || title.trim() === "") {
      return errorResponse("Task title is required and must be a valid string", 400);
    }

    if (description !== undefined && description !== null && typeof description !== "string") {
      return errorResponse("Task description must be a string", 400);
    }

    if (status && status !== "PENDING" && status !== "COMPLETED") {
      return errorResponse("Task status must be either 'PENDING' or 'COMPLETED'", 400);
    }

    // Create record in PostgreSQL database
    const newTask = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status: status || "PENDING",
      },
    });

    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tasks error:", error);
    return errorResponse("Failed to create task", 500);
  }
}
