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
        forest: {
          900: '#071e16',
          800: '#0c2e22',
          700: '#134333',
          600: '#1b5a45',
          500: '#257359',
          100: '#e5f3ed',
          50: '#f2f9f6',
        },
        gold: {
          900: '#755410',
          800: '#946c15',
          700: '#b8891d',
          600: '#d4a328',
          500: '#e5b83b',
          400: '#eed06d',
          300: '#f6e29f',
          200: '#fbf0cf',
          100: '#fdf8ec',
          50: '#fefcf6',
        },
        ivory: {
          900: '#e8e2d4',
          800: '#f2ede0',
          100: '#f9f6ee',
          50: '#fdfbf7',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(7, 30, 22, 0.15), 0 0 0 1px rgba(212, 163, 40, 0.12)',
        'luxury-gold': '0 10px 30px -5px rgba(212, 163, 40, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
