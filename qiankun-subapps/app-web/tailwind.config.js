import { accentThemeExtend } from '../_shared/tailwindAccentTheme.js';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,scss}',
    '../_shared/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: { extend: accentThemeExtend },
  plugins: [],
};
