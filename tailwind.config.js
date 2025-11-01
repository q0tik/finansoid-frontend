/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
            },
            colors: {
                primary: "#2563eb",
                accent: "#6366f1",
                background: "#f9fafb",
                surface: "#ffffff",
                muted: "#f1f5f9",
                text: "#111827",
            },
            boxShadow: {
                soft: "0 2px 8px rgba(0,0,0,0.08)",
                floating: "0 8px 16px rgba(37,99,235,0.25)",
            },
            borderRadius: {
                xl: "1rem",
                "2xl": "1.25rem",
            },
        },
    },
};