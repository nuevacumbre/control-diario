/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bus-yellow': '#FFB800',
        'bus-blue': '#2563EB',
        'bus-gray': '#F3F4F6',
        // Colores neón extendidos
        'neon': {
          blue: '#2563EB',
          pink: '#DB2777',
          green: '#16A34A',
          purple: '#9333EA',
          yellow: '#EAB308',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(37, 99, 235, 0.5), 0 0 10px rgba(37, 99, 235, 0.3)',
            filter: 'brightness(1)',
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(37, 99, 235, 0.8), 0 0 30px rgba(37, 99, 235, 0.5)',
            filter: 'brightness(1.1)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}