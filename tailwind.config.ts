import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#111827',
        'surface-2': '#1f2937',
        border: '#374151',
        gain: '#22c55e',
        loss: '#ef4444',
        accent: '#06b6d4',
        'accent-dim': '#0891b2',
        phoenix: '#ff6b35',
        'phoenix-dim': '#e55a2b',
        muted: '#6b7280',
      },
      fontFamily: {
        pixel: ['var(--font-geist-pixel-triangle)', 'monospace'],
        mono: ['var(--font-geist-pixel-triangle)', 'JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['var(--font-geist-pixel-triangle)', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
