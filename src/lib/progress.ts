// Nivel de coleccionista derivado del % global (display puro, sin XP)
export function collectorLevel(pct: number): { label: string; gold: boolean } {
  if (pct >= 100) return { label: 'Leyenda ★', gold: true };
  if (pct >= 75) return { label: 'Maestro', gold: false };
  if (pct >= 50) return { label: 'Experto', gold: false };
  if (pct >= 25) return { label: 'Cazador', gold: false };
  return { label: 'Novato', gold: false };
}
