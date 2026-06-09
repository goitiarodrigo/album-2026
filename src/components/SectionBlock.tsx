import { useEffect, useRef, useState } from 'react';
import type { Section } from '../data/catalog';
import type { StickerState } from '../hooks/useStickers';
import { StickerCard } from './StickerCard';
import { ProgressRing } from './ProgressRing';
import { Confetti } from './Confetti';

type Props = {
  section: Section;
  sectionData: Record<number, Exclude<StickerState, null>> | undefined;
  onToggle: (num: number, target: Exclude<StickerState, null>) => void;
  onReset: () => void;
  onComplete: (section: Section) => void;
};

export function SectionBlock({ section, sectionData, onToggle, onReset, onComplete }: Props) {
  const [open, setOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const wasComplete = useRef(false);

  let missing = 0;
  let duplicate = 0;
  if (sectionData) {
    for (const v of Object.values(sectionData)) {
      if (v === 'missing') missing++;
      else if (v === 'duplicate') duplicate++;
    }
  }
  const marked = missing + duplicate;
  const isComplete = marked === section.total;
  const isFwc = section.group === 'fwc';

  // dispara celebracion solo en la transicion a completa
  useEffect(() => {
    if (isComplete && !wasComplete.current) {
      setConfettiKey((k) => k + 1);
      onComplete(section);
    }
    wasComplete.current = isComplete;
  }, [isComplete, onComplete, section]);

  return (
    <section
      className={`relative overflow-hidden rounded-card bg-navy-raised shadow-card transition-shadow ${
        isComplete ? 'shadow-gold-card' : 'ring-1 ring-white/10'
      }`}
    >
      {confettiKey > 0 && isComplete && <Confetti key={confettiKey} seed={confettiKey} pieces={16} />}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-3 px-3.5 py-3 text-left ${
          open ? 'bg-white/5' : ''
        }`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <ProgressRing value={section.total ? marked / section.total : 0} size={44} stroke={4} complete={isComplete}>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xl ring-1 ${
                isFwc ? 'ring-gold/50' : 'ring-white/15'
              }`}
            >
              {section.flag}
            </span>
          </ProgressRing>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-extrabold text-white">
              <span className="text-base">{section.code}</span>
              {isFwc && <span className="text-xs">👑</span>}
            </div>
            <div className="truncate text-sm text-white/55">{section.name}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isComplete ? (
            <span className="animate-sealIn rounded-pill bg-gold-card px-2.5 py-0.5 text-xs font-bold text-navy">
              ★ COMPLETA
            </span>
          ) : (
            <div className="flex gap-1.5">
              {missing > 0 && (
                <span className="rounded-pill bg-ice/15 px-2 py-0.5 text-xs text-ice ring-1 ring-ice/40">
                  ○ {missing}
                </span>
              )}
              {duplicate > 0 && (
                <span className="rounded-pill bg-gold/15 px-2 py-0.5 text-xs font-semibold text-gold ring-1 ring-gold/40">
                  ★ {duplicate}
                </span>
              )}
            </div>
          )}
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/8 text-ice transition-transform ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          >
            ▾
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-white/8 px-3 pb-4 pt-3">
          <div className="mb-3 h-px bg-gold-line" />
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-white/55">
              Desliza <span className="text-white/55">← falta</span> ·{' '}
              <span className="font-semibold text-gold">→ repe</span>
            </p>
            <button
              type="button"
              onClick={onReset}
              className="rounded-pill bg-white/8 px-2.5 py-1 text-xs text-white/55 hover:text-white"
            >
              Limpiar
            </button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: section.total }, (_, i) => i + 1).map((n, i) => (
              <div
                key={n}
                className="animate-dealIn"
                style={{ animationDelay: `${Math.min(i, 8) * 14}ms` }}
              >
                <StickerCard
                  number={n}
                  state={sectionData?.[n] ?? null}
                  onToggle={(target) => onToggle(n, target)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
