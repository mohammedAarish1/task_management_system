import api from "@/lib/api";
import { Task, TaskFormData, TaskFilters, TaskStats, PaginationMeta } from "@/types";

interface TasksResponse {
  tasks: Task[];
  pagination: PaginationMeta;
}

export async function fetchTasks(filters: Partial<TaskFilters>): Promise<TasksResponse> {
  const params: Record<string, string | number> = {};

  if (filters.search) params.search = filters.search;
  if (filters.status && filters.status !== "ALL") params.status = filters.status;
  if (filters.priority && filters.priority !== "ALL") params.priority = filters.priority;
  if (filters.sortBy) params.sortBy = filters.sortBy;
  if (filters.sortOrder) params.sortOrder = filters.sortOrder;
  if (filters.page) params.page = filters.page;
  if (filters.limit) params.limit = filters.limit;

  const res = await api.get("/tasks", { params });
  return {
    tasks: res.data.data.tasks,
    pagination: res.data.pagination,
  };
}

export async function fetchTask(id: string): Promise<Task> {
  const res = await api.get(`/tasks/${id}`);
  return res.data.data.task;
}

export async function createTask(data: TaskFormData): Promise<Task> {
  const res = await api.post("/tasks", data);
  return res.data.data.task;
}

export async function updateTask(id: string, data: Partial<TaskFormData>): Promise<Task> {
  const res = await api.patch(`/tasks/${id}`, data);
  return res.data.data.task;
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete(`/tasks/${id}`);
}

export async function toggleTask(id: string): Promise<Task> {
  const res = await api.patch(`/tasks/${id}/toggle`);
  return res.data.data.task;
}

export async function fetchTaskStats(): Promise<TaskStats> {
  const res = await api.get("/tasks/stats");
  return res.data.data.stats;
}
