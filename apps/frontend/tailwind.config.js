const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    path.join(__dirname, 'src/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/pages/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/components/**/*.{js,ts,jsx,tsx,mdx}'),
    path.join(__dirname, 'src/app/**/*.{js,ts,jsx,tsx,mdx}'),
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/frontend/src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/frontend/src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './apps/frontend/src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563eb', // Professional blue
          600: '#1d4ed8', // Primary deep brand blue
          700: '#1e40af',
          800: '#1e3a8a', // Dark navy blue
          900: '#172554', // Deepest navy
          950: '#0f172a',
        },
        dark: {
          bg: '#0a0f1d',
          card: '#0f172a',
          border: '#1e293b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
