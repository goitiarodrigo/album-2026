// Módulo de match offline-first: codifica la lista del usuario en un payload base64url
// que viaja en el hash de un link (#m=...). El receptor lo decodifica y cruza con su
// propia lista. 100% frontend, los datos nunca salen del dispositivo por la red.
import { SECTIONS, SECTIONS_BY_CODE } from '../data/catalog';
import type { StickersMap } from '../hooks/useStickers';

const SLOTS_PER_SECTION = 20;
const TOTAL_SLOTS = SECTIONS.length * SLOTS_PER_SECTION; // 51*20 = 1020
const BITSET_BYTES = Math.ceil((TOTAL_SLOTS * 2) / 8); // 255
const PAYLOAD_VERSION = 1;
const MAX_NAME_BYTES = 40;
const MAX_INPUT_CHARS = 1000;

function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
const CATALOG_FP = fnv1a(SECTIONS.map((s) => `${s.code}:${s.total}`).join('|')) & 0xff;

export type MatchEntry = { code: string; slot: number };
export type ErrorCode =
  | 'EMPTY'
  | 'TOO_LONG'
  | 'BAD_CHARS'
  | 'CORRUPT'
  | 'TOO_SHORT'
  | 'NEWER_VERSION'
  | 'UNKNOWN_VERSION'
  | 'BAD_NAME_LEN'
  | 'BAD_LENGTH';
export type DecodeOk = {
  ok: true;
  name: string;
  stickers: StickersMap;
  meta: { version: number; catalogMismatch: boolean; reservedBits: number };
};
export type DecodeErr = { ok: false; error: ErrorCode };

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  EMPTY: 'Pegá un link o código primero.',
  TOO_LONG: 'Eso es demasiado largo para ser un código válido.',
  BAD_CHARS: 'El código tiene caracteres inválidos.',
  CORRUPT: 'No pude leer el código, puede estar incompleto.',
  TOO_SHORT: 'El código está incompleto.',
  NEWER_VERSION: 'Este código es de una versión más nueva de la app. Actualizá para abrirlo.',
  UNKNOWN_VERSION: 'No reconozco el formato de este código.',
  BAD_NAME_LEN: 'El código parece manipulado o dañado.',
  BAD_LENGTH: 'El código está incompleto o dañado.',
};

