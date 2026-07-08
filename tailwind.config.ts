import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#f0f0f0',
        foreground: '#2D2D2D',
        muted: '#5E6470',
        secondary: '#696A72',
        accent: '#1E325A',
        accentHover: '#2A4A7A',
        success: '#22C55E',
        error: '#EF4444',
        border: '#E5E5EA',
        gradient: '#E5F0FF',
        glass: 'rgba(255, 255, 255, 0.6)',
      },
      fontFamily: {
        helvetica: ['Helvetica Regular', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Helvetica Regular', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Helvetica Regular', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '1rem',
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
    },
  },
  plugins: [],
};

export default config;
