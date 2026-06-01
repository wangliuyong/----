import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './components/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './app/**/*.{js,ts,jsx,tsx,mdx,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
