/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          deep: '#070F18',
          mid: '#13263B',
          light: '#1B324C',
        },
        amber: {
          DEFAULT: '#E8A020',
          light: '#F0B445',
          dark: '#C98815',
        },
        cream: '#F7F5F0',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Manrope', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
      },
    },
  },
  plugins: [],
}
