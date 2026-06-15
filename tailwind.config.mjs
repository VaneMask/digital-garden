/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfcfb',
          100: '#faf8f5',
          200: '#f5f0eb',
          300: '#ede4d9',
        },
        ink: {
          900: '#1a1a1a',
          800: '#2d2d2d',
          700: '#404040',
          600: '#525252',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f5',
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
        sans: ['Inter', 'MiSans', 'HarmonyOS Sans SC', 'system-ui', 'sans-serif'],
        display: ['Inter', 'MiSans', 'HarmonyOS Sans SC', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 20px rgba(0,0,0,0.04)',
        'soft-lg': '0 8px 40px rgba(0,0,0,0.06)',
        'soft-dark': '0 0 0 1px rgba(255,255,255,0.1), 0 2px 20px rgba(0,0,0,0.3)',
        glow: '0 0 30px rgba(139,92,246,0.15), 0 0 60px rgba(139,92,246,0.05)',
        'glow-sm': '0 0 15px rgba(139,92,246,0.1)',
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 10s ease-in-out 2s infinite',
        'float-slow': 'float 12s ease-in-out 4s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '33%': { transform: 'translateY(-20px) scale(1.02)' },
          '66%': { transform: 'translateY(10px) scale(0.98)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      maxWidth: {
        'prose': '768px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      transitionDuration: {
        '400': '400ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}
