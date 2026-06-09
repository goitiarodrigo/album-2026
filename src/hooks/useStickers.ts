import { useCallback, useEffect, useState } from 'react';

export type StickerState = 'missing' | 'duplicate' | null;

export type StickersMap = Record<string, Record<number, Exclude<StickerState, null>>>;

const STORAGE_KEY = 'panini-2026:v1';

function loadFromStorage(): StickersMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as StickersMap) : {};
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
