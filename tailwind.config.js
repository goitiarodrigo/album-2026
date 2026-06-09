/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta de marca: los 4 hex obligatorios + sombras del MISMO color (no colores nuevos)
        navy: { DEFAULT: '#0A2342', raised: '#0E2C52', deep: '#071A33' },
        ice: { DEFAULT: '#00AEEF', deep: '#0077B6' },
        gold: { DEFAULT: '#F5C542', deep: '#C9942B' },
        // nombres logicos re-mapeados SIN tocar la logica: falta=celeste frio, repe=dorado
        missing: '#00AEEF',
        duplicate: '#F5C542',
      },
      borderRadius: {
        tile: '0.875rem', // 14px - tiles tipo cromo
        card: '1.125rem', // 18px - cards de seccion
        hero: '1.75rem', // 28px - borde inferior del header
        pill: '9999px',
      },
      boxShadow: {
        card: '0 8px 24px -6px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        'glow-ice': '0 0 20px rgba(0,174,239,0.45)',
        'glow-gold': '0 4px 16px rgba(245,197,66,0.40), inset 0 1px 0 rgba(255,255,255,0.30)',
        'gold-card': '0 0 0 2px #F5C542, 0 8px 28px -4px rgba(245,197,66,0.35)',
        'focus-ice': '0 0 0 3px rgba(0,174,239,0.30)',
      },
      backgroundImage: {
        field: 'radial-gradient(120% 80% at 50% -5%, #0E2C52 0%, #0A2342 48%, #071A33 100%)',
        hero: 'linear-gradient(135deg, #00AEEF 0%, #0A2342 100%)',
        'gold-card': 'linear-gradient(135deg, #F5C542 0%, #C9942B 100%)',
        'ice-cta': 'linear-gradient(135deg, #00AEEF 0%, #0077B6 100%)',
        'gold-line': 'linear-gradient(90deg, transparent, rgba(245,197,66,0.5), transparent)',
        progress: 'linear-gradient(90deg, #00AEEF 0%, #F5C542 100%)',
        gloss: 'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 55%)',
        shimmer: 'linear-gradient(110deg, transparent 30%, rgba(245,197,66,0.28) 50%, transparent 70%)',
      },
      keyframes: {
        pop: { '0%': { transform: 'scale(1)' }, '55%': { transform: 'scale(1.14)' }, '100%': { transform: 'scale(1)' } },
        flash: { '0%': { opacity: '0.85' }, '100%': { opacity: '0' } },
        dealIn: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        floatUp: { '0%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(-24px)', opacity: '0' } },
        fall: { '0%': { transform: 'translateY(-16px) rotate(0)', opacity: '1' }, '100%': { transform: 'translateY(130px) rotate(220deg)', opacity: '0' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        sealIn: { '0%': { opacity: '0', transform: 'scale(0.6) rotate(-8deg)' }, '100%': { opacity: '1', transform: 'scale(1) rotate(0)' } },
        ringPulse: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.08)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(245,197,66,0.5)' }, '50%': { boxShadow: '0 0 0 9px rgba(245,197,66,0)' } },
        breathe: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.02)' } },
        slideUp: { '0%': { transform: 'translateY(100%)' }, '100%': { transform: 'translateY(0)' } },
      },
      animation: {
        pop: 'pop 280ms cubic-bezier(0.34,1.56,0.64,1)',
        flash: 'flash 220ms ease-out forwards',
        dealIn: 'dealIn 200ms ease-out both',
        floatUp: 'floatUp 520ms ease-out forwards',
        fall: 'fall 1100ms ease-in forwards',
        shimmer: 'shimmer 4s linear infinite',
        sealIn: 'sealIn 300ms cubic-bezier(0.34,1.56,0.64,1) both',
        ringPulse: 'ringPulse 900ms ease-in-out 2',
        pulseGlow: 'pulseGlow 1.8s ease-out infinite',
        breathe: 'breathe 3s ease-in-out infinite',
        slideUp: 'slideUp 280ms ease-out',
      },
    },
  },
  plugins: [],
}
