import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        matte: "#050505",
        charcoal: "#111111",
        navy: "#0B1220",
        electric: {
          DEFAULT: "#3B82F6",
          dim: "#2563EB",
        },
        cyan: {
          DEFAULT: "#06B6D4",
        },
        violet: {
          DEFAULT: "#8B5CF6",
        },
        glass: "rgba(255,255,255,0.04)",
        "glass-border": "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(circle, var(--tw-gradient-stops))",
        "aurora-1":
          "radial-gradient(60% 60% at 20% 20%, rgba(59,130,246,0.28) 0%, rgba(59,130,246,0) 70%)",
        "aurora-2":
          "radial-gradient(50% 50% at 80% 30%, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0) 70%)",
        "aurora-3":
          "radial-gradient(55% 55% at 50% 80%, rgba(6,182,212,0.22) 0%, rgba(6,182,212,0) 70%)",
        "grid-glow":
          "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(59,130,246,0.45)",
        "glow-violet": "0 0 40px -8px rgba(139,92,246,0.45)",
        "glow-cyan": "0 0 40px -8px rgba(6,182,212,0.45)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-16px) rotate(2deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-24px)" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.08)" },
          "66%": { transform: "translate(-25px, 20px) scale(0.94)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0%, 0%) rotate(0deg)" },
          "50%": { transform: "translate(-5%, 5%) rotate(8deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        blob: "blob 12s ease-in-out infinite",
        aurora: "aurora 20s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-ring": "pulse-ring 2.5s cubic-bezier(0.2,0.6,0.4,1) infinite",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
