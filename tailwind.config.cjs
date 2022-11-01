/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ], theme: {
        colors: {},
        extend: {
            colors: {
                primary: "#437f74",
                black: 'rgb(54,54,54)'
            },
            fontFamily: {},
        },
    },
    plugins: [],
}
