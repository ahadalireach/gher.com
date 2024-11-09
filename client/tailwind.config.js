/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderWidth: {
        12: "12px",
        16: "16px",
      },
      fontSize: {
        50: "57px",
        40: "45px",
      },
      lineHeight: {
        50: "55px",
      },
    },
  },
  plugins: [],
};
