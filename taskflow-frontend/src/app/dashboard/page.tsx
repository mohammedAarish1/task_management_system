"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Clock, Loader, ListTodo, ArrowRight, Plus } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useTasks } from "@/hooks/useTasks";
import { fetchTaskStats } from "@/lib/tasks.api";
import { TaskStats } from "@/types";
import StatCard from "@/components/ui/StatCard";
import TaskCard from "@/components/tasks/TaskCard";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, isLoading, loadTasks, toggleTaskById, deleteTaskById, setFilters } = useTasks();
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    // Load recent tasks
    setFilters({ page: 1, limit: 5, sortBy: "createdAt", sortOrder: "desc" });
  }, [setFilters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    fetchTaskStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setStatsLoading(false));
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const task = await toggleTaskById(id);
      toast.success(
        task.status === "COMPLETED" ? "Task completed! 🎉" : "Task reopened"
      );
      // Refresh stats
      fetchTaskStats().then(setStats).catch(() => {});
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTaskById(id);
      toast.success("Task deleted");
      fetchTaskStats().then(setStats).catch(() => {});
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">
            {greeting()}, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Here&apos;s what&apos;s on your plate today.
          </p>
        </div>
        <Link href="/tasks?new=true" className="btn-primary self-start sm:self-auto">
          <Plus size={16} />
          New task
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total tasks"
          value={stats?.total ?? 0}
          icon={<ListTodo size={18} />}
          color="default"
          loading={statsLoading}
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? 0}
          icon={<Clock size={18} />}
          color="pending"
          loading={statsLoading}
        />
        <StatCard
          label="In progress"
          value={stats?.inProgress ?? 0}
          icon={<Loader size={18} />}
          color="progress"
          loading={statsLoading}
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          icon={<CheckSquare size={18} />}
          color="completed"
          loading={statsLoading}
        />
      </div>

      {/* Completion bar */}
      {stats && stats.total > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary font-medium">Overall progress</span>
            <span className="text-text-primary font-semibold tabular-nums">
              {Math.round((stats.completed / stats.total) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }}
            />
          </div>
          <p className="text-xs text-text-tertiary">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>
      )}

      {/* Recent tasks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-text-primary">Recent tasks</h2>
          <Link
            href="/tasks"
            className="flex items-center gap-1 text-xs text-text-secondary hover:text-accent transition-colors"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-4 h-20 shimmer" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="w-12 h-12 bg-surface-2 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckSquare size={20} className="text-text-tertiary" />
            </div>
            <p className="text-text-secondary text-sm font-medium">No tasks yet</p>
            <p className="text-text-tertiary text-xs mt-1">
              Create your first task to get started
            </p>
            <Link href="/tasks?new=true" className="btn-primary mt-4 inline-flex">
              <Plus size={14} />
              Create task
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
                compact
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
