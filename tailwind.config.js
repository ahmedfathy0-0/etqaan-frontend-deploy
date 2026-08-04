module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboardPurple: "#7C4DFF",
        dashboardOrange: "#FFD54F",
        dashboardGreen: "#26A69A",
        dashboardBlue: "#c2e2f1",
        dashboardBg: "#FFF3E0",
        // Improved contrast colors
        textPrimary: "#1a1a1a",
        textSecondary: "#4a5568",
        textLight: "#718096",
        accent: "#7C4DFF",
        // New Theme Colors
        primary: { 50: "#F7FDFF", 100: "#ECF7FC", 200: "#D9EEF7", 300: "#BEE0F0", 400: "#99CCE4", 500: "#69B0D1", 600: "#338AB3", 700: "#035D86", 800: "#00354E", 900: "#00090D" },
        danger: { 50: "#FFF7F7", 100: "#FCECEC", 200: "#F8DADA", 300: "#F1C0C0", 400: "#E79B9B", 500: "#D66C6C", 600: "#BB3535", 700: "#930404", 800: "#600000", 900: "#260000" },
        success: { 50: "#FBFFFC", 100: "#F3FCF4", 200: "#E2F7E4", 300: "#C6EFC9", 400: "#A0E3A5", 500: "#75D07D", 600: "#4FB057", 700: "#308337", 800: "#17481B", 900: "#020502" },
        neutral: { 50: "#FEFFFF", 100: "#FBFCFB", 200: "#F5F7F5", 300: "#ECEFEC", 400: "#DEE3DF", 500: "#C8CFC9", 600: "#A7B0A8", 700: "#79817A", 800: "#404641", 900: "#020302" },
        secondary: { 50: "#FAFFF9", 100: "#F2FCEF", 200: "#E5F7DF", 300: "#D2F0C8", 400: "#B7E4A8", 500: "#93D17E", 600: "#66B34C", 700: "#38861D", 800: "#144E00", 900: "#030D00" },
        warning: { 50: "#FFFCF5", 100: "#FCF5E6", 200: "#F7EACF", 300: "#F0DBAE", 400: "#E4C480", 500: "#D0A446", 600: "#B17C08", 700: "#845A00", 800: "#4A3200", 900: "#080500" },
      },
      fontFamily: {
        arabic: ["var(--font-noto-arabic)", "Tahoma", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
        cairo: ["var(--font-cairo)", "Tahoma", "Arial", "sans-serif"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.025em" }],
        sm: ["0.875rem", { lineHeight: "26px", letterSpacing: "0.025em" }], // 14px
        base: ["1rem", { lineHeight: "30px", letterSpacing: "0.025em" }], // 16px
        lg: ["1.25rem", { lineHeight: "37px", letterSpacing: "0.025em" }], // 20px
        xl: ["1.5rem", { lineHeight: "45px", letterSpacing: "0.025em" }], // 24px
        "2xl": ["1.75rem", { lineHeight: "52px", letterSpacing: "0.025em" }], // 28px
        "3xl": ["2rem", { lineHeight: "60px", letterSpacing: "0.025em" }], // 32px
        "4xl": ["2.5rem", { lineHeight: "75px", letterSpacing: "0.025em" }], // 40px
        "5xl": ["3rem", { lineHeight: "90px", letterSpacing: "0.025em" }], // 48px
        "6xl": ["3.5rem", { lineHeight: "105px", letterSpacing: "0.025em" }], // 56px
        "7xl": ["4rem", { lineHeight: "120px", letterSpacing: "0.025em" }], // 64px
      },
    },
  },
  plugins: [],
};
