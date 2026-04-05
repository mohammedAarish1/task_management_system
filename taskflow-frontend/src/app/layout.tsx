import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow — Task Management",
  description: "A clean, focused task management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-surface-0 text-text-primary antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1a1a1a",
              color: "#f0f0f0",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              fontSize: "14px",
              fontFamily: "DM Sans, sans-serif",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#1a1a1a" },
              duration: 3000,
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#1a1a1a" },
              duration: 4000,
            },
          }}
        />
      </body>
    </html>
  );
}
