"use client";

import { useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTaskStore } from "@/store/task.store";
import { TaskStatus, Priority } from "@/types";
import { cn } from "@/lib/utils";

const statusOptions: { value: TaskStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

const priorityOptions: { value: Priority | "ALL"; label: string }[] = [
  { value: "ALL", label: "Any priority" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const sortOptions = [
  { value: "createdAt|desc", label: "Newest first" },
  { value: "createdAt|asc", label: "Oldest first" },
  { value: "dueDate|asc", label: "Due date (soonest)" },
  { value: "title|asc", label: "Title A–Z" },
  { value: "priority|desc", label: "Priority" },
];

export default function TaskFiltersBar() {
  const { filters, setFilters } = useTaskStore();
  const searchRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const handleSearchChange = useCallback(
    (value: string) => {
      clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        setFilters({ search: value, page: 1 });
      }, 350);
    },
    [setFilters]
  );

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split("|");
    setFilters({ sortBy, sortOrder: sortOrder as "asc" | "desc", page: 1 });
  };

  const clearSearch = () => {
    if (searchRef.current) searchRef.current.value = "";
    setFilters({ search: "", page: 1 });
  };

  const hasActiveFilters =
    filters.status !== "ALL" || filters.priority !== "ALL" || filters.search;

  return (
    <div className="space-y-3">
      {/* Search + Sort row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search tasks..."
            defaultValue={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="input-base pl-9 pr-8"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={`${filters.sortBy}|${filters.sortOrder}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="input-base w-auto min-w-[150px] text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status tabs */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilters({ status: opt.value, page: 1 })}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
              filters.status === opt.value
                ? "bg-accent/15 text-accent border border-accent/20"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-2 border border-transparent"
            )}
          >
            {opt.label}
          </button>
        ))}

        <div className="h-4 w-px bg-border mx-1" />

        {/* Priority filter */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value as Priority | "ALL", page: 1 })}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border bg-transparent",
            filters.priority !== "ALL"
              ? "text-accent border-accent/20 bg-accent/5"
              : "text-text-secondary border-transparent hover:border-border hover:bg-surface-2"
          )}
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              if (searchRef.current) searchRef.current.value = "";
              setFilters({ search: "", status: "ALL", priority: "ALL", page: 1 });
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-red-400 hover:bg-red-500/5 transition-all ml-auto"
          >
            <X size={12} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
