import { useState } from 'react';
import type { Profile } from '../hooks/useProfile';
import { ProgressRing } from './ProgressRing';
import { Avatar } from './Avatar';
import { ProfileForm } from './ProfileForm';

type Props = {
  profile: Profile;
  update: (p: Partial<Profile>) => void;
  push: (text: string) => void;
  onFinish: () => void;
};

const STEPS = [
  {
    title: '¡Bienvenido, coleccionista! ⚽',
    body: 'Tu álbum del Mundial 2026, siempre en el bolsillo. Marcá lo que te falta y lo que te sobra, y completá las 51 secciones (1020 figus).',
  },
  {
    title: 'Marcá tus figus 👆',
    body: 'TOCÁ una figu si YA LA TENÉS (queda ✓). Deslizá ← si te FALTA (celeste) o → si la tenés REPETIDA (dorada). Tocá o deslizá de nuevo para desmarcar.',
  },
  {
    title: 'Subí de nivel 🏆',
    body: 'Tu álbum sube con las figus que TENÉS (pegadas o repes), no con las que te faltan. Completá selecciones y escalá de Novato a Leyenda. El dorado = lo más valioso.',
  },
  {
    title: 'Hacé MATCH con un amigo 🤝',
    body: 'Pasale tu LINK; la app cruza ambas listas y te muestra qué pueden cambiar: tus repes que él necesita y al revés. Después copiás el match y lo arreglan por WhatsApp — algunas figus valen más que otras 😉',
  },
  {
    title: 'Este sos vos ✎',
    body: 'Ponete un nombre y elegí tu foto o un avatar. Te acompaña con la banderita 🇦🇷 y la copa 🏆.',
  },
];

function Visual({ step, profile, update, push }: { step: number } & Omit<Props, 'onFinish'>) {
  if (step === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-2">
        <ProgressRing value={0.63} size={92} stroke={7}>
          <span className="text-2xl font-extrabold text-gold">★</span>
        </ProgressRing>
        <div className="flex gap-1.5 text-2xl">
          {['🏆', '🌎', '📜', '🇦🇷', '🇧🇷', '🇲🇽'].map((e, i) => (
            <span key={i} className="animate-dealIn" style={{ animationDelay: `${i * 60}ms` }}>
              {e}
            </span>
          ))}
        </div>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="flex items-end justify-center gap-2 py-4">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl text-ice">←</span>
          <div className="flex aspect-[4/5] w-14 flex-col items-center justify-center rounded-tile bg-ice/10 text-white ring-2 ring-ice/55">
            <span className="text-base font-extrabold">10</span>
            <span className="text-[9px] text-ice">○ FALTA</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl text-white/70">👆</span>
          <div className="flex aspect-[4/5] w-14 flex-col items-center justify-center rounded-tile bg-white/[0.16] text-white ring-1 ring-white/45">
            <span className="text-base font-extrabold">10</span>
            <span className="text-[9px] text-white/75">✓ TENGO</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-xl text-gold">→</span>
          <div className="relative flex aspect-[4/5] w-14 flex-col items-center justify-center rounded-tile bg-gold-card text-navy shadow-glow-gold">
            <span className="absolute inset-x-0 top-0 h-1/2 bg-gloss" />
            <span className="relative text-base font-extrabold">10</span>
            <span className="relative text-[9px] font-bold">★ REPE</span>
          </div>
        </div>
      </div>
    );
  }
  if (step === 2) {
    return (
      <div className="flex flex-col items-center gap-3 py-3">
        <div className="relative h-3 w-56 overflow-hidden rounded-pill bg-white/12">
          <div className="h-full w-[62%] rounded-pill bg-progress" />
          {[25, 50, 75].map((t) => (
            <span
              key={t}
              className={`absolute top-1/2 h-2 w-0.5 -translate-y-1/2 ${t <= 62 ? 'bg-gold' : 'bg-white/30'}`}
              style={{ left: `${t}%` }}
            />
          ))}
        </div>
        <span className="rounded-pill bg-gold/15 px-3 py-1 text-sm font-bold text-gold ring-1 ring-gold/40">
          Experto · 62%
        </span>
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="flex items-center justify-center gap-3 py-3">
        <Avatar avatar="preset:camiseta" size={56} badges="full" />
        <div className="flex flex-col items-center gap-1">
          <span className="text-gold">★ →</span>
          <span className="animate-pulseGlow rounded-pill bg-gold-card px-2.5 py-0.5 text-xs font-bold text-navy">
            MATCH
          </span>
          <span className="text-ice">← ○</span>
        </div>
        <Avatar avatar={profile.avatar} size={56} badges="full" />
      </div>
    );
  }
  // step 4 = perfil
  return (
    <div className="py-1">
      <div className="mb-4 flex justify-center">
        <Avatar avatar={profile.avatar} size={88} badges="full" />
      </div>
      <ProfileForm profile={profile} update={update} push={push} />
    </div>
  );
}

export function Onboarding({ profile, update, push, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const last = STEPS.length - 1;
  const isLast = step === last;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-deep/95 px-4 backdrop-blur">
      <div className="flex max-h-[92vh] w-full max-w-md animate-slideUp flex-col overflow-y-auto rounded-hero bg-navy-raised p-5 shadow-card ring-1 ring-white/10">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-1.5">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-pill transition-all ${i === step ? 'w-5 bg-gold' : 'w-1.5 bg-white/20'}`}
              />
            ))}
          </div>
          {!isLast && (
            <button type="button" onClick={onFinish} className="text-xs text-white/45 hover:text-white/70">
              Saltar
            </button>
          )}
        </div>

        <div className="rounded-card bg-field p-3 ring-1 ring-white/10">
          <Visual step={step} profile={profile} update={update} push={push} />
        </div>

        <h2 className="mt-4 text-xl font-extrabold text-white">{STEPS[step].title}</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{STEPS[step].body}</p>

        <div className="mt-5 flex items-center gap-2">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="rounded-pill bg-white/8 px-4 py-3 text-sm font-medium text-white/70 ring-1 ring-white/15 hover:text-white"
            >
              Atrás
            </button>
          )}
          <button
            type="button"
            onClick={() => (isLast ? onFinish() : setStep((s) => s + 1))}
            className="flex-1 rounded-pill bg-ice-cta py-3 font-semibold text-white shadow-glow-ice transition active:scale-[0.97]"
          >
            {isLast ? '¡Empezar!' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
