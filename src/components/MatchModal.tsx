import { useMemo, useState } from 'react';
import type { StickersMap } from '../hooks/useStickers';
import {
  type DecodeOk,
  ERROR_MESSAGES,
  SECTIONS_BY_CODE,
  albumProgress,
  buildMatchText,
  computeMatch,
  decodePayload,
  groupBySection,
  type MatchEntry,
} from '../lib/match';
import { Avatar } from './Avatar';

type Props = {
  myStickers: StickersMap;
  myName: string;
  incoming: DecodeOk | null;
  onClose: () => void;
};

function ExchangeBlock({
  title,
  emoji,
  tone,
  entries,
  emptyText,
}: {
  title: string;
  emoji: string;
  tone: 'ice' | 'gold';
  entries: MatchEntry[];
  emptyText: string;
}) {
  const groups = groupBySection(entries);
  const ring = tone === 'ice' ? 'ring-ice/40 bg-ice/[0.07]' : 'ring-gold/40 bg-gold/[0.07]';
  const accent = tone === 'ice' ? 'text-ice' : 'text-gold';
  return (
    <div className={`rounded-card p-3 ring-1 ${ring}`}>
      <div className={`mb-2 flex items-center justify-between text-sm font-bold ${accent}`}>
        <span>
          {emoji} {title}
        </span>
        <span className="tabular">{entries.length}</span>
      </div>
      {groups.length === 0 ? (
        <p className="text-xs text-white/45">{emptyText}</p>
      ) : (
        <div className="space-y-1">
          {groups.map((g) => {
            const sec = SECTIONS_BY_CODE[g.code];
            return (
              <div key={g.code} className="flex gap-2 text-xs">
                <span className="shrink-0 font-semibold text-white/80">
                  {sec?.flag} {g.code}
                </span>
                <span className="text-white/65">{g.slots.join(', ')}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MatchModal({ myStickers, myName, incoming, onClose }: Props) {
  const [result, setResult] = useState<DecodeOk | null>(incoming);
  const [paste, setPaste] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<'copy' | 'share' | null>(null);

  const match = useMemo(
    () => (result ? computeMatch(myStickers, result.stickers) : null),
    [myStickers, result],
  );

  const head = useMemo(
    () =>
      result
        ? { mine: albumProgress(myStickers).pct, theirs: albumProgress(result.stickers).pct }
        : null,
    [myStickers, result],
  );

  const matchText = useMemo(
    () =>
      result && match
        ? buildMatchText(
            myName,
            result.name,
            match,
            head ? { minePct: head.mine, theirsPct: head.theirs } : undefined,
          )
        : '',
    [myName, result, match, head],
  );

  const flash = (key: 'copy' | 'share') => {
    setCopied(key);
    setTimeout(() => setCopied(null), 1800);
  };

  const copyValue = async (value: string) => {
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
  };

  const copyMatch = async () => {
    await copyValue(matchText);
    flash('copy');
  };

  const shareMatch = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: matchText });
        flash('share');
        return;
      } catch {
        // cancelado
      }
    }
    await copyValue(matchText);
    flash('copy');
  };

  const tryDecode = () => {
    const r = decodePayload(paste);
    if (r.ok) {
      setResult(r);
      setError(null);
    } else {
      setError(ERROR_MESSAGES[r.error]);
    }
  };

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

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">🤝 Match de figus</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8 text-xl leading-none text-white/60 hover:text-white"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {!result && (
          <div>
            <p className="mb-2 text-sm text-white/70">
              Pegá el <span className="font-semibold text-ice">link</span> o{' '}
              <span className="font-semibold text-ice">código</span> que te pasó un amigo y cruzamos sus
              figus con las tuyas.
            </p>
            <textarea
              value={paste}
              onChange={(e) => {
                setPaste(e.target.value);
                setError(null);
              }}
              placeholder="Pegá acá el link o código…"
              rows={3}
              className="w-full resize-none rounded-card bg-navy p-3 font-mono text-xs text-white/85 ring-1 ring-white/10 focus:shadow-focus-ice focus:outline-none"
            />
            {error && <p className="mt-2 text-xs text-gold">{error}</p>}
            <button
              type="button"
              onClick={tryDecode}
              className="mt-3 w-full rounded-pill bg-ice-cta py-3 font-semibold text-white shadow-glow-ice transition active:scale-[0.97]"
            >
              Cruzar listas
            </button>
          </div>
        )}

        {result && match && (
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Avatar avatar="preset:pelota" size={48} badges="trophy" />
              <div className="min-w-0">
                <p className="truncate text-base font-extrabold text-white">
                  {result.name} quiere intercambiar
                </p>
                <p className="text-xs text-white/60">
                  Le das <span className="font-bold text-ice">{match.summary.iGiveCount}</span> · Te da{' '}
                  <span className="font-bold text-gold">{match.summary.theyGiveCount}</span>
                </p>
              </div>
            </div>

            {result.meta.catalogMismatch && (
              <p className="mb-3 rounded-card bg-white/[0.06] p-2 text-[11px] text-white/55 ring-1 ring-white/10">
                ⚠️ Tu amigo puede tener una versión distinta del álbum; algunas figus podrían no coincidir.
              </p>
            )}

            {head && (
              <div className="mb-3 space-y-2 rounded-card bg-white/[0.05] p-3 ring-1 ring-white/10">
                <div className="text-[11px] uppercase tracking-wide text-white/45">📊 Álbum completado</div>
                {[
                  { label: 'Vos', pct: head.mine, color: 'bg-ice' },
                  { label: result.name, pct: head.theirs, color: 'bg-gold' },
                ].map((row, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-20 shrink-0 truncate text-xs text-white/70">{row.label}</span>
                    <div className="relative h-2 flex-1 overflow-hidden rounded-pill bg-white/10">
                      <div
                        className={`h-full rounded-pill ${row.color} transition-all duration-700 ease-out`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-9 shrink-0 text-right text-xs font-bold tabular text-white">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
            )}

            {match.summary.mutualScore === 0 ? (
              <p className="rounded-card bg-field p-4 text-center text-sm text-white/60 ring-1 ring-white/10">
                No hay match esta vez 🤷 — marcá más repes y faltantes, o probá con otro amigo.
              </p>
            ) : (
              <div className="space-y-2.5">
                <ExchangeBlock
                  title="Vos le das"
                  emoji="📤"
                  tone="gold"
                  entries={match.iGive}
                  emptyText="No tenés repes que él necesite."
                />
                <ExchangeBlock
                  title="Él te da"
                  emoji="📥"
                  tone="ice"
                  entries={match.theyGive}
                  emptyText="No tiene repes que vos necesites."
                />
              </div>
            )}

            {match.summary.mutualScore > 0 && (
              <>
                <p className="mt-4 rounded-card bg-white/[0.04] p-3 text-[12px] leading-relaxed text-white/60 ring-1 ring-white/10">
                  💡 Esto es un punto de partida. <span className="text-white/85">Mandale el resumen por WhatsApp</span> y arreglen ahí — algunas figus valen más, no todo es 1×1.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={copyMatch}
                    className="rounded-pill bg-white/8 py-3 font-medium text-white ring-1 ring-white/15 transition hover:bg-white/12"
                  >
                    {copied === 'copy' ? '¡Copiado!' : '📋 Copiar match'}
                  </button>
                  <button
                    type="button"
                    onClick={shareMatch}
                    className="rounded-pill bg-gold-card py-3 font-bold text-navy shadow-glow-gold transition active:scale-[0.97]"
                  >
                    {copied === 'share' ? '¡Listo!' : '📤 Compartir'}
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full rounded-pill px-3 py-2 text-xs text-white/45 hover:text-white/70"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
