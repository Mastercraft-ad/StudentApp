import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#1DB954',
        'dark-navy': '#0B1B3C',
        'teal': '#A6D5D5',
        'light-gray': '#F5F6F8',
        'muted-gray': '#E5E7EB',
        border: "#E5E7EB",
        input: "#FFFFFF",
        ring: "#1DB954",
        background: "#F5F6F8",
        foreground: "#000000",
        primary: {
          DEFAULT: "#1DB954",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#A6D5D5",
          foreground: "#0B1B3C",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#E5E7EB",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#F5F6F8",
          foreground: "#0B1B3C",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [forms],
}