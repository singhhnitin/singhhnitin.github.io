const colors = require('tailwindcss/colors')

module.exports = {
    default: {
        colors: {
            primary: '#e05252',
            secondary: '#c0392b',
            dark: {
                primary: '#e05252',
                secondary: '#c0392b'
            },
            accent: {
                gray: {
                    light: colors.gray[600],
                    dark: colors.gray[400]
                },
                default: '#e05252'
            }
        }
    }
}
