import type { Profile } from '../hooks/useProfile';
import { Avatar } from './Avatar';
import { ProfileForm } from './ProfileForm';

type Props = {
  profile: Profile;
  update: (p: Partial<Profile>) => void;
  push: (text: string) => void;
  onClose: () => void;
  onReplayOnboarding: () => void;
};

export function ProfileModal({ profile, update, push, onClose, onReplayOnboarding }: Props) {
  return (
    <div
      className="fixed inset-0 z-[65] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md animate-slideUp overflow-y-auto rounded-t-hero bg-navy-raised p-5 shadow-card ring-1 ring-white/10 sm:rounded-hero"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-white/20" />

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Tu perfil</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-xl leading-none text-white/60 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="mb-5 flex flex-col items-center">
          <Avatar avatar={profile.avatar} size={96} badges="full" />
          <p className="mt-2 text-base font-extrabold text-white">
            {profile.name.trim() || 'Coleccionista'}
          </p>
        </div>

        <ProfileForm profile={profile} update={update} push={push} />

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-pill bg-ice-cta py-3 font-semibold text-white shadow-glow-ice transition active:scale-[0.97]"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={onReplayOnboarding}
            className="text-center text-xs text-white/45 hover:text-white/70"
          >
            Ver el tutorial de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
