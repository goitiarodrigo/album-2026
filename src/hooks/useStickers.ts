import { useCallback, useEffect, useState } from 'react';
import { SECTIONS } from '../data/catalog';

export type StickerState = 'missing' | 'duplicate' | 'owned' | null;

export type StickersMap = Record<string, Record<number, Exclude<StickerState, null>>>;

const STORAGE_KEY = 'panini-2026:v1';

// Slots válidos por sección, según el catálogo actual.
const VALID_SLOTS: Record<string, Set<number>> = Object.fromEntries(
  SECTIONS.map((s) => [s.code, new Set(s.slots)]),
);
const VALID_STATES = new Set(['missing', 'duplicate', 'owned']);

// Descarta secciones/slots que ya no existen en el catálogo (p. ej. FWC con la numeración vieja).
function sanitize(map: StickersMap): StickersMap {
  const out: StickersMap = {};
  for (const code of Object.keys(map)) {
    const valid = VALID_SLOTS[code];
    const sec = map[code];
    if (!valid || !sec || typeof sec !== 'object') continue;
    const kept: Record<number, Exclude<StickerState, null>> = {};
    for (const k of Object.keys(sec)) {
      const n = Number(k);
      const v = sec[+k];
      if (valid.has(n) && VALID_STATES.has(v)) kept[n] = v;
    }
    if (Object.keys(kept).length) out[code] = kept;
  }
  return out;
}

function loadFromStorage(): StickersMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? sanitize(parsed as StickersMap) : {};
  } catch {
    return {};
  }
}

function saveToStorage(map: StickersMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore quota errors
  }
}

export function useStickers() {
  const [stickers, setStickers] = useState<StickersMap>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(stickers);
  }, [stickers]);

  const getState = useCallback(
    (code: string, num: number): StickerState => stickers[code]?.[num] ?? null,
    [stickers],
  );

  const setState = useCallback((code: string, num: number, state: StickerState) => {
    setStickers((prev) => {
      const section = { ...(prev[code] ?? {}) };
      if (state === null) {
        delete section[num];
      } else {
        section[num] = state;
      }
      const next = { ...prev };
      if (Object.keys(section).length === 0) {
        delete next[code];
      } else {
        next[code] = section;
      }
      return next;
    });
  }, []);

  const toggleState = useCallback(
    (code: string, num: number, target: Exclude<StickerState, null>) => {
      setStickers((prev) => {
        const section = { ...(prev[code] ?? {}) };
        if (section[num] === target) {
          delete section[num];
        } else {
          section[num] = target;
        }
        const next = { ...prev };
        if (Object.keys(section).length === 0) {
          delete next[code];
        } else {
          next[code] = section;
        }
        return next;
      });
    },
    [],
  );

  const resetAll = useCallback(() => setStickers({}), []);

  const resetSection = useCallback((code: string) => {
    setStickers((prev) => {
      if (!prev[code]) return prev;
      const next = { ...prev };
      delete next[code];
      return next;
    });
  }, []);

  return { stickers, getState, setState, toggleState, resetAll, resetSection };
}
