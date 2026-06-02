import type { Config } from 'tailwindcss';
import { accentThemeExtend } from '../qiankun-subapps/_shared/tailwindAccentTheme.js';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './components/**/*.{js,ts,jsx,tsx,mdx,scss}',
    './app/**/*.{js,ts,jsx,tsx,mdx,scss}',
  ],
  darkMode: 'class',
  theme: {
    extend: accentThemeExtend,
  },
  plugins: [],
};

export default config;
