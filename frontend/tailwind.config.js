/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './contexts/**/*.{js,jsx}',
    './hooks/**/*.{js,jsx}',
    './services/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#0f1216',
          raised: '#161b22',
          overlay: '#1c232c',
          border: '#2a333f',
        },
        content: {
          primary: '#e6edf3',
          secondary: '#9aa7b4',
          muted: '#6b7785',
        },
        accent: {
          DEFAULT: '#2f81f7',
          muted: '#1f5fb8',
        },
        state: {
          success: '#2ea043',
          warning: '#d29922',
          danger: '#f85149',
          info: '#58a6ff',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      borderRadius: {
        md: '0.375rem',
        lg: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 0 0 rgba(255,255,255,0.02), 0 1px 3px 0 rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};