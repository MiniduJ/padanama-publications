import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        maroon: {
          DEFAULT: "var(--maroon)",
          50: "#FAF0F2",
          100: "#F5DFE4",
          500: "#8D153A",
          700: "#6B0F2C",
          900: "#45081A",
        },
        saffron: {
          DEFAULT: "var(--saffron)",
          50: "#FFF6ED",
          100: "#FFECDA",
          500: "#EB7400",
          700: "#B85B00",
          900: "#7A3C00",
        },
        gold: {
          DEFAULT: "var(--gold)",
          500: "#FFBE29",
          600: "#E6A618",
        },
        green: {
          DEFAULT: "var(--green)",
          500: "#00534E",
          700: "#003A36",
        },
        lotus: {
          DEFAULT: "var(--lotus-pink)",
          500: "#E85D8C",
        },
        ocean: {
          DEFAULT: "var(--ocean)",
          500: "#0E7C9B",
        },
        palm: {
          DEFAULT: "var(--palm)",
          500: "#2E8B57",
        },
        cream: {
          DEFAULT: "#FFF8EC",
          paper: "#FDF6E9",
        },
        ink: {
          DEFAULT: "#1E1A17",
          muted: "#5A534E",
        },
      },
      fontFamily: {
        sinhala: ["var(--font-sinhala)", "Noto Sans Sinhala", "sans-serif"],
        sinhalaSerif: ["var(--font-sinhala-serif)", "Noto Serif Sinhala", "serif"],
        tamil: ["var(--font-tamil)", "Noto Sans Tamil", "sans-serif"],
        display: ["var(--font-display)", "Gemunu Libre", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      lineHeight: {
        sinhala: "1.75",
        "sinhala-loose": "1.9",
      },
    },
  },
  plugins: [],
};

export default config;
