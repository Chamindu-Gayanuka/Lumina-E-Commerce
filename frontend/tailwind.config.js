/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#f0fdfa",
                    100: "#ccfbf1",
                    200: "#99f6e4",
                    300: "#5eead4",
                    400: "#2dd4bf",
                    500: "#14b8a6",
                    600: "#0d9488",
                    700: "#0f766e",
                    800: "#115e59",
                    900: "#134e4a",
                },
                ink: {
                    900: "#0f172a",
                    800: "#1e293b",
                    700: "#334155",
                },
            },
            fontFamily: {
                sans: [
                    "Poppins",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif",
                ],
            },
            boxShadow: {
                card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06)",
                lift: "0 10px 24px -8px rgb(15 23 42 / 0.15)",
            },
            maxWidth: {
                "8xl": "88rem",
            },
        },
    },
    plugins: [],
};