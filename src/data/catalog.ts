export type Section = {
  code: string;
  name: string;
  flag: string;
  group: 'fwc' | 'team';
  total: number;
};

const TEAM_TOTAL = 20;
const FWC_TOTAL = 20;

export const SECTIONS: Section[] = [
  { code: 'FWC-T', name: 'FWC Trofeo', flag: '🏆', group: 'fwc', total: FWC_TOTAL },
  { code: 'FWC-W', name: 'FWC Mundo', flag: '🌎', group: 'fwc', total: FWC_TOTAL },
  { code: 'FWC-L', name: 'FWC Leyendas', flag: '📜', group: 'fwc', total: FWC_TOTAL },

  { code: 'MEX', name: 'México', flag: '🇲🇽', group: 'team', total: TEAM_TOTAL },
  { code: 'RSA', name: 'Sudáfrica', flag: '🇿🇦', group: 'team', total: TEAM_TOTAL },
  { code: 'KOR', name: 'Corea del Sur', flag: '🇰🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'CZE', name: 'República Checa', flag: '🇨🇿', group: 'team', total: TEAM_TOTAL },
  { code: 'CAN', name: 'Canadá', flag: '🇨🇦', group: 'team', total: TEAM_TOTAL },
  { code: 'BIH', name: 'Bosnia y Herzegovina', flag: '🇧🇦', group: 'team', total: TEAM_TOTAL },
  { code: 'QAT', name: 'Catar', flag: '🇶🇦', group: 'team', total: TEAM_TOTAL },
  { code: 'SUI', name: 'Suiza', flag: '🇨🇭', group: 'team', total: TEAM_TOTAL },
  { code: 'BRA', name: 'Brasil', flag: '🇧🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'MAR', name: 'Marruecos', flag: '🇲🇦', group: 'team', total: TEAM_TOTAL },
  { code: 'HAI', name: 'Haití', flag: '🇭🇹', group: 'team', total: TEAM_TOTAL },
  { code: 'SCO', name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', group: 'team', total: TEAM_TOTAL },
  { code: 'USA', name: 'Estados Unidos', flag: '🇺🇸', group: 'team', total: TEAM_TOTAL },
  { code: 'PAR', name: 'Paraguay', flag: '🇵🇾', group: 'team', total: TEAM_TOTAL },
  { code: 'AUS', name: 'Australia', flag: '🇦🇺', group: 'team', total: TEAM_TOTAL },
  { code: 'TUR', name: 'Turquía', flag: '🇹🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'GER', name: 'Alemania', flag: '🇩🇪', group: 'team', total: TEAM_TOTAL },
  { code: 'CUW', name: 'Curazao', flag: '🇨🇼', group: 'team', total: TEAM_TOTAL },
  { code: 'CIV', name: 'Costa de Marfil', flag: '🇨🇮', group: 'team', total: TEAM_TOTAL },
  { code: 'ECU', name: 'Ecuador', flag: '🇪🇨', group: 'team', total: TEAM_TOTAL },
  { code: 'NED', name: 'Países Bajos', flag: '🇳🇱', group: 'team', total: TEAM_TOTAL },
  { code: 'JPN', name: 'Japón', flag: '🇯🇵', group: 'team', total: TEAM_TOTAL },
  { code: 'SWE', name: 'Suecia', flag: '🇸🇪', group: 'team', total: TEAM_TOTAL },
  { code: 'TUN', name: 'Túnez', flag: '🇹🇳', group: 'team', total: TEAM_TOTAL },
  { code: 'BEL', name: 'Bélgica', flag: '🇧🇪', group: 'team', total: TEAM_TOTAL },
  { code: 'EGY', name: 'Egipto', flag: '🇪🇬', group: 'team', total: TEAM_TOTAL },
  { code: 'IRN', name: 'Irán', flag: '🇮🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'NZL', name: 'Nueva Zelanda', flag: '🇳🇿', group: 'team', total: TEAM_TOTAL },
  { code: 'ESP', name: 'España', flag: '🇪🇸', group: 'team', total: TEAM_TOTAL },
  { code: 'CPV', name: 'Cabo Verde', flag: '🇨🇻', group: 'team', total: TEAM_TOTAL },
  { code: 'KSA', name: 'Arabia Saudita', flag: '🇸🇦', group: 'team', total: TEAM_TOTAL },
  { code: 'URU', name: 'Uruguay', flag: '🇺🇾', group: 'team', total: TEAM_TOTAL },
  { code: 'FRA', name: 'Francia', flag: '🇫🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'SEN', name: 'Senegal', flag: '🇸🇳', group: 'team', total: TEAM_TOTAL },
  { code: 'IRQ', name: 'Irak', flag: '🇮🇶', group: 'team', total: TEAM_TOTAL },
  { code: 'NOR', name: 'Noruega', flag: '🇳🇴', group: 'team', total: TEAM_TOTAL },
  { code: 'ARG', name: 'Argentina', flag: '🇦🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'ALG', name: 'Argelia', flag: '🇩🇿', group: 'team', total: TEAM_TOTAL },
  { code: 'AUT', name: 'Austria', flag: '🇦🇹', group: 'team', total: TEAM_TOTAL },
  { code: 'JOR', name: 'Jordania', flag: '🇯🇴', group: 'team', total: TEAM_TOTAL },
  { code: 'POR', name: 'Portugal', flag: '🇵🇹', group: 'team', total: TEAM_TOTAL },
  { code: 'COD', name: 'RD del Congo', flag: '🇨🇩', group: 'team', total: TEAM_TOTAL },
  { code: 'UZB', name: 'Uzbekistán', flag: '🇺🇿', group: 'team', total: TEAM_TOTAL },
  { code: 'COL', name: 'Colombia', flag: '🇨🇴', group: 'team', total: TEAM_TOTAL },
  { code: 'ENG', name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'team', total: TEAM_TOTAL },
  { code: 'CRO', name: 'Croacia', flag: '🇭🇷', group: 'team', total: TEAM_TOTAL },
  { code: 'GHA', name: 'Ghana', flag: '🇬🇭', group: 'team', total: TEAM_TOTAL },
  { code: 'PAN', name: 'Panamá', flag: '🇵🇦', group: 'team', total: TEAM_TOTAL },
];

export const SECTIONS_BY_CODE: Record<string, Section> = Object.fromEntries(
  SECTIONS.map((s) => [s.code, s]),
);
