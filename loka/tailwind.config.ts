import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        italic: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      colors: {
        cream: {
          50: '#FDFCF8',
          100: '#FAFAF6',
          200: '#F5F0E8',
          300: '#EDE5D8',
          400: '#E0D4C0',
          500: '#CBBFA8',
        },
        coffee: {
          100: '#D4B896',
          200: '#C8A97E',
          300: '#B8935A',
          400: '#9A7B4A',
          500: '#7A5F38',
          600: '#5C4020',
          700: '#3D2810',
          800: '#2C1810',
          900: '#1A0F08',
        },
        sage: {
          DEFAULT: '#8B9E7C',
          light: '#B5C4A8',
          dark: '#637356',
        },
      },
      letterSpacing: {
        widest: '0.25em',
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in': 'cubic-bezier(0.7, 0, 0.84, 0)',
      },
    },
  },
  plugins: [],
};

export default config;
