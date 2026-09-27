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
        background: "#090a0f",
        surface: {
          50: "#181a20",
          100: "#131419",
          200: "#0e0f14",
          300: "#090a0f",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          default: "rgba(255, 255, 255, 0.1)",
          hover: "rgba(255, 255, 255, 0.18)",
        },
        brand: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
          subtle: "rgba(59, 130, 246, 0.1)",
        },
        signal: {
          danger: "#f43f5e",
          "danger-bg": "rgba(244, 63, 94, 0.08)",
          "danger-border": "rgba(244, 63, 94, 0.2)",
          warning: "#f59e0b",
          "warning-bg": "rgba(245, 158, 11, 0.08)",
          "warning-border": "rgba(245, 158, 11, 0.2)",
          success: "#10b981",
          "success-bg": "rgba(16, 185, 129, 0.08)",
          "success-border": "rgba(16, 185, 129, 0.2)",
          neutral: "#71717a",
          "neutral-bg": "rgba(113, 113, 122, 0.08)",
          "neutral-border": "rgba(113, 113, 122, 0.2)",
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
