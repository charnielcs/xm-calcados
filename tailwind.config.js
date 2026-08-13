/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette aligned directly with the official XM Calçados Deep Indigo logo
        brand: {
          50: '#f4f5f9',
          100: '#e4e7f1',
          200: '#cbd0e3',
          300: '#a6afd0',
          400: '#7987b7',
          500: '#3b4268', // Official XM Logo Deep Indigo
          600: '#313759',
          700: '#282c49',
          800: '#20233b',
          900: '#191b2e',
        },
        accent: {
          orange: '#ff5500', // Vibrant discount & action CTA highlight
          blue: '#3b4268',
          cyan: '#06b6d4',
          gray: '#64748b'
        },
        neutral: {
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0',
          dark: '#191b2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
