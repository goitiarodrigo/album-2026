import { useEffect, useRef, useState } from 'react';
import { slotLabel, type Section } from '../data/catalog';
import type { StickerState } from '../hooks/useStickers';
import { StickerCard } from './StickerCard';
import { ProgressRing } from './ProgressRing';
import { Confetti } from './Confetti';

type Props = {
  section: Section;
  sectionData: Record<number, Exclude<StickerState, null>> | undefined;
  onToggle: (num: number, target: Exclude<StickerState, null>) => void;
  onComplete: (section: Section) => void;
};

export function SectionBlock({ section, sectionData, onToggle, onComplete }: Props) {
  const [open, setOpen] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const wasComplete = useRef(false);

  let missing = 0;
  let duplicate = 0;
  let owned = 0;
  if (sectionData) {
    for (const v of Object.values(sectionData)) {
      if (v === 'missing') missing++;
      else if (v === 'duplicate') duplicate++;
      else if (v === 'owned') owned++;
    }
  }
  // "completada" = tenés cada figu al menos una vez (pegada o repe). Las faltantes no cuentan.
  const have = owned + duplicate;
  const isComplete = have === section.total;
  const isFwc = section.group === 'fwc';
  const isCc = section.group === 'cc';

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
        isComplete ? 'shadow-gold-card' : isCc ? 'ring-1 ring-coke/30' : 'ring-1 ring-white/10'
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
          <ProgressRing value={section.total ? have / section.total : 0} size={44} stroke={4} complete={isComplete}>
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xl ring-1 ${
                isFwc ? 'ring-gold/50' : isCc ? 'ring-coke/60' : 'ring-white/15'
              }`}
            >
              {section.flag}
            </span>
          </ProgressRing>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-extrabold text-white">
              <span className="text-base">{section.code}</span>
              {isFwc && <span className="text-xs">👑</span>}
              {isCc && (
                <span className="rounded-pill bg-coke/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-coke ring-1 ring-coke/50">
                  Sponsor
                </span>
              )}
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
              {have > 0 && (
                <span className="rounded-pill bg-white/12 px-2 py-0.5 text-xs text-white/80 ring-1 ring-white/25">
                  ✓ {have}
                </span>
              )}
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
          <div className="mb-3">
            <p className="text-xs text-white/55">
              <span className="text-white/80">2 toques ✓ la tengo</span> ·{' '}
              <span className="text-ice">← falta</span> ·{' '}
              <span className="font-semibold text-gold">→ repe</span>
            </p>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {section.slots.map((n, i) => (
              <div
                key={n}
                className="animate-dealIn"
                style={{ animationDelay: `${Math.min(i, 8) * 14}ms` }}
              >
                <StickerCard
                  label={slotLabel(section, n)}
                  state={sectionData?.[n] ?? null}
                  image={section.hasImages ? `/figus/${section.code}/${n}.webp` : undefined}
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
