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
        brand: {
          primary: "#2563EB",
          accent: "#10B981",
          danger: "#EF4444",
          bg: "#F8FAFC",
        },
      },
      borderRadius: {
        lg: "1rem",
        md: "0.75rem",
        sm: "0.5rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        float: "0 10px 30px -5px rgba(37, 99, 235, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
