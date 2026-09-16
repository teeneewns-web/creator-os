import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // รองรับการทำระบบ Dark Mode แข็งแกร่ง
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: "#020617",
          900: "#0f172a",
        }
      },
    },
  },
  plugins: [],
};
export default config;