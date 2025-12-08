/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Thai Variety Entertainment Theme - Sexy & Luxury
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',  // Hot Pink
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        neon: {
          pink: '#ff10f0',
          purple: '#9d00ff',
          blue: '#00d4ff',
          gold: '#ffd700',
          red: '#ff0055',
        },
        luxury: {
          gold: '#d4af37',
          rose: '#ff6b9d',
          purple: '#9333ea',
          dark: '#0a0a0a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'glow-pink': 'glow-pink 2s ease-in-out infinite',
        'glow-gold': 'glow-gold 2s ease-in-out infinite',
        'neon': 'neon 1.5s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(236, 72, 153, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(236, 72, 153, 0.8), 0 0 80px rgba(236, 72, 153, 0.5)',
          },
        },
        'glow-pink': {
          '0%, 100%': { 
            boxShadow: '0 0 30px rgba(255, 16, 240, 0.6), 0 0 60px rgba(255, 16, 240, 0.4)',
          },
          '50%': { 
            boxShadow: '0 0 50px rgba(255, 16, 240, 0.9), 0 0 100px rgba(255, 16, 240, 0.6)',
          },
        },
        'glow-gold': {
          '0%, 100%': { 
            boxShadow: '0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4)',
          },
          '50%': { 
            boxShadow: '0 0 50px rgba(255, 215, 0, 0.9), 0 0 100px rgba(255, 215, 0, 0.6)',
          },
        },
        neon: {
          'from': {
            textShadow: '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff10f0, 0 0 40px #ff10f0',
          },
          'to': {
            textShadow: '0 0 20px #fff, 0 0 30px #ff10f0, 0 0 40px #ff10f0, 0 0 50px #ff10f0, 0 0 60px #ff10f0',
          },
        },
        'neon-pulse': {
          '0%, 100%': {
            textShadow: '0 0 10px #ff10f0, 0 0 20px #ff10f0, 0 0 30px #ff10f0',
            opacity: '1',
          },
          '50%': {
            textShadow: '0 0 20px #ff10f0, 0 0 30px #ff10f0, 0 0 40px #ff10f0, 0 0 50px #ff10f0',
            opacity: '0.8',
          },
        },
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px)',
            opacity: '1'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            opacity: '0.9'
          },
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-1000px 0',
          },
          '100%': { 
            backgroundPosition: '1000px 0',
          },
        },
        'slide-up': {
          '0%': {
            transform: 'translateY(20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
