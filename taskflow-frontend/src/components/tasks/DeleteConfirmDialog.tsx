"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmDialogProps {
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function DeleteConfirmDialog({
  taskTitle,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onCancel]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm bg-surface-1 border border-border rounded-xl shadow-2xl animate-scale-in">
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">Delete task</h3>
              <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                Are you sure you want to delete{" "}
                <span className="font-medium text-text-primary">
                  &ldquo;{taskTitle}&rdquo;
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5">
            <button
              onClick={onCancel}
              className="btn-secondary"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                         bg-red-500 hover:bg-red-600 text-white font-medium text-sm
                         transition-all duration-150 active:scale-95
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={14} />
                  Delete task
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
