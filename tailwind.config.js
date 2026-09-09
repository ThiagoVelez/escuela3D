export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#715c00",
        "primary-container": "#fcd116",
        "on-primary": "#ffffff",
        "on-primary-container": "#6e5a00",
        "primary-fixed": "#ffe17b",
        "primary-fixed-dim": "#ecc300",
        "on-primary-fixed-variant": "#554500",
        
        "secondary": "#335ab4",
        "secondary-container": "#7da0ff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#003387",
        
        "tertiary": "#c0001f",
        "tertiary-container": "#ffc8c4",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#bb001e",

        "background": "#f7f9fb",
        "on-background": "#191c1e",
        "surface": "#f7f9fb",
        "on-surface": "#191c1e",
        "on-surface-variant": "#4d4632",
        "surface-container": "#eceef0",
        "surface-container-low": "#f2f4f6",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-container-lowest": "#ffffff",
        "surface-variant": "#e0e3e5",
        
        "outline": "#7f7760",
        "outline-variant": "#d0c6ab",
        "error": "#ba1a1a",
        "error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "full": "9999px"
      },
      spacing: {
        "xs": "4px",
        "base": "8px",
        "margin-mobile": "16px",
        "margin-desktop": "40px",
        "gutter": "24px",
        "sm": "12px",
        "md": "24px",
        "lg": "48px",
        "xl": "80px"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
