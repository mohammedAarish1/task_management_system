export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-0 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-surface-1 border-r border-border flex-col justify-between p-12">
        {/* Grid background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-800/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/20">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 5h12M3 9h8M3 13h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="13" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-xl font-semibold tracking-tight text-text-primary">TaskFlow</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold text-text-primary leading-tight tracking-tight">
              Stay focused.<br />
              <span className="text-accent">Ship faster.</span>
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed max-w-sm">
              A clean, distraction-free task management system built for people who value their time.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              "Full CRUD task management",
              "Status tracking & priority levels",
              "Powerful search & filters",
              "Secure JWT authentication",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-text-secondary text-sm">
                <div className="w-5 h-5 rounded-full bg-accent/15 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-text-tertiary text-xs">
            Built with Next.js, Node.js & Prisma
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-slide-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <path d="M3 5h12M3 9h8M3 13h5" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="13" r="2.5" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-text-primary">TaskFlow</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
