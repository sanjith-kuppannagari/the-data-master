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
        midnight: {
          DEFAULT: '#101827',
          950: '#0A0F19',
          900: '#101827',
          800: '#151E2E',
        },
        charcoal: {
          DEFAULT: '#171C26',
          surface: '#1A202C',
          elevated: '#1F2633',
          border: '#2A3446',
          muted: '#3A4659',
        },
        lime: {
          DEFAULT: '#C6F36B',
          glow: '#D2F78A',
          dim: '#A8DB47',
          dark: '#2D3A14',
        },
        ivory: {
          DEFAULT: '#F5F3EA',
          light: '#FAF9F4',
          dark: '#E8E5D8',
          border: '#DDD8C7',
        },
        cyan: {
          DEFAULT: '#75D6D0',
          muted: '#5CB8B2',
          glow: '#92E4DF',
          dark: '#163836',
        },
        orange: {
          DEFAULT: '#FFAA73',
          warm: '#FFAA73',
          glow: '#FFBF94',
          dark: '#402616',
        },
      },
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
