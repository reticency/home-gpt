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
        background: '#FFFFFF',
        foreground: '#020617',
        muted: '#696A72',
        secondary: '#374151',
        accent: '#0000EE',
        accentHover: '#145AFF',
        success: '#22C55E',
        error: '#EF4444',
        border: '#E5E7EB',
        gradient: '#E5F0FF',
      },
      fontFamily: {
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        sans: ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'apple': '12px',
      },
    },
  },
  plugins: [],
};

export default config;