"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, CheckSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "My Tasks", icon: CheckSquare },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    setOpen(false);
    toast.promise(logout(), {
      loading: "Signing out...",
      success: "See you later!",
      error: "Something went wrong",
    });
  };

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-surface-1 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M3 9h8M3 13h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="13" r="2.5" fill="white" />
            </svg>
          </div>
          <span className="text-base font-semibold text-text-primary">TaskFlow</span>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-2 transition-colors"
        >
          <Menu size={18} />
        </button>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "md:hidden fixed top-0 right-0 bottom-0 z-50 w-64 bg-surface-1 border-l border-border flex flex-col transition-transform duration-200",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-sm font-semibold text-text-primary">Menu</span>
          <button
            onClick={() => setOpen(false)}
            className="w-7 h-7 flex items-center justify-center text-text-secondary hover:text-text-primary rounded-md hover:bg-surface-2 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/15"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-border space-y-0.5">
          <div className="flex items-center gap-3 px-3 py-2.5">
            <div className="w-7 h-7 bg-accent/15 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-accent">
                {user?.name?.charAt(0).toUpperCase() ?? "U"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-text-primary truncate">{user?.name}</p>
              <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
