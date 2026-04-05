"use client";

import { useState } from "react";
import {
  Check, Trash2, Pencil, AlertCircle, Calendar,
} from "lucide-react";
import { Task } from "@/types";
import {
  cn,
  formatDate,
  formatRelativeDate,
  isOverdue,
  getStatusConfig,
  getPriorityConfig,
} from "@/lib/utils";
import TaskModal from "./TaskModal";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit?: (task: Task) => void;
  compact?: boolean;
}

export default function TaskCard({ task, onToggle, onDelete, compact = false }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const statusCfg = getStatusConfig(task.status);
  const priorityCfg = getPriorityConfig(task.priority);
  const overdue = isOverdue(task.dueDate, task.status);
  const isCompleted = task.status === "COMPLETED";

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(task.id);
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "card group flex items-start gap-3 transition-all duration-150",
          "hover:border-border-strong hover:bg-surface-2/30",
          compact ? "p-3.5" : "p-4",
          isCompleted && "opacity-60"
        )}
      >
        {/* Toggle checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={cn(
            "flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5",
            "transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            isCompleted
              ? "bg-status-completed border-status-completed"
              : "border-border-strong hover:border-accent bg-transparent",
            toggling && "opacity-50 cursor-wait"
          )}
        >
          {isCompleted && <Check size={11} strokeWidth={3} className="text-surface-0" />}
          {toggling && !isCompleted && (
            <span className="w-2.5 h-2.5 border border-accent/50 border-t-accent rounded-full animate-spin" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "text-sm font-medium leading-snug",
                  isCompleted ? "line-through text-text-tertiary" : "text-text-primary"
                )}
              >
                {task.title}
              </p>
              {!compact && task.description && (
                <p className="text-xs text-text-tertiary mt-1 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setShowEditModal(true)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-3 transition-all"
                title="Edit task"
              >
                <Pencil size={13} />
              </button>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-7 h-7 flex items-center justify-center rounded-md text-text-tertiary hover:text-red-400 hover:bg-red-500/10 transition-all"
                title="Delete task"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {/* Status badge */}
            <span
              className={cn(
                "badge text-[11px]",
                statusCfg.bg,
                statusCfg.color
              )}
            >
              <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
              {statusCfg.label}
            </span>

            {/* Priority badge */}
            <span
              className={cn(
                "badge text-[11px]",
                priorityCfg.bg,
                priorityCfg.color
              )}
            >
              {priorityCfg.label}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <span
                className={cn(
                  "flex items-center gap-1 text-[11px]",
                  overdue ? "text-red-400" : "text-text-tertiary"
                )}
              >
                {overdue ? (
                  <AlertCircle size={11} />
                ) : (
                  <Calendar size={11} />
                )}
                {formatDate(task.dueDate)}
              </span>
            )}

            {/* Created relative time */}
            {!compact && (
              <span className="text-[11px] text-text-tertiary ml-auto">
                {formatRelativeDate(task.createdAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <TaskModal
          mode="edit"
          task={task}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete confirm */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          taskTitle={task.title}
          onConfirm={async () => {
            await onDelete(task.id);
            setShowDeleteDialog(false);
          }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </>
  );
}
