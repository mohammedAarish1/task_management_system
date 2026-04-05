"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Task, TaskFormData } from "@/types";
import { useTasks } from "@/hooks/useTasks";
import { getErrorMessage, cn } from "@/lib/utils";
import { format } from "date-fns";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title too long"),
  description: z.string().max(2000, "Description too long").optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
  dueDate: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface TaskModalProps {
  mode: "create" | "edit";
  task?: Task;
  onClose: () => void;
}

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const priorityOptions = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
];

export default function TaskModal({ mode, task, onClose }: TaskModalProps) {
  const { createTask, editTask, loadTasks } = useTasks();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "PENDING",
      priority: task?.priority ?? "MEDIUM",
      dueDate: task?.dueDate
        ? format(new Date(task.dueDate), "yyyy-MM-dd")
        : "",
    },
  });

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: TaskFormData = {
        title: data.title,
        description: data.description || undefined,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      };

      if (mode === "create") {
        await createTask(payload);
        toast.success("Task created!");
      } else {
        await editTask(task!.id, payload);
        toast.success("Task updated!");
      }

      onClose();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full sm:max-w-lg bg-surface-1 border border-border rounded-t-2xl sm:rounded-xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-accent/15 rounded-md flex items-center justify-center">
              {mode === "create" ? (
                <Plus size={14} className="text-accent" />
              ) : (
                <Pencil size={13} className="text-accent" />
              )}
            </div>
            <h2 className="text-base font-semibold text-text-primary">
              {mode === "create" ? "Create task" : "Edit task"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-2 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="What needs to be done?"
              className="input-base"
              autoFocus
            />
            {errors.title && (
              <p className="text-red-400 text-xs">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Add more context (optional)"
              className="input-base resize-none leading-relaxed"
            />
            {errors.description && (
              <p className="text-red-400 text-xs">{errors.description.message}</p>
            )}
          </div>

          {/* Status + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Status</label>
              <select {...register("status")} className="input-base">
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-text-secondary">Priority</label>
              <select {...register("priority")} className="input-base">
                {priorityOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-text-secondary">
              Due date
            </label>
            <input
              {...register("dueDate")}
              type="date"
              className="input-base"
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {mode === "create" ? "Creating..." : "Saving..."}
                </>
              ) : mode === "create" ? (
                <>
                  <Plus size={15} />
                  Create task
                </>
              ) : (
                <>
                  <Pencil size={14} />
                  Save changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
