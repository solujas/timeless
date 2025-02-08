import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gruvbox: {
          bg0: "var(--gruvbox-bg0)",
          bg1: "var(--gruvbox-bg1)",
          bg2: "var(--gruvbox-bg2)",
          fg0: "var(--gruvbox-fg0)",
          fg1: "var(--gruvbox-fg1)",
          red: "var(--gruvbox-red)",
          green: "var(--gruvbox-green)",
          yellow: "var(--gruvbox-yellow)",
          blue: "var(--gruvbox-blue)",
          purple: "var(--gruvbox-purple)",
          aqua: "var(--gruvbox-aqua)",
          orange: "var(--gruvbox-orange)",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
