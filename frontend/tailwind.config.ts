import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        af: {
          black: "#080808",
          dark: "#111016",
          mid: "#1E1D24",
          red: "#E8242A",
          blue: "#1A5CFF",
          gold: "#C9A84C",
          offwhite: "#F4F3EF",
          border: "#E2E0DA",
          text: "#2A2830",
          muted: "#7A7880",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        bebas: ["var(--font-bebas)", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [forms, typography],
};

export default config;
