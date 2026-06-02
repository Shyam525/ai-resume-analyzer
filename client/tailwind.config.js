/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0A0F1E",
        panel: "#0F172A",
        panelSoft: "#121E35",
        cyan: "#00D9FF",
        amber: "#F59E0B",
        emerald: "#10B981",
        rose: "#F43F5E",
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0, 217, 255, 0.14), 0 16px 60px rgba(0, 217, 255, 0.08)",
        innerGlow: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top left, rgba(0,217,255,0.18), transparent 34%), radial-gradient(circle at 85% 20%, rgba(16,185,129,0.14), transparent 26%), linear-gradient(145deg, #0A0F1E 0%, #091426 52%, #07111E 100%)",
      },
    },
  },
  plugins: [],
};
