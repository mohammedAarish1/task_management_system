import AuthGuard from "@/components/auth/AuthGuard";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-surface-0">
        <Sidebar />
        <MobileNav />
        <main className="md:pl-56 pt-14 md:pt-0 min-h-screen">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
