"use client";

import { useCallback, useEffect } from "react";
import toast from "react-hot-toast";
import { useTaskStore } from "@/store/task.store";
import {
  fetchTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  deleteTask as apiDeleteTask,
  toggleTask as apiToggleTask,
  fetchTaskStats,
} from "@/lib/tasks.api";
import { TaskFormData } from "@/types";
import { getErrorMessage } from "@/lib/utils";

export function useTasks() {
  const {
    tasks,
    pagination,
    filters,
    isLoading,
    error,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setFilters,
    resetFilters,
    setLoading,
    setError,
  } = useTaskStore();

  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchTasks(filters);
      setTasks(result.tasks, result.pagination);
    } catch (err) {
      const msg = getErrorMessage(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [filters, setTasks, setLoading, setError]);

  const createTask = useCallback(
    async (data: TaskFormData) => {
      const task = await apiCreateTask(data);
      // Reload to respect sorting/filters
      await loadTasks();
      return task;
    },
    [loadTasks]
  );

  const editTask = useCallback(
    async (id: string, data: Partial<TaskFormData>) => {
      const task = await apiUpdateTask(id, data);
      updateTask(task);
      return task;
    },
    [updateTask]
  );

  const deleteTaskById = useCallback(
    async (id: string) => {
      await apiDeleteTask(id);
      removeTask(id);
    },
    [removeTask]
  );

  const toggleTaskById = useCallback(
    async (id: string) => {
      const task = await apiToggleTask(id);
      updateTask(task);
      return task;
    },
    [updateTask]
  );

  const loadStats = useCallback(async () => {
    return await fetchTaskStats();
  }, []);

  return {
    tasks,
    pagination,
    filters,
    isLoading,
    error,
    loadTasks,
    createTask,
    editTask,
    deleteTaskById,
    toggleTaskById,
    loadStats,
    setFilters,
    resetFilters,
  };
}
