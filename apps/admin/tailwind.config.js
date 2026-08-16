/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19',
        surface: '#111827',
        'surface-2': '#1F2937',
        primary: '#6366F1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        title: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
