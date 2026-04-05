"use client";

import { create } from "zustand";
import { Task, TaskFilters, PaginationMeta } from "@/types";

interface TaskState {
  tasks: Task[];
  pagination: PaginationMeta | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;

  setTasks: (tasks: Task[], pagination: PaginationMeta) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  removeTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  resetFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const defaultFilters: TaskFilters = {
  search: "",
  status: "ALL",
  priority: "ALL",
  sortBy: "createdAt",
  sortOrder: "desc",
  page: 1,
  limit: 10,
};

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  pagination: null,
  filters: defaultFilters,
  isLoading: false,
  error: null,

  setTasks: (tasks, pagination) => set({ tasks, pagination }),

  addTask: (task) =>
    set((state) => ({ tasks: [task, ...state.tasks] })),

  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),

  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
    })),

  resetFilters: () => set({ filters: defaultFilters }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
