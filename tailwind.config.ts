// Task ID: T007, T075 - Tailwind CSS configuration with soothing theme
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CSS variable-based colors for theme consistency
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          light: "var(--primary-light)",
          dark: "var(--primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          light: "var(--secondary-light)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          warm: "var(--accent-warm)",
        },
        surface: {
          DEFAULT: "var(--surface)",
          alt: "var(--surface-alt)",
        },
        border: "var(--border)",
        muted: "var(--text-muted)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(77, 182, 172, 0.15), 0 4px 6px -2px rgba(77, 182, 172, 0.1)",
        glow: "0 0 20px rgba(77, 182, 172, 0.3)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
