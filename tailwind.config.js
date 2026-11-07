/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        mint: 'var(--color-mint)',
        surface: 'var(--color-surface)',
        cream: 'var(--color-bg)',
        cocoa: 'var(--color-text)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
