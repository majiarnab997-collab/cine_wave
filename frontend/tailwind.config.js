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
        background: {
          DEFAULT: '#08080C',
          surface: '#0E0E15',
          elevated: '#161622',
          card: '#1F1F30',
          hover: '#28283E',
        },
        brand: {
          primary: '#FF2E55',
          secondary: '#FF6B35',
          amber: '#FFA800',
          cyan: '#00F0FF',
          dark: '#B31433',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.18)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #FF2E55 0%, #FF6B35 50%, #FFA800 100%)',
        'brand-glow': 'radial-gradient(circle, rgba(255, 46, 85, 0.25) 0%, rgba(0, 0, 0, 0) 70%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(8,8,12,0) 0%, rgba(8,8,12,0.85) 75%, #08080C 100%)',
        'hero-side': 'linear-gradient(90deg, rgba(8,8,12,0.95) 0%, rgba(8,8,12,0.65) 45%, rgba(8,8,12,0) 100%)',
        'card-overlay': 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(14,14,21,0.95) 100%)',
      },
      boxShadow: {
        'cinematic': '0 20px 40px -15px rgba(0, 0, 0, 0.8), 0 0 25px -5px rgba(255, 46, 85, 0.15)',
        'glow-primary': '0 0 25px -5px rgba(255, 46, 85, 0.5)',
        'glow-secondary': '0 0 25px -5px rgba(255, 107, 53, 0.5)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.4)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
