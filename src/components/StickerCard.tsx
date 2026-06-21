import { useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import type { StickerState } from '../hooks/useStickers';

type Props = {
  label: string;
  state: StickerState;
  image?: string;
  onToggle: (target: Exclude<StickerState, null>) => void;
};

const SWIPE_THRESHOLD = 35;

type Burst = { key: number; kind: Exclude<StickerState, null> } | null;

export function StickerCard({ label, state, image, onToggle }: Props) {
  const [dragDx, setDragDx] = useState(0);
  const [burst, setBurst] = useState<Burst>(null);
  const burstId = useRef(0);
  const lastTap = useRef(0);

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
    // doble toque (2 taps < 320ms) = "la tengo"; un solo tap no hace nada (evita marcas accidentales)
    onTap: () => {
      const now = Date.now();
      if (now - lastTap.current < 320) {
        lastTap.current = 0;
        fire('owned');
      } else {
        lastTap.current = now;
      }
    },
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
    'relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-tile text-lg font-extrabold touch-manipulation select-none';

  const hasImg = !!image;

  // Con imagen: el fondo es la figu; el estado se distingue por filtro + marco + badge.
  // falta = gris/apagada · tengo = a color + ✓ · repe = a color + marco dorado + ★ · vacío = atenuada.
  const imgFilter =
    state === 'owned' || state === 'duplicate'
      ? 'none'
      : state === 'missing'
        ? 'grayscale(1) brightness(0.5)'
        : 'grayscale(0.45) brightness(0.72)';

  const frameCls = hasImg
    ? state === 'duplicate'
      ? 'bg-navy ring-2 ring-gold shadow-glow-gold'
      : state === 'owned'
        ? 'bg-navy ring-2 ring-white/80'
        : state === 'missing'
          ? 'bg-navy ring-2 ring-ice/70'
          : 'bg-navy ring-1 ring-white/10'
    : state === 'duplicate'
      ? 'bg-gold-card text-navy shadow-glow-gold'
      : state === 'owned'
        ? 'bg-white/[0.16] text-white ring-1 ring-white/45'
        : state === 'missing'
          ? 'bg-ice/10 text-white ring-2 ring-ice/55'
          : 'bg-navy text-white/40 ring-1 ring-white/10';

  const marker =
    state === 'duplicate' ? '★' : state === 'owned' ? '✓' : state === 'missing' ? '○' : '';
  const markerCls =
    state === 'duplicate'
      ? 'bg-gold text-navy'
      : state === 'owned'
        ? 'bg-white text-navy'
        : 'bg-ice text-navy';

  return (
    <div className="relative">
      <div
        {...handlers}
        role="button"
        aria-label={`Figurita ${label}`}
        className={`${base} ${frameCls} ${burst ? 'animate-pop' : ''}`}
        style={{
          transform: `translateX(${dragDx}px) rotate(${dragDx * 0.18}deg)`,
          transition: dragDx === 0 ? 'transform 180ms ease-out' : 'none',
          boxShadow: dragShadow,
        }}
      >
        {hasImg && (
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ filter: imgFilter }}
          />
        )}

        {/* brillo glossy diagonal en estado repe */}
        {state === 'duplicate' && (
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gloss" />
        )}

        {/* etiqueta del número: badge en esquina si hay imagen, grande al centro si no */}
        {hasImg ? (
          <span className="pointer-events-none absolute left-0.5 top-0.5 z-10 rounded bg-navy/75 px-1 text-[9px] font-bold leading-tight text-white/90">
            {label}
          </span>
        ) : (
          <span className="pointer-events-none relative z-10 leading-none">{label}</span>
        )}

        {/* badge de estado en esquina */}
        {marker && (
          <span
            className={`pointer-events-none absolute bottom-0.5 right-0.5 z-10 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold leading-none ${markerCls}`}
          >
            {marker}
          </span>
        )}

        {/* ghost de preview durante el swipe */}
        {dragDx > 10 && (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl text-gold drop-shadow"
            style={{ opacity: glow * 0.85 }}
          >
            ★
          </span>
        )}
        {dragDx < -10 && (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center text-3xl text-ice drop-shadow"
            style={{ opacity: glow * 0.85 }}
          >
            ○
          </span>
        )}

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
            burst.kind === 'duplicate'
              ? 'text-gold'
              : burst.kind === 'owned'
                ? 'text-white'
                : 'text-ice'
          }`}
        >
          {burst.kind === 'owned' ? '✓' : '+1'}
        </span>
      )}
    </div>
  );
}
