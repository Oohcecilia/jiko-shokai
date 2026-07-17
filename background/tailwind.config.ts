import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./config/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050816",
        surface: "rgba(255,255,255,0.05)",
        "surface-strong": "rgba(255,255,255,0.08)",
        primary: {
          DEFAULT: "#7C3AED",
          soft: "#9F67F5",
        },
        accent: {
          DEFAULT: "#06B6D4",
          soft: "#38D9EF",
        },
        secondary: {
          DEFAULT: "#3B82F6",
          soft: "#63A0FF",
        },
        foreground: "#FFFFFF",
        muted: "#A1A1AA",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        card: "24px",
        "card-lg": "28px",
      },
      boxShadow: {
        "glow-primary": "0 0 60px -12px rgba(124,58,237,0.45)",
        "glow-accent": "0 0 60px -12px rgba(6,182,212,0.4)",
        premium: "0 30px 80px -20px rgba(0,0,0,0.6)",
        "premium-sm": "0 12px 40px -12px rgba(0,0,0,0.5)",
        "inner-glow": "inset 0 1px 0 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(60% 60% at 50% 40%, rgba(124,58,237,0.25) 0%, rgba(5,8,22,0) 70%)",
        "grid-fade":
          "linear-gradient(to bottom, transparent, #050816 90%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-10px) translateX(6px)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "gradient-x": "gradient-x 6s ease infinite",
        blob: "blob 12s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "fade-up": "fade-up 0.8s ease-out forwards",
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
