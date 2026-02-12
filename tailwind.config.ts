import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#2874f0", // Flipkart Blue
                secondary: "#fb641b", // Flipkart Orange
                "veda-background": "#FDDDE6", // Soft Pink Background
                "pink-soft": "#FDDDE6",
                "pink-pastel": "#FFD1DC",
                veda: {
                    tan: "#D2B48C",
                    gold: "#B8860B",
                    cream: "#FFFDD0",
                    dark: "#2D2D2D",
                    accent: "#C5A059",
                }
            },
        },
    },
    plugins: [],
};
export default config;
