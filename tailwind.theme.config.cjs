const colors = require('tailwindcss/colors')

module.exports = {
    purpleheart: {
        colors: {
            primary: colors.purple[700],
            secondary: colors.purple[800],
            dark: {
                primary: colors.purple[300],
                secondary: colors.purple[500]
            },
            accent: {
                gray: {
                    light: colors.gray[300],
                    dark: colors.gray[500]
                },
                default: colors.blue[700]
            }
        }
    },
    default: {
        colors: {
            primary: '#1a1a1a',
            secondary: '#000000',
            dark: {
                primary: '#1a1a1a',
                secondary: '#000000'
            },
            accent: {
                gray: {
                    light: colors.gray[300],
                    dark: colors.gray[600]
                },
                default: '#1a1a1a'
            }
        }
    }
}
