/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        memora: {
          50: '#F4F9F5',
          100: '#E6F3E9',
          200: '#CBE5D2',
          300: '#9FCFB0',
          400: '#6CB387',
          500: '#489666',
          600: '#367B51',
          700: '#2C6242',
          800: '#254E36',
          900: '#20412E',
        },
        warmth: {
          50: '#FFFBF5',
          100: '#FEF6E9',
          200: '#FCE7C8',
          300: '#F9D19E',
          400: '#F5B066',
          500: '#EE8E32',
          600: '#DE6F1D',
          700: '#B85018',
          800: '#93401B',
          900: '#77351A',
        },
        calm: {
          50: '#F2F8FA',
          100: '#E1EFF3',
          200: '#C6DFE7',
          300: '#9DC5D5',
          400: '#6BA2BC',
          500: '#4B83A0',
          600: '#3F6B86',
          700: '#37576F',
          800: '#324B5D',
          900: '#2D4050',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.7rem',
      }
    },
  },
  plugins: [],
}
