/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-green-500',
    'bg-red-500', 
    'bg-blue-500',
    'bg-blue-600',
    'bg-blue-700',
    'text-blue-600',
    'text-white',
    'text-4xl',
    'font-bold',
    'p-4',
    'm-4',
    'rounded',
    'shadow-lg',
    'hover:bg-blue-700',
    // Ajoutez toutes les classes que vous utilisez
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}