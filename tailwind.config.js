/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Define a proper color palette
      colors: {
        background: 'hsl(var(--background))', // Main background
        foreground: 'hsl(var(--foreground))', // Main text color
        card: 'hsl(var(--card))',             // Card backgrounds
        'card-foreground': 'hsl(var(--card-foreground))',
        primary: 'hsl(var(--primary))',       // Primary accent (buttons, links)
        'primary-foreground': 'hsl(var(--primary-foreground))',
        muted: 'hsl(var(--muted))',           // Muted text
        'muted-foreground': 'hsl(var(--muted-foreground))',
        border: 'hsl(var(--border))',         // Borders and dividers
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
};