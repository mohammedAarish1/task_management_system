import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isTomorrow, isPast } from "date-fns";
import { TaskStatus, Priority } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null): string {
  if (!date) return "No due date";
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  return format(d, "MMM d, yyyy");
}

export function formatRelativeDate(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function isOverdue(date: string | Date | null, status: TaskStatus): boolean {
  if (!date || status === "COMPLETED") return false;
  return isPast(new Date(date));
}

export function getStatusConfig(status: TaskStatus) {
  const configs = {
    PENDING: {
      label: "Pending",
      color: "text-status-pending",
      bg: "bg-status-pending-bg",
      border: "border-status-pending/20",
      dot: "bg-status-pending",
    },
    IN_PROGRESS: {
      label: "In Progress",
      color: "text-status-progress",
      bg: "bg-status-progress-bg",
      border: "border-status-progress/20",
      dot: "bg-status-progress",
    },
    COMPLETED: {
      label: "Completed",
      color: "text-status-completed",
      bg: "bg-status-completed-bg",
      border: "border-status-completed/20",
      dot: "bg-status-completed",
    },
  };
  return configs[status];
}

export function getPriorityConfig(priority: Priority) {
  const configs = {
    LOW: {
      label: "Low",
      color: "text-priority-low",
      bg: "bg-priority-low-bg",
      border: "border-priority-low/20",
      dot: "bg-priority-low",
    },
    MEDIUM: {
      label: "Medium",
      color: "text-priority-medium",
      bg: "bg-priority-medium-bg",
      border: "border-priority-medium/20",
      dot: "bg-priority-medium",
    },
    HIGH: {
      label: "High",
      color: "text-priority-high",
      bg: "bg-priority-high-bg",
      border: "border-priority-high/20",
      dot: "bg-priority-high",
    },
  };
  return configs[priority];
}

export function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    return axiosError.response?.data?.message || "Something went wrong";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
