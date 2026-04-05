import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "default" | "pending" | "progress" | "completed";
  loading?: boolean;
}

const colorMap = {
  default: {
    icon: "bg-surface-3 text-text-secondary",
    value: "text-text-primary",
  },
  pending: {
    icon: "bg-status-pending-bg text-status-pending",
    value: "text-status-pending",
  },
  progress: {
    icon: "bg-status-progress-bg text-status-progress",
    value: "text-status-progress",
  },
  completed: {
    icon: "bg-status-completed-bg text-status-completed",
    value: "text-status-completed",
  },
};

export default function StatCard({ label, value, icon, color, loading }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="card p-5 flex items-center gap-4 hover:border-border-strong transition-colors">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", colors.icon)}>
        {icon}
      </div>
      <div className="min-w-0">
        {loading ? (
          <>
            <div className="h-6 w-10 shimmer rounded mb-1" />
            <div className="h-3.5 w-20 shimmer rounded" />
          </>
        ) : (
          <>
            <p className={cn("text-2xl font-semibold tabular-nums", colors.value)}>{value}</p>
            <p className="text-xs text-text-tertiary mt-0.5">{label}</p>
          </>
        )}
      </div>
    </div>
  );
}
