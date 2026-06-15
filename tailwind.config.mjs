/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#faf8fc',
          50: '#fefdfe',
          100: '#faf8fc',
          200: '#f4f0f7',
          300: '#e8e1ed',
          800: '#2a272b',
          900: '#1c1a1d',
        },
        ink: {
          DEFAULT: '#2a2533',
          100: '#2a2533',
          200: '#524c5c',
          300: '#8a8294',
          inverted: '#e8e1ed',
        },
        accent: {
          50: '#f0ebff',
          100: '#e0d6ff',
          200: '#c4b0f5',
          300: '#a78bfa',
          400: '#8b74f7',
          500: '#6d5cf6',
          600: '#5b48ec',
          700: '#4c3ad9',
        },
        rose: {
          50: '#fff0f5',
          100: '#ffe0eb',
          200: '#fbc4d8',
          300: '#f99dbb',
          400: '#f4729e',
          500: '#ec4888',
          600: '#db2777',
          700: '#be185d',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
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
