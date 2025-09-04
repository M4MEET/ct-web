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
        // Claude AI Orange Color Palette
        primary: {
          50: '#fef7ed',
          100: '#fdedd3',
          200: '#fbd7a5',
          300: '#f8bb6d',
          400: '#f59432',
          500: '#f2760a',
          600: '#e35d05',
          700: '#bc4508',
          800: '#96370e',
          900: '#792e0f',
          950: '#411505',
        },
        claude: {
          orange: '#f2760a',
          'orange-light': '#f59432',
          'orange-dark': '#e35d05',
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
    },
  },
  plugins: [],
};

export default config;