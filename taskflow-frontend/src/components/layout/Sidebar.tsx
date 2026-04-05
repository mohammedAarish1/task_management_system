"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "My Tasks", icon: CheckSquare },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    toast.promise(logout(), {
      loading: "Signing out...",
      success: "See you later!",
      error: "Something went wrong",
    });
  };

  return (
    <aside className="hidden md:flex flex-col w-56 min-h-screen bg-surface-1 border-r border-border fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-md shadow-accent/20 flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M3 5h12M3 9h8M3 13h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="14" cy="13" r="2.5" fill="white" />
            </svg>
          </div>
          <span className="text-base font-semibold text-text-primary tracking-tight">TaskFlow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-accent/10 text-accent border border-accent/15"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-2"
              )}
            >
              <Icon size={16} className={isActive ? "text-accent" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-7 h-7 bg-accent/15 border border-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-accent">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:text-red-400 hover:bg-red-500/5 transition-all duration-150"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
