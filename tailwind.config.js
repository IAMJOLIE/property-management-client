/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"], 
    theme: {
      extend: {
        colors: {
          primary: "#1F2937",  // Mörk bakgrund
          secondary: "#374151", // Hover-effekt
        },
      },
    },
    plugins: [],
  };