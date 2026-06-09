export const PRESET_EMOJI: Record<string, string> = {
  'preset:pelota': '⚽',
  'preset:camiseta': '👕',
  'preset:bandera': '🎌',
  'preset:trofeo': '🏆',
};
export const PRESETS = Object.keys(PRESET_EMOJI);
export const isPreset = (a: string) => a.startsWith('preset:');

type Badges = 'full' | 'trophy' | 'none';

type Props = {
  avatar: string;
  size?: number;
  badges?: Badges;
  className?: string;
};

export function Avatar({ avatar, size = 56, badges = 'full', className = '' }: Props) {
  const showTrophy = badges === 'full' || badges === 'trophy';
  const showFlag = badges === 'full';
  const emoji = PRESET_EMOJI[avatar] ?? '⚽';
  const chip = Math.round(size * 0.42);

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-gold-card p-[2px] shadow-glow-gold ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="h-full w-full overflow-hidden rounded-full bg-navy-raised ring-2 ring-navy-deep">
        {isPreset(avatar) ? (
          <span
            className="flex h-full w-full items-center justify-center bg-field"
            style={{ fontSize: size * 0.5 }}
          >
            {emoji}
          </span>
        ) : (
          <img src={avatar} alt="" className="h-full w-full object-cover" />
        )}
      </div>

      {showFlag && (
        <span
          className="absolute -bottom-0.5 -left-0.5 flex items-center justify-center rounded-full bg-navy-deep shadow-glow-ice ring-1 ring-ice/60"
          style={{ width: chip, height: chip, fontSize: size * 0.24 }}
        >
          🇦🇷
        </span>
      )}
      {showTrophy && (
        <span
          className="absolute -right-0.5 -top-0.5 flex animate-breathe items-center justify-center rounded-full bg-gold-card text-navy shadow-glow-gold ring-1 ring-white/40"
          style={{ width: chip, height: chip, fontSize: size * 0.22 }}
        >
          🏆
        </span>
      )}
    </div>
  );
}
