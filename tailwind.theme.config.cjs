const colors = require('tailwindcss/colors')

module.exports = {
    default: {
        colors: {
            primary: '#c8720a',
            secondary: '#12161d',
            dark: {
                primary: '#eba53d',
                secondary: '#faf7f0'
            },
            accent: {
                gray: {
                    light: '#6b6558',
                    dark: '#948f80'
                },
                default: '#eba53d',
                teal: '#0f8b8b',
                'teal-dark': '#45d6c4'
            },
            ink: {
                DEFAULT: '#0b0e13',
                panel: '#12161d',
                raised: '#171c24',
                border: '#262b34'
            },
            paper: {
                DEFAULT: '#faf7f0',
                panel: '#ffffff',
                raised: '#f1ece0',
                border: '#e4ddcc'
            }
        }
    }
}
