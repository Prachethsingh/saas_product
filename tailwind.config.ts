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
        serene: {
          50: "#f0f8ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        background: "#edf5fc",
        foreground: "#0f233a",
        surface: {
          50: "#ffffff",
          100: "#f8fafc",
          200: "#f1f5f9",
          300: "#e2e8f0",
          400: "#cbd5e1",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.4)",
          default: "rgba(255, 255, 255, 0.8)",
          hover: "rgba(255, 255, 255, 0.95)",
        },
        brand: {
          DEFAULT: "#0284c7",
          hover: "#0369a1",
          subtle: "rgba(2, 132, 199, 0.08)",
        },
        signal: {
          danger: "#f43f5e",
          "danger-bg": "rgba(244, 63, 94, 0.08)",
          "danger-border": "rgba(244, 63, 94, 0.3)",
          warning: "#f59e0b",
          "warning-bg": "rgba(245, 158, 11, 0.08)",
          "warning-border": "rgba(245, 158, 11, 0.3)",
          success: "#10b981",
          "success-bg": "rgba(16, 185, 129, 0.08)",
          "success-border": "rgba(16, 185, 129, 0.3)",
          neutral: "#64748b",
          "neutral-bg": "rgba(100, 116, 139, 0.08)",
          "neutral-border": "rgba(100, 116, 139, 0.2)",
        },
      },
      flex: {
        'golden-major': '1.618 1.618 0%',
        'golden-minor': '1 1 0%',
      },
      aspectRatio: {
        'golden': '1.618 / 1',
        'golden-tall': '1 / 1.618',
      },
      gridTemplateColumns: {
        'golden': '1.618fr 1fr',
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"SF Pro"',
          '"San Francisco"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          '"SFMono-Regular"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
