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
                invert: {
                    css: {
                        '--tw-prose-invert-body': 'var(--text-muted)',
                        '--tw-prose-invert-headings': 'var(--text)',
                        '--tw-prose-invert-bold': 'var(--text)',
                        '--tw-prose-invert-links': 'var(--accent)',
                        '--tw-prose-invert-code': 'var(--accent-2)',
                        '--tw-prose-invert-quotes': 'var(--text-muted)',
                        '--tw-prose-invert-quote-borders': 'var(--accent)',
                    },
                },
                DEFAULT: {
                    css: {
                        '--tw-prose-body': 'var(--text-muted)',
                        '--tw-prose-headings': 'var(--text)',
                        '--tw-prose-bold': 'var(--text)',
                        '--tw-prose-links': 'var(--accent)',
                        '--tw-prose-code': 'var(--accent-2)',
                        '--tw-prose-quotes': 'var(--text-muted)',
                        '--tw-prose-quote-borders': 'var(--accent)',
                        color: 'var(--text-muted)',
                        maxWidth: 'none',
                        a: {
                            color: 'var(--accent)',
                            '&:hover': {
                                color: 'var(--accent-2)',
                            },
                        },
                        blockquote: {
                            color: 'var(--text-muted)',
                            fontSize: theme("fontSize.2xl"),
                            fontStyle: 'normal',
                            borderColor: 'var(--accent)',
                        },
                        'blockquote > p::before, p::after': {
                            color: 'var(--accent)',
                        },
                        h1: { color: 'var(--text)' },
                        h2: { color: 'var(--text)' },
                        h3: { color: 'var(--text)' },
                        strong: { color: 'var(--text)' },
                        code: { color: 'var(--accent-2)' },
                    }
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio'),
    ]
};
