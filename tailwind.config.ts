import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './emails/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        abyss:  '#0A0F1E',
        navy:   '#0D1B2A',
        slate:  '#1B2B4B',
        wire:   '#1E2D40',
        cyan:   '#00D4FF',
        'cyan-dim': '#00A8CC',
        'cyan-light': '#0099BB',
        amber:  '#F59E0B',
        cloud:  '#F0F4F8',
        steel:  '#8FA3BF',
        muted:  '#4A5568',
        chalk:  '#F7F9FC',
        success: '#10B981',
        error:   '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
}
export default config
