import { useMemo } from 'react';

const COLORS = ['#00AEEF', '#F5C542', '#FFFFFF'];

type Props = {
  pieces?: number;
  /** semilla para re-aleatorizar entre montajes */
  seed?: number;
  className?: string;
};

/**
 * Confetti CSS sin dependencias: divs absolutos que caen con animate-fall.
 * El caller controla el ciclo de vida (montar y desmontar via setTimeout).
 */
export function Confetti({ pieces = 16, seed = 0, className = '' }: Props) {
  const items = useMemo(() => {
    return Array.from({ length: pieces }, (_, i) => {
      const rnd = (n: number) => {
        const x = Math.sin((seed + 1) * 9301 + i * 49297 + n * 233280) * 43758.5453;
        return x - Math.floor(x);
      };
      return {
        left: rnd(1) * 100,
        delay: rnd(2) * 250,
        duration: 950 + rnd(3) * 450,
        color: COLORS[Math.floor(rnd(4) * COLORS.length)],
        round: rnd(5) > 0.5,
        rotate: rnd(6) * 360,
        size: 6 + rnd(7) * 5,
      };
    });
  }, [pieces, seed]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute top-0 animate-fall"
          style={{
            left: `${it.left}%`,
            width: it.size,
            height: it.size,
            background: it.color,
            borderRadius: it.round ? '9999px' : '2px',
            animationDelay: `${it.delay}ms`,
            animationDuration: `${it.duration}ms`,
            transform: `rotate(${it.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
