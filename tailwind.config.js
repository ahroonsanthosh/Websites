/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        cream: {
          50: '#FDFAF4',
          100: '#F8F1E4',
          200: '#F0E4CE',
        },
        espresso: {
          700: '#4A3728',
          800: '#3B2C20',
          900: '#2C2016',
        },
        amber: {
          brand: '#E8A33D',
        },
        moss: {
          600: '#5C6B4C',
          700: '#48543B',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
