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
        'theme-bg0': 'var(--theme-bg0)',
        'theme-bg1': 'var(--theme-bg1)',
        'theme-bg2': 'var(--theme-bg2)',
        'theme-fg0': 'var(--theme-fg0)',
        'theme-fg1': 'var(--theme-fg1)',
        'theme-accent': 'var(--theme-accent)',
        'theme-error': 'var(--theme-error)'
      }
    },
  },
  plugins: [],
};

export default config;
