import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        primary: {
          500: '#FF7000',
          100: '#FFF1E6'
        },
        dark: {
          100: '#000000',
          200: '#0F1117',
          300: '#151821',
          400: '#212734',
          500: '#101012'
        },
        light: {
          900: '#FFFFFF',
          800: '#F4F6F8',
          850: '#FDFDFD',
          700: '#DCE3F1',
          500: '#7B8EC8',
          400: '#858EAD'
        },
        'accent-blue': '#1DA1F2'
      }
    },
    fontFamily: {
      inter: ['var(--font-inter)'],
      spaceGrotesk: ['var(--font-spaceGrotesk)']
    },
    boxShadow: {
      'light-100':
        '0px 12px 20px 0px rgba(184, 184, 184, 0.03), 0px 6px 12px 0px',
      'light-200': '10px 10px 20px 0px rgba(218, 213, 213, 0.10)',
      'light-300': '-10px 10px 20px 0px rgba(218, 213, 213, 0.10)',
      'dark-100': '0px 2px 10px 0px rgba(46, 52, 56, 0.10)',
      'dark-200': '2px 0px 20px 0px rgba(39, 36, 36, 0.04)'
    },

    backgroundImage: {
      'auth-dark': "url('/assets/images/auth-dark.png')",
      'auth-light': "url('/assets/images/auth-light.png')"
    },

    screens: {
      xs: '420px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },

    keyframes: {
      'accordion-down': {
        // @ts-ignore
        from: { height: 0 },
        to: { height: 'var(--radix-accordion-content-height)' }
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        // @ts-ignore
        to: { height: 0 }
      },

      spin: {
        from: {
          transform: 'rotate(0deg)'
        },
        to: {
          transform: 'rotate(360deg);'
        }
      },
      pulse: {
        '0%, 100%': {
        //  @ts-ignore
          opacity: 1
        },
        '50%': {
          //  @ts-ignore
          opacity: 0.5
        }
      },
      animation: {
        // @ts-ignore
        'accordion-down': 'accordion-down 0.2s ease-out',
        // @ts-ignore
        'accordion-up': 'accordion-up 0.2s ease-out',
        // @ts-ignore
        spin: 'spin 3s linear infinite',
        // @ts-ignore
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;'
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')]
}
export default config
