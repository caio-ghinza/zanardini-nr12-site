/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAF8F5",
        surface: "#FFFFFF",
        surfaceSubtle: "#F3F0EB",
        accentAmber: "#D97706",
        accentAmberHover: "#B45309",
        accentAmberLight: "#FEF3C7",
        accentRed: "#DC2626",
        accentRedLight: "#FEE2E2",
        accentGreen: "#16A34A",
        accentGreenLight: "#DCFCE7",
        accentBlue: "#0284C7",
        accentBlueLight: "#E0F2FE",
        textPrimary: "#1A1A1A",
        textSecondary: "#6B6560",
        textMuted: "#9C9590",
        brand: "#E5E1D8",
        strong: "#C9C3B8",
        borderBrand: "#E5E1D8",
        borderStrong: "#C9C3B8",
      },
      borderColor: theme => ({
        ...theme('colors'),
        DEFAULT: "#E5E1D8",
        brand: "#E5E1D8",
        strong: "#C9C3B8",
      }),
      borderRadius: {
        'card': '12px',
      },
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        plex: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      boxShadow: {
        'bento': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'bento-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      }
    },
  },
  plugins: [],
}