// --- base64url ---
function bytesToB64url(b: Uint8Array): string {
  let s = '';
  for (const x of b) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlToBytes(str: string): Uint8Array {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s); // puede lanzar
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// cap a 40 bytes UTF-8 sin partir code points (Array.from respeta surrogate pairs)
function capNameBytes(raw: string): Uint8Array {
  const enc = new TextEncoder();
  const cps = Array.from((raw ?? '').trim());
  let bytes = enc.encode(cps.join(''));
  while (bytes.length > MAX_NAME_BYTES) {
    cps.pop();
    bytes = enc.encode(cps.join(''));
  }
  return bytes;
}

// Quita chars peligrosos/invisibles del nombre untrusted (defensa extra; React ya escapa).
// Filtra por code point para no depender de literales invisibles en el fuente:
// C0/C1 + DEL, zero-width (200B-200F), bidi overrides (202A-202E), isolates (2066-2069), BOM (FEFF).
function isUnsafeCp(c: number): boolean {
  return (
    c <= 0x1f ||
    (c >= 0x7f && c <= 0x9f) ||
    (c >= 0x200b && c <= 0x200f) ||
    (c >= 0x202a && c <= 0x202e) ||
    (c >= 0x2066 && c <= 0x2069) ||
    c === 0xfeff
  );
}
function sanitizeName(s: string): string {
  let out = '';
  for (const ch of s) {
    if (!isUnsafeCp(ch.codePointAt(0)!)) out += ch;
  }
  const cleaned = out.replace(/\s+/g, ' ').trim().slice(0, 40);
  return cleaned || 'Tu amigo';
}

// === ENCODE ===
export function encodeList(stickers: StickersMap, rawName: string): string {
  const nameBytes = capNameBytes(rawName);
  const buf = new Uint8Array(3 + nameBytes.length + BITSET_BYTES);
  buf[0] = PAYLOAD_VERSION;
  buf[1] = CATALOG_FP;
  buf[2] = nameBytes.length;
  buf.set(nameBytes, 3);
  const off = 3 + nameBytes.length;
  for (let sIdx = 0; sIdx < SECTIONS.length; sIdx++) {
    const sec = stickers[SECTIONS[sIdx].code];
    if (!sec) continue;
    for (let slot = 1; slot <= SLOTS_PER_SECTION; slot++) {
      const st = sec[slot];
      const code = st === 'missing' ? 0b01 : st === 'duplicate' ? 0b10 : st === 'owned' ? 0b11 : 0b00;
      if (code === 0) continue;
      const g = sIdx * SLOTS_PER_SECTION + (slot - 1);
      buf[off + (g >> 2)] |= code << ((g & 3) * 2);
    }
  }
  return bytesToB64url(buf);
}

// extrae el código b64url de: código pelado, '#m=...', 'm=...' o una URL completa.
// Prioriza el anchor '#m=' para no romper con URLs que tengan ?from=x en la query.
export function extractCode(input: string): string {
  let s = (input ?? '').trim();
  const hashAt = s.indexOf('#m=');
  if (hashAt >= 0) s = s.slice(hashAt + 3);
  else if (s.startsWith('m=')) s = s.slice(2);
  return s.replace(/\s+/g, '');
}

// === DECODE === (nunca lanza hacia afuera)
export function decodePayload(input: string): DecodeOk | DecodeErr {
  try {
    if ((input ?? '').length > MAX_INPUT_CHARS) return { ok: false, error: 'TOO_LONG' };
    const s = extractCode(input);
    if (!s) return { ok: false, error: 'EMPTY' };
    if (s.length > MAX_INPUT_CHARS) return { ok: false, error: 'TOO_LONG' };
    if (/[^A-Za-z0-9\-_]/.test(s)) return { ok: false, error: 'BAD_CHARS' };

    let bytes: Uint8Array;
    try {
      bytes = b64urlToBytes(s);
    } catch {
      return { ok: false, error: 'CORRUPT' };
    }
    if (bytes.length < 3) return { ok: false, error: 'TOO_SHORT' };

    const version = bytes[0];
    if (version > PAYLOAD_VERSION) return { ok: false, error: 'NEWER_VERSION' };
    if (version < 1) return { ok: false, error: 'UNKNOWN_VERSION' };

    const fp = bytes[1];
    const nameLen = bytes[2];
    if (nameLen > MAX_NAME_BYTES) return { ok: false, error: 'BAD_NAME_LEN' };
    const expected = 3 + nameLen + BITSET_BYTES;
    if (bytes.length !== expected) return { ok: false, error: 'BAD_LENGTH' };

    const rawName = new TextDecoder('utf-8', { fatal: false }).decode(bytes.slice(3, 3 + nameLen));
    const name = sanitizeName(rawName);

    const off = 3 + nameLen;
    const stickers: StickersMap = {};
    for (let sIdx = 0; sIdx < SECTIONS.length; sIdx++) {
      const code = SECTIONS[sIdx].code;
      for (let slot = 1; slot <= SLOTS_PER_SECTION; slot++) {
        const g = sIdx * SLOTS_PER_SECTION + (slot - 1);
        const c = (bytes[off + (g >> 2)] >> ((g & 3) * 2)) & 0b11;
        if (c === 0b00) continue;
        (stickers[code] ??= {})[slot] =
          c === 0b01 ? 'missing' : c === 0b10 ? 'duplicate' : 'owned';
      }
    }
    return { ok: true, name, stickers, meta: { version, catalogMismatch: fp !== CATALOG_FP, reservedBits: 0 } };
  } catch {
    return { ok: false, error: 'CORRUPT' };
  }
}

// === MATCH === (read-only, orden de catálogo garantizado)
export type MatchResult = {
  iGive: MatchEntry[];
  theyGive: MatchEntry[];
  summary: {
    iGiveCount: number;
    theyGiveCount: number;
    iGiveSections: number;
    theyGiveSections: number;
    mutualScore: number;
  };
};
export function computeMatch(mine: StickersMap, theirs: StickersMap): MatchResult {
  const iGive: MatchEntry[] = [];
  const theyGive: MatchEntry[] = [];
  for (let sIdx = 0; sIdx < SECTIONS.length; sIdx++) {
    const code = SECTIONS[sIdx].code;
    const m = mine[code];
    const t = theirs[code];
    if (!m && !t) continue;
    for (let slot = 1; slot <= SLOTS_PER_SECTION; slot++) {
      const ms = m?.[slot];
      const ts = t?.[slot];
      if (ms === 'duplicate' && ts === 'missing') iGive.push({ code, slot }); // yo le doy
      if (ms === 'missing' && ts === 'duplicate') theyGive.push({ code, slot }); // él me da
    }
  }
  const iGiveSections = new Set(iGive.map((e) => e.code)).size;
  const theyGiveSections = new Set(theyGive.map((e) => e.code)).size;
  return {
    iGive,
    theyGive,
    summary: {
      iGiveCount: iGive.length,
      theyGiveCount: theyGive.length,
      iGiveSections,
      theyGiveSections,
      mutualScore: iGive.length + theyGive.length,
    },
  };
}

// Progreso real del álbum: una figu cuenta como "la tengo" si está pegada (owned)
// o repetida (duplicate). Las faltantes y las no tocadas no suman.
export function albumProgress(stickers: StickersMap): { have: number; total: number; pct: number } {
  let have = 0;
  for (const sec of Object.values(stickers)) {
    if (!sec) continue;
    for (const v of Object.values(sec)) {
      if (v === 'owned' || v === 'duplicate') have++;
    }
  }
  const total = TOTAL_SLOTS;
  return { have, total, pct: total ? Math.round((have / total) * 100) : 0 };
}

// agrupa entries por sección (en orden de catálogo) para la UI
export function groupBySection(entries: MatchEntry[]): { code: string; slots: number[] }[] {
  const map = new Map<string, number[]>();
  for (const e of entries) {
    const arr = map.get(e.code) ?? [];
    arr.push(e.slot);
    map.set(e.code, arr);
  }
  return [...map.entries()].map(([code, slots]) => ({ code, slots: slots.sort((a, b) => a - b) }));
}

// Texto compacto del match para pegar en WhatsApp y negociar el intercambio.
export function buildMatchText(
  myName: string,
  theirName: string,
  match: MatchResult,
  head?: { minePct: number; theirsPct: number },
): string {
  const me = (myName ?? '').trim() || 'Yo';
  const them = (theirName ?? '').trim() || 'Vos';
  const lines: string[] = ['🤝 Match · Mundial 2026', `${me} ↔ ${them}`, ''];
  if (head) {
    lines.push(`📊 Álbum: ${me} ${head.minePct}% · ${them} ${head.theirsPct}%`, '');
  }
  if (match.iGive.length > 0) {
    lines.push(`📤 Te doy (${match.iGive.length}):`);
    for (const g of groupBySection(match.iGive)) {
      const sec = SECTIONS_BY_CODE[g.code];
      lines.push(`${g.code} ${sec?.flag ?? ''}: ${g.slots.join(', ')}`.trim());
    }
    lines.push('');
  }
  if (match.theyGive.length > 0) {
    lines.push(`📥 Me das (${match.theyGive.length}):`);
    for (const g of groupBySection(match.theyGive)) {
      const sec = SECTIONS_BY_CODE[g.code];
      lines.push(`${g.code} ${sec?.flag ?? ''}: ${g.slots.join(', ')}`.trim());
    }
    lines.push('');
  }
  lines.push('¿Cómo lo arreglamos? Algunas valen más que otras 😉');
  return lines.join('\n');
}

export function buildMatchLink(stickers: StickersMap, name: string): string {
  return `${location.origin}${location.pathname}#m=${encodeList(stickers, name)}`;
}

export { SECTIONS_BY_CODE };
