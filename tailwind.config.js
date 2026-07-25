/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F7F5F0",
        secondary: "#EFECE5",
        textPrimary: "#111111",
        textSecondary: "#5F5F5F",
        luxuryBlue: "#9BB7D4",
      },
      fontFamily: {
        serif: ["Instrument Serif", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        'xl': '24px',
      },
      boxShadow: {
        'glass': '0 20px 50px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
