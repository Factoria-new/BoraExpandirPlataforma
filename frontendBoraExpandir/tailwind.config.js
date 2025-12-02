/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: 'rgb(var(--card) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--muted-foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-foreground': 'rgb(var(--primary-foreground) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        'destructive-foreground': 'rgb(var(--destructive-foreground) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        'success-foreground': 'rgb(var(--success-foreground) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        'warning-foreground': 'rgb(var(--warning-foreground) / <alpha-value>)',
        // KPI custom tokens
        'kpi-blue': 'rgb(var(--kpi-blue) / <alpha-value>)',
        'kpi-blue-bg': 'rgb(var(--kpi-blue-bg) / <alpha-value>)',
        'kpi-yellow': 'rgb(var(--kpi-yellow) / <alpha-value>)',
        'kpi-yellow-bg': 'rgb(var(--kpi-yellow-bg) / <alpha-value>)',
        'kpi-red': 'rgb(var(--kpi-red) / <alpha-value>)',
        'kpi-red-bg': 'rgb(var(--kpi-red-bg) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}
