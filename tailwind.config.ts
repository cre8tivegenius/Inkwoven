import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf7f0',
          100: '#f7ead6',
          200: '#f1d3ac',
          300: '#e6b97d',
          400: '#d89f56',
          500: '#c6822b',
          600: '#a46223',
          700: '#80461b',
          800: '#5c3113',
          900: '#3b1f0c',
        },
        neutral: {
          50: '#fdfaf6',
          100: '#f4efe7',
          200: '#e4d9cc',
          300: '#d1c0ad',
          400: '#b79f88',
          500: '#8f7760',
          600: '#725b48',
          700: '#574334',
          800: '#3c2c22',
          900: '#241a15',
        },
        secondary: {
          50: '#f9f5f2',
          100: '#f1e3d9',
          200: '#ddc2b0',
          300: '#c8a389',
          400: '#b08363',
          500: '#8c5e3c',
          600: '#6d4529',
          700: '#4f301b',
          800: '#321e11',
          900: '#1a1009',
        },
        accent: {
          50: '#ecf7f4',
          100: '#cdeae2',
          200: '#a6d7ca',
          300: '#7dc5b3',
          400: '#57b09e',
          500: '#3d9282',
          600: '#2f7566',
          700: '#21584c',
          800: '#143c34',
          900: '#0a2420',
        },
        surface: {
          50: '#fdf9f4',
          100: '#f8f0e3',
          200: '#f0e2cb',
          300: '#e0caa8',
          400: '#cfb18a',
          500: '#b99470',
          600: '#9a7856',
          700: '#7b5c41',
          800: '#5b402e',
          900: '#3d271d',
        },
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Crimson Pro', 'Merriweather', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}

export default config

