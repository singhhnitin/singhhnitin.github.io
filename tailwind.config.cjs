const { fontFamily } = require('tailwindcss/defaultTheme')
const config = require('./tailwind.theme.config.cjs')
/**
 * Find the applicable theme color palette, or use the default one
 */
const themeConfig = process.env.THEME_KEY && config[process.env.THEME_KEY] ? config[process.env.THEME_KEY] : config.default
const { colors } = themeConfig
module.exports = {
    darkMode: 'class',
    content: [
        './public/**/*.html',
        './src/**/*.{astro,js,ts}'
    ],
    safelist: ['dark'],
    theme: {
        fontFamily: {
            display: ['Fraunces', ...fontFamily.serif],
            sans: ['Inter', ...fontFamily.sans],
            mono: ['"JetBrains Mono"', ...fontFamily.mono],
        },
        extend: {
            colors: {
                theme: {
                    ...colors
                }
            },
            typography: (theme) => ({
                dark: {
                    css: {
                        color: colors.dark.secondary,
                        blockquote: {
                            color: colors.dark.primary,
                            borderColor: colors.dark.primary,
                        },
                        'blockquote > p::before, p::after': {
                            color: colors.dark.primary,
                        },
                        a: {
                            color: colors.dark.primary,
                            '&:hover': {
                                color: colors.dark.primary,
                            },
                        },
                        h1: { color: colors.dark.secondary },
                        h2: { color: colors.dark.secondary },
                        h3: { color: colors.dark.secondary },
                        strong: { color: colors.dark.secondary },
                        code: { color: colors.accent['teal-dark'] },
                    },
                },
                DEFAULT: {
                    css: {
                        a: {
                            color: colors.primary,
                            '&:hover': {
                                color: colors.primary,
                            },
                        },
                        blockquote: {
                            color: colors.primary,
                            fontSize: theme("fontSize.2xl"),
                            borderColor: colors.primary,
                        },
                        'blockquote > p::before, p::after': {
                            color: colors.primary,
                        },
                        h1: {
                            color: colors.secondary,
                        },
                        h2: {
                            color: colors.secondary,
                        },
                        h3: {
                            color: colors.secondary,
                        },
                        code: { color: colors.accent.teal },
                    }
                },
            }),
        },
    },
    variants: {
        extend: { typography: ["dark"] }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
    ]
};
