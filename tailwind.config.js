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
        // The sign red from the Madden's Coffee storefront.
        // poppy for large display text, rust passes AA at body sizes on cream.
        poppy: '#D64228',
        rust: {
          600: '#AC431F',
          700: '#933D1F',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
