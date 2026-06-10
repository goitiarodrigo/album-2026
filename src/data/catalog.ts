export type SectionGroup = 'fwc' | 'team' | 'cc';

export type Section = {
  code: string;
  name: string;
  flag: string;
  group: SectionGroup;
  slots: number[];
  total: number;
};

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

const TEAM = range(1, 20);

// FWC: 20 figus 00–19 repartidas en 3 categorías (no 20 c/u). CC: sponsor Coca-Cola CC1–CC14.
const RAW: Omit<Section, 'total'>[] = [
  { code: 'FWC-T', name: 'FWC Trofeo', flag: '🏆', group: 'fwc', slots: [0, 1, 2, 3, 4] },
  { code: 'FWC-W', name: 'FWC Mundo', flag: '🌎', group: 'fwc', slots: [5, 6, 7, 8] },
  { code: 'FWC-L', name: 'FWC Leyendas', flag: '📜', group: 'fwc', slots: range(9, 19) },
  { code: 'CC', name: 'Coca-Cola', flag: '🥤', group: 'cc', slots: range(1, 14) },

  { code: 'MEX', name: 'México', flag: '🇲🇽', group: 'team', slots: TEAM },
  { code: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', group: 'team', slots: TEAM },
  { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', group: 'team', slots: TEAM },
  { code: 'CZE', name: 'República Checa', flag: '🇨🇿', group: 'team', slots: TEAM },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦', group: 'team', slots: TEAM },
  { code: 'BIH', name: 'Bosnia y Herzegovina', flag: '🇧🇦', group: 'team', slots: TEAM },
  { code: 'QAT', name: 'Catar', flag: '🇶🇦', group: 'team', slots: TEAM },
  { code: 'SUI', name: 'Suiza', flag: '🇨🇭', group: 'team', slots: TEAM },
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', group: 'team', slots: TEAM },
  { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', group: 'team', slots: TEAM },
  { code: 'HAI', name: 'Haití', flag: '🇭🇹', group: 'team', slots: TEAM },
  { code: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'team', slots: TEAM },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', group: 'team', slots: TEAM },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'team', slots: TEAM },
  { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'team', slots: TEAM },
  { code: 'TUR', name: 'Turquía', flag: '🇹🇷', group: 'team', slots: TEAM },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪', group: 'team', slots: TEAM },
  { code: 'CUW', name: 'Curazao', flag: '🇨🇼', group: 'team', slots: TEAM },
  { code: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮', group: 'team', slots: TEAM },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'team', slots: TEAM },
  { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', group: 'team', slots: TEAM },
  { code: 'JPN', name: 'Japón', flag: '🇯🇵', group: 'team', slots: TEAM },
  { code: 'SWE', name: 'Suecia', flag: '🇸🇪', group: 'team', slots: TEAM },
  { code: 'TUN', name: 'Túnez', flag: '🇹🇳', group: 'team', slots: TEAM },
  { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', group: 'team', slots: TEAM },
  { code: 'EGY', name: 'Egipto', flag: '🇪🇬', group: 'team', slots: TEAM },
  { code: 'IRN', name: 'Irán', flag: '🇮🇷', group: 'team', slots: TEAM },
  { code: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'team', slots: TEAM },
  { code: 'ESP', name: 'España', flag: '🇪🇸', group: 'team', slots: TEAM },
  { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', group: 'team', slots: TEAM },
  { code: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦', group: 'team', slots: TEAM },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'team', slots: TEAM },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷', group: 'team', slots: TEAM },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'team', slots: TEAM },
  { code: 'IRQ', name: 'Irak', flag: '🇮🇶', group: 'team', slots: TEAM },
  { code: 'NOR', name: 'Noruega', flag: '🇳🇴', group: 'team', slots: TEAM },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'team', slots: TEAM },
  { code: 'ALG', name: 'Argelia', flag: '🇩🇿', group: 'team', slots: TEAM },
  { code: 'AUT', name: 'Austria', flag: '🇦🇹', group: 'team', slots: TEAM },
  { code: 'JOR', name: 'Jordania', flag: '🇯🇴', group: 'team', slots: TEAM },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'team', slots: TEAM },
  { code: 'COD', name: 'RD del Congo', flag: '🇨🇩', group: 'team', slots: TEAM },
  { code: 'UZB', name: 'Uzbekistán', flag: '🇺🇿', group: 'team', slots: TEAM },
  { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'team', slots: TEAM },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'team', slots: TEAM },
  { code: 'CRO', name: 'Croacia', flag: '🇭🇷', group: 'team', slots: TEAM },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'team', slots: TEAM },
  { code: 'PAN', name: 'Panamá', flag: '🇵🇦', group: 'team', slots: TEAM },
];

export const SECTIONS: Section[] = RAW.map((s) => ({ ...s, total: s.slots.length }));

export const SECTIONS_BY_CODE: Record<string, Section> = Object.fromEntries(
  SECTIONS.map((s) => [s.code, s]),
);

// Etiqueta visible de una figu: FWC usa "00".."19", Coca-Cola "CC1".."CC14", equipos "1".."20".
export function slotLabel(section: Section, n: number): string {
  if (section.group === 'cc') return `CC${n}`;
  if (n === 0) return '00';
  return String(n);
}
