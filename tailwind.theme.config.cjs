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
            primary: '#334155',
            secondary: '#1e293b',
            dark: {
                primary: '#334155',
                secondary: '#1e293b'
            },
            accent: {
                gray: {
                    light: colors.gray[300],
                    dark: colors.gray[600]
                },
                default: '#334155'
            }
        }
    }
}
