/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#faf9f7',
          50: '#fefdfc',
          100: '#faf9f7',
          200: '#f3f1ed',
          300: '#e8e4de',
          800: '#2a2a28',
          900: '#1c1c1b',
        },
        ink: {
          DEFAULT: '#2c2c2c',
          100: '#2c2c2c',
          200: '#525252',
          300: '#8a8a8a',
          inverted: '#e8e4de',
        },
        accent: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card': '0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)',
        'card-hover': '0 2px 4px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.06)',
        'card-dark': '0 0 0 1px rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.2)',
        'card-hover-dark': '0 0 0 1px rgba(255,255,255,0.12), 0 8px 40px rgba(0,0,0,0.3)',
      },
      animation: {
        'float': 'float 20s ease-in-out infinite',
        'float-delay': 'float 25s ease-in-out 5s infinite',
        'float-slow': 'float 30s ease-in-out 10s infinite',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-up-delay': 'fadeUp 0.8s ease-out 0.15s forwards',
        'fade-up-delay-2': 'fadeUp 0.8s ease-out 0.3s forwards',
        'fade-up-delay-3': 'fadeUp 0.8s ease-out 0.45s forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '25%': { transform: 'translate(2%, -2%) scale(1.03)' },
          '50%': { transform: 'translate(-1%, -1%) scale(0.97)' },
          '75%': { transform: 'translate(1%, 1%) scale(1.02)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(32px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
