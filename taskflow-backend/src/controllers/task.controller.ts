import { Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";
import { sendSuccess, sendCreated, sendError } from "../utils/response";
import { AuthenticatedRequest, TaskStatus } from "../types";

// GET /tasks
export async function getTasks(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // Filters
    const status = req.query.status as TaskStatus | undefined;
    const priority = req.query.priority as string | undefined;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";

    // Build where clause
    const where: Prisma.TaskWhereInput = {
      userId,
      ...(status && { status }),
      ...(priority && { priority: priority as "LOW" | "MEDIUM" | "HIGH" }),
      ...(search && {
        OR: [
          { title: { contains: search } },
          { description: { contains: search } },
        ],
      }),
    };

    // Valid sort fields
    const validSortFields = ["createdAt", "updatedAt", "title", "dueDate", "priority"];
    const orderByField = validSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderByField]: sortOrder },
      }),
      prisma.task.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    sendSuccess(
      res,
      { tasks },
      undefined,
      200,
      {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    );
  } catch (error) {
    console.error("GetTasks error:", error);
    sendError(res, "Failed to fetch tasks", 500);
  }
}

// POST /tasks
export async function createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "PENDING",
        priority: priority || "MEDIUM",
        dueDate: dueDate ? new Date(dueDate) : null,
        userId,
      },
    });

    sendCreated(res, { task }, "Task created successfully");
  } catch (error) {
    console.error("CreateTask error:", error);
    sendError(res, "Failed to create task", 500);
  }
}

// GET /tasks/:id
export async function getTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      sendError(res, "Task not found", 404);
      return;
    }

    sendSuccess(res, { task });
  } catch (error) {
    console.error("GetTask error:", error);
    sendError(res, "Failed to fetch task", 500);
  }
}

// PATCH /tasks/:id
export async function updateTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { title, description, status, priority, dueDate } = req.body;

    // Verify ownership
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      sendError(res, "Task not found", 404);
      return;
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
      },
    });

    sendSuccess(res, { task }, "Task updated successfully");
  } catch (error) {
    console.error("UpdateTask error:", error);
    sendError(res, "Failed to update task", 500);
  }
}

// DELETE /tasks/:id
export async function deleteTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Verify ownership
    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      sendError(res, "Task not found", 404);
      return;
    }

    await prisma.task.delete({ where: { id } });

    sendSuccess(res, null, "Task deleted successfully");
  } catch (error) {
    console.error("DeleteTask error:", error);
    sendError(res, "Failed to delete task", 500);
  }
}

// PATCH /tasks/:id/toggle
export async function toggleTask(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      sendError(res, "Task not found", 404);
      return;
    }

    // Toggle: PENDING/IN_PROGRESS -> COMPLETED, COMPLETED -> PENDING
    const newStatus = existing.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });

    sendSuccess(res, { task }, `Task marked as ${newStatus.toLowerCase().replace("_", " ")}`);
  } catch (error) {
    console.error("ToggleTask error:", error);
    sendError(res, "Failed to toggle task", 500);
  }
}

// GET /tasks/stats
export async function getTaskStats(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const [total, pending, inProgress, completed] = await Promise.all([
      prisma.task.count({ where: { userId } }),
      prisma.task.count({ where: { userId, status: "PENDING" } }),
      prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { userId, status: "COMPLETED" } }),
    ]);

    sendSuccess(res, {
      stats: { total, pending, inProgress, completed },
    });
  } catch (error) {
    console.error("GetTaskStats error:", error);
    sendError(res, "Failed to fetch task stats", 500);
  }
}
