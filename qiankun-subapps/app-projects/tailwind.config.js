import { accentThemeExtend } from '../_shared/tailwindAccentTheme.js';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,scss}'],
  darkMode: 'class',
  theme: { extend: accentThemeExtend },
  plugins: [],
};
