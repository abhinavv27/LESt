import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        lex: {
          dark: "#0A0A0B",
          gold: "#C6A059",
          crimson: "#FF4D4D",
          cyan: "#00F5FF",
          glass: "rgba(255, 255, 255, 0.03)",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        editorial: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url('/noise.png')",
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
