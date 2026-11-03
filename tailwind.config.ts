import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ground: 'var(--ground)',
        surface: 'var(--surface)',
        raised: 'var(--raised)',
        active: 'var(--active)',
        border: 'var(--border)',
        rule: 'var(--rule)',
        control: 'var(--control)',
        ink: {
          DEFAULT: 'var(--text)',
          muted: 'var(--muted)',
          faint: 'var(--faint)',
        },
        brand: {
          DEFAULT: 'var(--primary)',
          accent: 'var(--accent)',
        },
        semantic: {
          positive: 'var(--positive)',
          negative: 'var(--negative)',
          warning: 'var(--warning)',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
        sheet: 'var(--radius-sheet)',
      },
    },
  },
  plugins: [],
};

export default config;
