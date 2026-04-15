/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,tsx,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        wine: { 50: '#fdf2f3', 100: '#fce4e6', 200: '#f9cbd0', 300: '#f4a4ad', 400: '#ec7281', 500: '#df4559', 600: '#cc2d42', 700: '#722f37', 800: '#8e1c2a', 900: '#781c28' },
        sano: { 50: '#e8f7ec', 100: '#c8ebcf', 200: '#94d8a3', 300: '#5abf71', 400: '#3eb856', 500: '#2a9640', 600: '#1f7a32', 700: '#1a612a', 800: '#174d24', 900: '#144020' }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
