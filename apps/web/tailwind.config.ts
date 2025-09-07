import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        // CodeX Terminal Logo Color Palette based on #f08a5d
        primary: {
          50: '#fef6f1',
          100: '#fdeae0', 
          200: '#fbd4c1',
          300: '#f7b094',
          400: '#f08a5d',
          500: '#ed6c39',
          600: '#de5528',
          700: '#b8421e',
          800: '#93371d',
          900: '#762f1c',
          950: '#40160d',
        },
        codex: {
          orange: '#f08a5d',
          'orange-light': '#f7b094',
          'orange-dark': '#de5528',
        },
        // CodeX Terminal's exact background colors
        'codex-terminal': {
          body: '#faf9f5',
          component: '#f0eee6',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'SF Mono', 'Monaco', 'Inconsolata', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;