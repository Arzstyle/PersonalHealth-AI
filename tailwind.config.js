/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // ⬇️ Font Baru
        sans: ['"Plus Jakarta Sans"', "sans-serif"],
        display: ['"Orbitron"', "sans-serif"], // Font Futuristik untuk Judul
      },
      colors: {
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        dark: {
          bg: "#050b14", // Lebih gelap (Deep Space)
          card: "#0f172a",
        },
        // Warna Neon Cyberpunk
        neon: {
          blue: "#00f3ff",
          purple: "#bc13fe",
          green: "#0aff68",
        },
      },
      animation: {
        blob: "blob 10s infinite",
        "spin-slow": "spin 15s linear infinite",
        "spin-reverse-slow": "spin 20s linear infinite reverse",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 3s infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px #22c55e" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px #22c55e" },
        },
      },
    },
  },
  plugins: [],
};
