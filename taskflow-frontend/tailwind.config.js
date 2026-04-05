/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        surface: {
          0: "#0a0a0a",
          1: "#111111",
          2: "#1a1a1a",
          3: "#222222",
          4: "#2a2a2a",
        },
        border: {
          DEFAULT: "#2a2a2a",
          subtle: "#1f1f1f",
          strong: "#3a3a3a",
        },
        accent: {
          DEFAULT: "#6366f1",
          hover: "#4f46e5",
          muted: "rgba(99,102,241,0.15)",
          subtle: "rgba(99,102,241,0.08)",
        },
        text: {
          primary: "#f0f0f0",
          secondary: "#888888",
          tertiary: "#555555",
          inverse: "#0a0a0a",
        },
        status: {
          pending: "#f59e0b",
          "pending-bg": "rgba(245,158,11,0.1)",
          progress: "#6366f1",
          "progress-bg": "rgba(99,102,241,0.1)",
          completed: "#10b981",
          "completed-bg": "rgba(16,185,129,0.1)",
        },
        priority: {
          low: "#6b7280",
          "low-bg": "rgba(107,114,128,0.1)",
          medium: "#f59e0b",
          "medium-bg": "rgba(245,158,11,0.1)",
          high: "#ef4444",
          "high-bg": "rgba(239,68,68,0.1)",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
        "scale-in": "scaleIn 0.15s ease-out",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
