"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, CheckSquare, Inbox } from "lucide-react";
import toast from "react-hot-toast";
import { useTasks } from "@/hooks/useTasks";
import { getErrorMessage } from "@/lib/utils";
import TaskCard from "@/components/tasks/TaskCard";
import TaskFiltersBar from "@/components/tasks/TaskFiltersBar";
import Pagination from "@/components/tasks/Pagination";
import TaskModal from "@/components/tasks/TaskModal";

function TasksContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const {
    tasks,
    pagination,
    filters,
    isLoading,
    error,
    loadTasks,
    toggleTaskById,
    deleteTaskById,
    setFilters,
  } = useTasks();

  const [showCreateModal, setShowCreateModal] = useState(false);

  // Open create modal if ?new=true in URL
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setShowCreateModal(true);
      router.replace("/tasks");
    }
  }, [searchParams, router]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleToggle = async (id: string) => {
    try {
      const task = await toggleTaskById(id);
      toast.success(task.status === "COMPLETED" ? "Task completed! 🎉" : "Task reopened");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTaskById(id);
      toast.success("Task deleted");
      // If we deleted the last item on page > 1, go back
      if (tasks.length === 1 && filters.page > 1) {
        setFilters({ page: filters.page - 1 });
      } else {
        loadTasks();
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const totalFiltered = pagination?.total ?? 0;
  const hasFilters =
    filters.search || filters.status !== "ALL" || filters.priority !== "ALL";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">My Tasks</h1>
          <p className="text-text-secondary text-sm mt-1">
            {pagination
              ? `${pagination.total} task${pagination.total !== 1 ? "s" : ""} total`
              : "Manage and track your work"}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={16} />
          New task
        </button>
      </div>

      {/* Filters */}
      <TaskFiltersBar />

      {/* Task list */}
      <div className="space-y-2">
        {isLoading ? (
          // Skeleton
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-4 h-[72px] shimmer" />
            ))}
          </div>
        ) : error ? (
          <div className="card p-10 text-center">
            <p className="text-red-400 text-sm font-medium">Failed to load tasks</p>
            <p className="text-text-tertiary text-xs mt-1">{error}</p>
            <button onClick={loadTasks} className="btn-secondary mt-4 text-sm">
              Try again
            </button>
          </div>
        ) : tasks.length === 0 ? (
          <div className="card p-12 text-center space-y-3">
            <div className="w-14 h-14 bg-surface-2 rounded-2xl flex items-center justify-center mx-auto">
              {hasFilters ? (
                <Inbox size={22} className="text-text-tertiary" />
              ) : (
                <CheckSquare size={22} className="text-text-tertiary" />
              )}
            </div>
            <div>
              <p className="text-text-secondary font-medium text-sm">
                {hasFilters ? "No tasks match your filters" : "No tasks yet"}
              </p>
              <p className="text-text-tertiary text-xs mt-1">
                {hasFilters
                  ? "Try adjusting your search or filters"
                  : "Create your first task to get started"}
              </p>
            </div>
            {!hasFilters && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary mx-auto mt-1"
              >
                <Plus size={15} />
                Create task
              </button>
            )}
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={(page) => setFilters({ page })}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <TaskModal mode="create" onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

export default function TasksPage() {
  return (
    <Suspense>
      <TasksContent />
    </Suspense>
  );
}
