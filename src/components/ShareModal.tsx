import { useMemo, useState } from 'react';
import { SECTIONS } from '../data/catalog';
import type { StickersMap } from '../hooks/useStickers';
import { buildMatchLink, encodeList } from '../lib/match';

type Mode = 'missing' | 'duplicate' | 'match';

type Props = {
  stickers: StickersMap;
  onClose: () => void;
  name?: string;
};

function buildText(stickers: StickersMap, mode: 'missing' | 'duplicate'): string {
  const header = mode === 'missing' ? 'Me faltan' : 'Tengo repetidas';
  const lines: string[] = ['Mis Figus · Mundial 2026', header, ''];
  for (const section of SECTIONS) {
    const data = stickers[section.code];
    if (!data) continue;
    const nums = Object.entries(data)
      .filter(([, v]) => v === mode)
      .map(([k]) => parseInt(k, 10))
      .sort((a, b) => a - b);
    if (nums.length === 0) continue;
    lines.push(`${section.code} ${section.flag}: ${nums.join(', ')}`);
  }
  return lines.join('\n');
}

export function ShareModal({ stickers, onClose, name = '' }: Props) {
  const [mode, setMode] = useState<Mode>('missing');
  const [copied, setCopied] = useState<string | null>(null);

  const text = useMemo(
    () => (mode === 'match' ? '' : buildText(stickers, mode)),
    [stickers, mode],
  );
  const hasContent = mode !== 'match' && text.split('\n').length > 3;

  const hasItemsAny = useMemo(
    () => Object.values(stickers).some((sec) => sec && Object.keys(sec).length > 0),
    [stickers],
  );

  const link = useMemo(() => buildMatchLink(stickers, name), [stickers, name]);
  const code = useMemo(() => encodeList(stickers, name), [stickers, name]);

  const flash = (key: string) => {
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const copyValue = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    flash(key);
  };

  const shareText = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // cancelado
      }
    }
    copyValue(text, 'copy');
  };

  const shareLink = async () => {
    const msg = `${name || 'Mirá'} quiere intercambiar figus del Mundial. Abrí este link:`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Mis Figus · Match', text: msg, url: link });
        return;
      } catch {
        // cancelado
      }
    }
    copyValue(link, 'link');
  };

  const tabClass = (m: Mode, active: string) =>
    `rounded-pill py-2 text-sm transition ${mode === m ? active : 'text-white/55 hover:text-white'}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md animate-slideUp overflow-y-auto rounded-t-hero bg-navy-raised p-5 shadow-card ring-1 ring-white/10 sm:rounded-hero"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-pill bg-white/20" />

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Compartir mi lista</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-xl leading-none text-white/60 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <div className="mb-3 grid grid-cols-3 gap-1 rounded-pill bg-navy p-1">
          <button type="button" onClick={() => setMode('missing')} className={tabClass('missing', 'bg-ice-cta font-medium text-white shadow-glow-ice')}>
            ○ Faltan
          </button>
          <button type="button" onClick={() => setMode('duplicate')} className={tabClass('duplicate', 'bg-gold-card font-bold text-navy shadow-glow-gold')}>
            ★ Repes
          </button>
          <button type="button" onClick={() => setMode('match')} className={tabClass('match', 'bg-gold-card font-bold text-navy shadow-glow-gold')}>
            🤝 Match
          </button>
        </div>

        {mode !== 'match' ? (
          <>
            <pre className="mb-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-card bg-navy p-3 font-mono text-xs leading-relaxed text-white/85 ring-1 ring-white/10">
{hasContent ? text : `Todavía no marcaste ninguna ${mode === 'missing' ? 'faltante ○' : 'repetida ★'}.`}
            </pre>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copyValue(text, 'copy')}
                disabled={!hasContent}
                className="flex-1 rounded-pill bg-white/8 py-3 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {copied === 'copy' ? '¡Copiado!' : 'Copiar'}
              </button>
              <button
                type="button"
                onClick={shareText}
                disabled={!hasContent}
                className="flex-1 rounded-pill bg-ice-cta py-3 font-semibold text-white shadow-glow-ice transition active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Compartir
              </button>
            </div>
            <p className="mt-3 text-center text-[11px] text-white/45">
              Se abre WhatsApp con tu lista lista para pegar
            </p>
          </>
        ) : !hasItemsAny ? (
          <p className="rounded-card bg-field p-4 text-center text-sm text-white/60 ring-1 ring-white/10">
            Marcá tus repes ★ y faltantes ○ para poder hacer match con un amigo.
          </p>
        ) : (
          <>
            <p className="mb-3 text-sm text-white/70">
              Pasale este link a un amigo. Cuando lo abra, la app <span className="font-semibold text-gold">cruza
              sus figus con las tuyas</span> 🤝
            </p>
            <input
              readOnly
              value={link}
              onFocus={(e) => e.currentTarget.select()}
              className="mb-3 w-full truncate rounded-card bg-navy px-3 py-2.5 font-mono text-xs text-white/70 ring-1 ring-white/10"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => copyValue(link, 'link')}
                className="flex-1 rounded-pill bg-white/8 py-3 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/12"
              >
                {copied === 'link' ? '¡Copiado!' : 'Copiar link'}
              </button>
              <button
                type="button"
                onClick={shareLink}
                className="flex-1 rounded-pill bg-ice-cta py-3 font-semibold text-white shadow-glow-ice transition active:scale-[0.97]"
              >
                Compartir
              </button>
            </div>
            <button
              type="button"
              onClick={() => copyValue(code, 'code')}
              className="mt-2 w-full rounded-pill px-3 py-2 text-xs text-white/45 hover:text-white/70"
            >
              {copied === 'code' ? '¡Código copiado!' : 'o copiar solo el código'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
