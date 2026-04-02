import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],
      },
      colors: {
        brand: {
          red: "#ff1744",
          emerald: "#10b981",
          bg: "#0f0a0a",
          card: "#18181b",
          border: "#27272a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
