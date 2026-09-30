import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fafbfe",
        foreground: "#090a12",
        surface: {
          50: "#ffffff",
          100: "#f8fafc",
          200: "#f1f5f9",
          300: "#e2e8f0",
          400: "#cbd5e1",
        },
        border: {
          subtle: "rgba(0, 0, 0, 0.04)",
          default: "rgba(0, 0, 0, 0.08)",
          hover: "rgba(0, 0, 0, 0.16)",
        },
        brand: {
          DEFAULT: "#2563eb",
          hover: "#1d4ed8",
          subtle: "rgba(37, 99, 235, 0.08)",
        },
        signal: {
          danger: "#e11d48",
          "danger-bg": "rgba(244, 63, 94, 0.08)",
          "danger-border": "rgba(244, 63, 94, 0.25)",
          warning: "#d97706",
          "warning-bg": "rgba(245, 158, 11, 0.08)",
          "warning-border": "rgba(245, 158, 11, 0.25)",
          success: "#059669",
          "success-bg": "rgba(16, 185, 129, 0.08)",
          "success-border": "rgba(16, 185, 129, 0.25)",
          neutral: "#64748b",
          "neutral-bg": "rgba(100, 116, 139, 0.08)",
          "neutral-border": "rgba(100, 116, 139, 0.2)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SFMono-Regular"',
          "Menlo",
          "Monaco",
          "Consolas",
          '"Liberation Mono"',
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
