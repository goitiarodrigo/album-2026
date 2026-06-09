import { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { StickerState } from '../hooks/useStickers';

type Props = {
  number: number;
  state: StickerState;
  onToggle: (target: Exclude<StickerState, null>) => void;
};

const SWIPE_THRESHOLD = 35;

type Burst = { key: number; kind: Exclude<StickerState, null> } | null;

export function StickerCard({ number, state, onToggle }: Props) {
  const [dragDx, setDragDx] = useState(0);
  const [burst, setBurst] = useState<Burst>(null);
  const burstId = useRef(0);

  const fire = (kind: Exclude<StickerState, null>) => {
    setDragDx(0);
    onToggle(kind);
    setBurst({ key: ++burstId.current, kind });
    if (kind === 'duplicate' && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
    window.setTimeout(() => setBurst(null), 600);
  };

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        setDragDx(Math.max(-70, Math.min(70, e.deltaX)));
      }
    },
    onSwipedLeft: () => fire('missing'),
    onSwipedRight: () => fire('duplicate'),
    onSwiped: () => setDragDx(0),
    delta: SWIPE_THRESHOLD,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  const glow = Math.min(1, Math.abs(dragDx) / SWIPE_THRESHOLD);
  const dragShadow =
    dragDx > 10
      ? `0 0 22px rgba(245,197,66,${0.5 * glow})`
      : dragDx < -10
        ? `0 0 22px rgba(0,174,239,${0.5 * glow})`
        : undefined;

  const base =
    'relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-tile text-lg font-extrabold touch-pan-y select-none';

  const stateCls =
    state === 'duplicate'
      ? 'bg-gold-card text-navy shadow-glow-gold'
      : state === 'missing'
        ? 'bg-ice/10 text-white ring-2 ring-ice/55'
        : 'bg-navy text-white/40 ring-1 ring-white/10';

  return (
    <div className="relative">
      <div
        {...handlers}
        role="button"
        aria-label={`Figurita ${number}`}
        className={`${base} ${stateCls} ${burst ? 'animate-pop' : ''}`}
        style={{
          transform: `translateX(${dragDx}px) rotate(${dragDx * 0.18}deg)`,
          transition: dragDx === 0 ? 'transform 180ms ease-out' : 'none',
          boxShadow: dragShadow,
        }}
      >
        {/* brillo glossy diagonal en estado repe */}
        {state === 'duplicate' && (
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gloss" />
        )}
        {/* estrella en repe */}
        {state === 'duplicate' && (
          <span className="pointer-events-none absolute right-1 top-0.5 text-[10px] text-white/80">★</span>
        )}

        {/* ghost de preview durante el swipe */}
        {dragDx > 10 && (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl text-gold"
            style={{ opacity: glow * 0.8 }}
          >
            ★
          </span>
        )}
        {dragDx < -10 && (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl text-ice"
            style={{ opacity: glow * 0.8 }}
          >
            ○
          </span>
        )}

        <span className="pointer-events-none relative z-10">{number}</span>

        {/* flash de revelado al confirmar */}
        {burst && (
          <span
            key={burst.key}
            className="animate-flash pointer-events-none absolute inset-0 bg-white"
          />
        )}
      </div>

      {/* +1 flotante */}
      {burst && (
        <span
          key={burst.key}
          className={`animate-floatUp pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 text-sm font-extrabold ${
            burst.kind === 'duplicate' ? 'text-gold' : 'text-ice'
          }`}
        >
          +1
        </span>
      )}
    </div>
  );
}
