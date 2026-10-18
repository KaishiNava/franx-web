import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] },
      boxShadow: { glow: "0 0 45px rgba(139,92,246,.14)" }
    },
  },
  plugins: [],
};
export default config;
