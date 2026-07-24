/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        womb: {
          dark: '#0a0a0f',
          card: 'rgba(18, 18, 28, 0.7)',
          border: 'rgba(255, 255, 255, 0.1)',
          cyan: '#00f0ff',
          magenta: '#ff007f',
          purple: '#7000ff',
          amber: '#ffaa00',
          emerald: '#00ff88',
        }
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at top, rgba(112, 0, 255, 0.25), rgba(0, 240, 255, 0.1) 50%, rgba(10, 10, 15, 1) 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
