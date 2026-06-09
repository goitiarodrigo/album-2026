import { useRef } from 'react';
import type { Profile } from '../hooks/useProfile';
import { Avatar, PRESETS, PRESET_EMOJI } from './Avatar';

type Props = {
  profile: Profile;
  update: (p: Partial<Profile>) => void;
  push: (text: string) => void;
};

function downscale(file: File, size: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('img'));
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = c.height = size;
        const ctx = c.getContext('2d');
        if (!ctx) return reject(new Error('ctx'));
        const s = Math.min(img.width, img.height); // recorte cuadrado (cover)
        const sx = (img.width - s) / 2;
        const sy = (img.height - s) / 2;
        ctx.drawImage(img, sx, sy, s, s, 0, 0, size, size);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export function ProfileForm({ profile, update, push }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // permite re-elegir la misma foto
    if (!file || !file.type.startsWith('image/')) {
      push('Subí una imagen 🙂');
      return;
    }
    try {
      const dataUrl = await downscale(file, 256);
      update({ avatar: dataUrl });
    } catch {
      push('No pudimos procesar esa foto');
    }
  }

  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-white/55">
        Tu nombre
      </label>
      <div className="rounded-card bg-white/[0.06] ring-1 ring-white/10 focus-within:shadow-focus-ice">
        <input
          type="text"
          value={profile.name}
          maxLength={24}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Ej: Rodri"
          className="w-full bg-transparent px-4 py-2.5 text-base text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>

      <label className="mb-1.5 mt-4 block text-xs font-semibold uppercase tracking-wide text-white/55">
        Tu avatar
      </label>
      <div className="flex flex-wrap items-center gap-2">
        {PRESETS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => update({ avatar: id })}
            className={`flex h-12 w-12 items-center justify-center rounded-full bg-field text-xl ring-2 transition active:scale-95 ${
              profile.avatar === id ? 'shadow-glow-gold ring-gold' : 'ring-white/12 hover:ring-white/30'
            }`}
          >
            {PRESET_EMOJI[id]}
          </button>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-pill bg-white/8 px-3 py-2 text-sm text-white ring-1 ring-white/15 transition hover:bg-white/12"
        >
          📷 Subir foto
        </button>
        {!profile.avatar.startsWith('preset:') && (
          <button
            type="button"
            onClick={() => update({ avatar: 'preset:pelota' })}
            className="rounded-pill px-2 py-2 text-sm text-white/50 hover:text-white"
          >
            Quitar
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>

      {!profile.avatar.startsWith('preset:') && (
        <div className="mt-3 flex items-center gap-2 text-xs text-white/50">
          <Avatar avatar={profile.avatar} size={36} badges="trophy" />
          Foto cargada · se ve con tu 🇦🇷 y la 🏆
        </div>
      )}
    </div>
  );
}
