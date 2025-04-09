export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: true,
  },
  theme: {
    extend: {
      screens: {
        custom930: '930px',
      }
    },
  },
  plugins: [],
}