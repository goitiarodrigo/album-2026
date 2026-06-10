import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SECTIONS, type Section } from './data/catalog';
import { useStickers } from './hooks/useStickers';
import { useProfile } from './hooks/useProfile';
import { SectionBlock } from './components/SectionBlock';
import { ShareModal } from './components/ShareModal';
import { ProgressHeader } from './components/ProgressHeader';
import { Confetti } from './components/Confetti';
import { ToastStack, useToasts } from './components/Toasts';
import { ProfileModal } from './components/ProfileModal';
import { Onboarding } from './components/Onboarding';
import { WhatsNew } from './components/WhatsNew';
import { MatchModal } from './components/MatchModal';
import { type DecodeOk, ERROR_MESSAGES, decodePayload } from './lib/match';

const ONBOARD_KEY = 'panini-2026:onboarded';
const WHATS_NEW_KEY = 'panini-2026:whats-new:v2';

const TOTAL_SLOTS = SECTIONS.reduce((acc, s) => acc + s.total, 0);
const MILESTONES = [25, 50, 75, 100];

function App() {
  const { stickers, toggleState, resetSection, resetAll } = useStickers();
  const { profile, update, hasProfile } = useProfile();
  const { toasts, push } = useToasts();
  const [shareOpen, setShareOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [matchOpen, setMatchOpen] = useState(false);
  const [matchIncoming, setMatchIncoming] = useState<DecodeOk | null>(null);
  const [onboarded, setOnboarded] = useState(() => {
    try {
      return localStorage.getItem(ONBOARD_KEY) === '1';
    } catch {
      return true;
    }
  });
  const [replayOnboarding, setReplayOnboarding] = useState(false);
  const [whatsNewSeen, setWhatsNewSeen] = useState(() => {
    try {
      return localStorage.getItem(WHATS_NEW_KEY) === '1';
    } catch {
      return true;
    }
  });
  const [query, setQuery] = useState('');
  const [albumConfetti, setAlbumConfetti] = useState(0);
  const prevPct = useRef(0);
  const hashHandled = useRef(false);

  // Leer un link de match (#m=...) al cargar. StrictMode-safe via ref guard.
  useEffect(() => {
    if (hashHandled.current) return;
    hashHandled.current = true;
    const raw = window.location.hash;
    const m = /^#m=(.+)$/.exec(raw);
    if (!m) return;
    // limpiar el hash ANTES de procesar (evita re-abrir al recargar / re-compartir)
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    const r = decodePayload(m[1]);
    if (r.ok) {
      setMatchIncoming(r);
      setMatchOpen(true);
    } else {
      push(ERROR_MESSAGES[r.error]);
    }
  }, [push]);

  const finishOnboarding = useCallback(() => {
    try {
      localStorage.setItem(ONBOARD_KEY, '1');
      // Quien recién hace el onboarding ya vio todo: no le mostramos también el "novedades".
      localStorage.setItem(WHATS_NEW_KEY, '1');
    } catch {
      // ignore
    }
    setOnboarded(true);
    setReplayOnboarding(false);
    setWhatsNewSeen(true);
  }, []);

  const closeWhatsNew = useCallback(() => {
    try {
      localStorage.setItem(WHATS_NEW_KEY, '1');
    } catch {
      // ignore
    }
    setWhatsNewSeen(true);
  }, []);

  const { missing, duplicate, owned, completas } = useMemo(() => {
    let missing = 0;
    let duplicate = 0;
    let owned = 0;
    let completas = 0;
    for (const section of SECTIONS) {
      const data = stickers[section.code];
      if (!data) continue;
      let have = 0;
      for (const k of Object.keys(data)) {
        const v = data[+k];
        if (v === 'missing') missing++;
        else if (v === 'duplicate') {
          duplicate++;
          have++;
        } else if (v === 'owned') {
          owned++;
          have++;
        }
      }
      if (have === section.total) completas++;
    }
    return { missing, duplicate, owned, completas };
  }, [stickers]);

  // El álbum avanza solo con figus que TENÉS (pegadas o repes). Las faltantes no suman.
  const have = owned + duplicate;
  const anyMarked = have + missing > 0;
  const pct = Math.round((have / TOTAL_SLOTS) * 100);

  // milestones globales + confetti de album lleno
  useEffect(() => {
    const prev = prevPct.current;
    if (pct > prev) {
      for (const m of MILESTONES) {
        if (prev < m && pct >= m) {
          if (m === 100) {
            push('🏆 ¡Álbum completo, LEYENDA!');
            setAlbumConfetti((k) => k + 1);
            window.setTimeout(() => setAlbumConfetti(0), 2500);
          } else {
            push(`¡${m}% del álbum! 🎉`);
          }
        }
      }
    }
    prevPct.current = pct;
  }, [pct, push]);

  const onComplete = useCallback(
    (section: Section) => push(`★ ¡${section.code} completa!`),
    [push],
  );

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) => s.code.toLowerCase().includes(q) || s.name.toLowerCase().includes(q),
    );
  }, [query]);

  const fwc = filteredSections.filter((s) => s.group === 'fwc');
  const cc = filteredSections.filter((s) => s.group === 'cc');
  const teams = filteredSections.filter((s) => s.group === 'team');
  const hasItems = anyMarked;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-4 pb-28">
      <ProgressHeader
        marked={have}
        total={TOTAL_SLOTS}
        profile={profile}
        hasProfile={hasProfile}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <div className="mt-4 rounded-card bg-white/[0.06] ring-1 ring-white/10 focus-within:shadow-focus-ice">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar selección (ARG, Brasil, FWC...)"
          className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="rounded-card bg-white/[0.08] p-3 ring-1 ring-white/20">
          <div className="text-base leading-none text-white/80">✓</div>
          <div className="mt-1 text-3xl font-extrabold leading-none tabular text-white">{have}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wide text-white/55">Tengo</div>
        </div>
        <div className="rounded-card bg-ice/[0.12] p-3 shadow-glow-ice ring-1 ring-ice/35">
          <div className="text-base leading-none text-ice">○</div>
          <div className="mt-1 text-3xl font-extrabold leading-none tabular text-ice">{missing}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wide text-white/55">Faltan</div>
        </div>
        <div className="rounded-card bg-gold/[0.14] p-3 shadow-glow-gold ring-1 ring-gold/45">
          <div className="text-base leading-none text-gold">★</div>
          <div className="mt-1 text-3xl font-extrabold leading-none tabular text-gold">{duplicate}</div>
          <div className="mt-1 text-[11px] uppercase tracking-wide text-white/55">Repes</div>
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between rounded-card bg-white/[0.06] px-4 py-2 ring-1 ring-white/10">
        <span className="text-sm text-white/70">Selecciones completas</span>
        <span className="font-bold text-gold tabular">{completas}/{SECTIONS.length} ★</span>
      </div>

      {fwc.length > 0 && (
        <div className="mt-5 space-y-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-white/45">FWC</h2>
          {fwc.map((section) => (
            <SectionBlock
              key={section.code}
              section={section}
              sectionData={stickers[section.code]}
              onToggle={(num, target) => toggleState(section.code, num, target)}
              onReset={() => resetSection(section.code)}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}

      {cc.length > 0 && (
        <div className="mt-4 space-y-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-coke/80">
            🥤 Coca-Cola
          </h2>
          {cc.map((section) => (
            <SectionBlock
              key={section.code}
              section={section}
              sectionData={stickers[section.code]}
              onToggle={(num, target) => toggleState(section.code, num, target)}
              onReset={() => resetSection(section.code)}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}

      {teams.length > 0 && (
        <div className="mt-4 space-y-2">
          <h2 className="px-1 text-xs font-semibold uppercase tracking-wider text-white/45">
            Selecciones ({teams.length})
          </h2>
          {teams.map((section) => (
            <SectionBlock
              key={section.code}
              section={section}
              sectionData={stickers[section.code]}
              onToggle={(num, target) => toggleState(section.code, num, target)}
              onReset={() => resetSection(section.code)}
              onComplete={onComplete}
            />
          ))}
        </div>
      )}

      {filteredSections.length === 0 && (
        <p className="py-12 text-center text-white/45">Sin resultados para "{query}"</p>
      )}

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => {
            if (confirm('¿Borrar todas las marcas?')) resetAll();
          }}
          className="text-xs text-white/40 hover:text-white/70"
        >
          Borrar todo
        </button>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-navy-deep via-navy-deep/95 to-transparent pb-4 pt-6">
        <div className="mx-auto flex max-w-md gap-2 px-4">
          <button
            type="button"
            onClick={() => {
              setMatchIncoming(null);
              setMatchOpen(true);
            }}
            className="flex shrink-0 items-center gap-1.5 rounded-pill bg-white/10 px-4 py-4 text-sm font-semibold text-white ring-1 ring-white/15 transition active:scale-[0.97]"
          >
            🤝 Match
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            disabled={!hasItems}
            className={`relative flex-1 overflow-hidden rounded-pill py-4 text-base font-semibold transition active:scale-[0.97] ${
              hasItems
                ? 'animate-breathe bg-ice-cta text-white shadow-glow-ice'
                : 'cursor-not-allowed bg-white/10 text-white/50'
            }`}
          >
            {hasItems && (
              <span className="pointer-events-none absolute inset-0 animate-shimmer bg-shimmer bg-[length:200%_100%]" />
            )}
            <span className="relative">
              Compartir mi lista{hasItems && <span className="ml-2 opacity-90">▸</span>}
            </span>
          </button>
        </div>
      </div>

      {shareOpen && (
        <ShareModal stickers={stickers} name={profile.name} onClose={() => setShareOpen(false)} />
      )}

      {matchOpen && (
        <MatchModal
          myStickers={stickers}
          myName={profile.name}
          incoming={matchIncoming}
          onClose={() => setMatchOpen(false)}
        />
      )}

      {profileOpen && (
        <ProfileModal
          profile={profile}
          update={update}
          push={push}
          onClose={() => setProfileOpen(false)}
          onReplayOnboarding={() => {
            setProfileOpen(false);
            setReplayOnboarding(true);
          }}
        />
      )}

      {(!onboarded || replayOnboarding) && (
        <Onboarding profile={profile} update={update} push={push} onFinish={finishOnboarding} />
      )}

      {onboarded && !replayOnboarding && !whatsNewSeen && <WhatsNew onClose={closeWhatsNew} />}

      <ToastStack toasts={toasts} />
      {albumConfetti > 0 && (
        <div className="pointer-events-none fixed inset-0 z-[55]">
          <Confetti key={albumConfetti} seed={albumConfetti} pieces={44} />
        </div>
      )}
    </div>
  );
}

export default App;
