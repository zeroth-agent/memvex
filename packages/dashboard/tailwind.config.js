/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                // Custom dark theme palette
                background: '#09090b', // zinc-950
                surface: '#18181b', // zinc-900
                surfaceHighlight: '#27272a', // zinc-800
                border: '#27272a', // zinc-800
                primary: '#3b82f6', // blue-500
                primaryHover: '#2563eb', // blue-600
                text: '#e4e4e7', // zinc-200
                textMuted: '#a1a1aa', // zinc-400
            }
        },
    },
    plugins: [],
}
