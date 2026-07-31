/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/dashboard/**/*.{js,jsx}',
    './src/componants/admin/**/*.{js,jsx}',
  ],
  corePlugins: {
    // The public site relies on Bootstrap's base styles; Tailwind's reset
    // would otherwise clobber them since dashboard pages share the root layout.
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};
