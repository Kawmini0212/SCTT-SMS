/** @type {import('tailwindcss').Config} */
/**
 * BRAND COLOR PALETTE — single source of truth
 * ─────────────────────────────────────────────
 * brand-black  : #111111  — surfaces, text, nav, sidebar
 * brand-red    : #DC2626  — primary actions, active states, badges
 * brand-yellow : #FBBF24  — accents, highlights, icons
 * brand-white  : #FFFFFF  — backgrounds, card surfaces, text on dark
 * brand-gray   : #F4F4F4  — page background, subtle fills
 * brand-gray2  : #E5E5E5  — borders, dividers
 * brand-gray3  : #6B6B6B  — muted / secondary text
 */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    black: '#111111',
                    red: '#DC2626',
                    'red-hover': '#B91C1C',
                    yellow: '#FBBF24',
                    'yellow-hover': '#F59E0B',
                    white: '#FFFFFF',
                    gray: '#F4F4F4',
                    gray2: '#E5E5E5',
                    gray3: '#6B6B6B',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.4s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
            },
            keyframes: {
                fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
                slideIn: { '0%': { transform: 'translateY(-8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
                scaleIn: { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
            },
        },
    },
    plugins: [require('@tailwindcss/forms')],
}
