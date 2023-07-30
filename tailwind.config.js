/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B',
        },
        gray: {
          600: '#9f9f9f',
          700: '#7f7f7f',
          800: '#1f1f1f',
          900: '#1d1d1d',
        }
      }
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
  darkMode: 'class',
};
