/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5BA89D',
          50: '#ECF3F2',
          100: '#D9E7E5',
          200: '#B3CFCB',
          300: '#8DB7B2',
          400: '#679F98',
          500: '#5BA89D',
          600: '#47857D',
          700: '#38665F',
          800: '#284842',
          900: '#192B28',
          950: '#0D1614',
        },
        accent: {
          peach: {
            DEFAULT: '#F4C095',
            light: '#F8D5B7',
            dark: '#EEA66A',
          },
          blue: {
            DEFAULT: '#C0D6DF',
            light: '#D7E5EB',
            dark: '#9BC0CE',
          },
          neutral: {
            DEFAULT: '#F2F2F2',
            light: '#FFFFFF',
            dark: '#DDDDDD',
          },
        },
        success: {
          DEFAULT: '#4CAF50',
          50: '#E8F5E9',
          500: '#4CAF50',
          700: '#388E3C',
        },
        warning: {
          DEFAULT: '#FFC107',
          50: '#FFF8E1',
          500: '#FFC107',
          700: '#FFA000',
        },
        error: {
          DEFAULT: '#F44336',
          50: '#FFEBEE',
          500: '#F44336',
          700: '#D32F2F',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
        'bounce-light': 'bounceLight 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceLight: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};