import { ProgressRing } from './ProgressRing';
import { collectorLevel } from '../lib/progress';
import { Avatar } from './Avatar';
import type { Profile } from '../hooks/useProfile';

type Props = {
  marked: number;
  total: number;
  profile?: Profile;
  hasProfile?: boolean;
  onOpenProfile?: () => void;
};

export function ProgressHeader({ marked, total, profile, hasProfile, onOpenProfile }: Props) {
  const ratio = total ? marked / total : 0;
  const pct = Math.round(ratio * 100);
  const complete = pct >= 100;
  const level = collectorLevel(pct);

  return (
    <header className="hero-sweep relative -mx-4 overflow-hidden rounded-b-hero border-b border-white/10 bg-hero px-4 pb-4 pt-5">
      {profile && (
        <button
          type="button"
          onClick={onOpenProfile}
          className="relative mb-3 flex w-full items-center gap-2.5 rounded-pill bg-white/[0.06] px-2 py-1.5 ring-1 ring-white/10 transition hover:bg-white/[0.1] active:scale-[0.98]"
        >
          <Avatar avatar={profile.avatar} size={40} badges="trophy" />
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-bold text-white">
              {hasProfile ? `¡Hola, ${profile.name}!` : '¡Armá tu perfil!'}
            </span>
            <span className="block text-[11px] text-white/50">
              {hasProfile ? `${level.label} · ${pct}% del álbum` : 'Tocá para tu nombre y foto'}
            </span>
          </span>
          <span className="text-sm text-white/35">✎</span>
        </button>
      )}
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5 text-2xl font-extrabold leading-none tracking-tight text-white">
            Mis Figus <span className="text-gold">★</span>
          </h1>
          <div
            className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-gold"
            style={{ textShadow: '0 0 10px rgba(245,197,66,0.4)' }}
          >
            Mundial 2026
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-white/55">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ice" />
            Completá tu álbum · compartí tus repes
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-center">
          <ProgressRing value={ratio} size={60} stroke={5} complete={complete}>
            <span className="text-base font-extrabold tabular text-white">{pct}%</span>
          </ProgressRing>
          <span className={`mt-1 text-[10px] font-semibold ${level.gold ? 'text-gold' : 'text-white/60'}`}>
            {level.label}
          </span>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="mb-1 flex justify-between text-xs text-white/80 tabular">
          <span>Álbum {pct}%</span>
          <span>
            {marked}/{total}
          </span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-pill bg-white/12">
          <div
            className="h-full rounded-pill bg-progress transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
          {[25, 50, 75].map((t) => (
            <span
              key={t}
              className={`absolute top-1/2 h-2 w-0.5 -translate-y-1/2 rounded-full ${
                pct >= t ? 'bg-gold' : 'bg-white/30'
              }`}
              style={{ left: `${t}%` }}
            />
          ))}
        </div>
      </div>
    </header>
  );
}
