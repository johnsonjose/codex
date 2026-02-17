import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#05070d',
        panel: '#0c101d',
        neonGreen: '#33ff9c',
        neonRed: '#ff4365',
        neonBlue: '#4de3ff',
      },
      boxShadow: {
        neon: '0 0 25px rgba(51, 255, 156, 0.3)',
        redNeon: '0 0 25px rgba(255, 67, 101, 0.3)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.7' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
