import type { Config } from "tailwindcss";

// HR:RUSH FOR PRACTICE brand palette — derived from the existing site design
// (deep navy background, cyan / coral / orange / violet accents).
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    // Status badge classes live in types/application.ts as plain strings —
    // included here so Tailwind's JIT scanner doesn't purge them.
    "./types/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1180px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        navy: {
          DEFAULT: "#161a2c",
          50: "#f2f3f7",
          100: "#e2e4ee",
          200: "#c3c7dc",
          300: "#9aa0c1",
          400: "#6b71a0",
          500: "#4a5080",
          600: "#363a63",
          700: "#282b4d",
          800: "#1e2138",
          900: "#161a2c",
          950: "#0d0f1c",
        },
        cyan: {
          DEFAULT: "#2fd9e8",
          50: "#eafdfd",
          100: "#c9f6f8",
          200: "#98edf1",
          300: "#5fdfe8",
          400: "#2fd9e8",
          500: "#12b7c8",
          600: "#0f92a1",
          700: "#127482",
          800: "#175e69",
          900: "#164e59",
        },
        coral: {
          DEFAULT: "#ff6b6b",
          50: "#fff1f1",
          100: "#ffe0e0",
          200: "#ffc6c6",
          300: "#ff9d9d",
          400: "#ff6b6b",
          500: "#f83d3d",
          600: "#e51f1f",
          700: "#c11616",
          800: "#a01717",
          900: "#841919",
        },
        amber: {
          DEFAULT: "#ffa63d",
          50: "#fff8ec",
          100: "#ffedc9",
          200: "#ffd88d",
          300: "#ffbe51",
          400: "#ffa63d",
          500: "#fb8412",
          600: "#e0620a",
          700: "#ba440c",
          800: "#963510",
          900: "#7a2d10",
        },
        violet: {
          DEFAULT: "#a78bfa",
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      fontSize: {
        "display-lg": ["clamp(2.75rem, 6vw, 5.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.25rem, 4.5vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-sm": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(47,217,232,0.15), 0 20px 60px -20px rgba(47,217,232,0.35)",
        card: "0 10px 30px -15px rgba(13,15,28,0.35)",
      },
      backgroundImage: {
        "grid-fade":
          "radial-gradient(circle at 20% 20%, rgba(47,217,232,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(167,139,250,0.12), transparent 45%), radial-gradient(circle at 50% 100%, rgba(255,107,107,0.10), transparent 40%)",
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        "fade-in": "fade-in 0.6s ease-out both",
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
