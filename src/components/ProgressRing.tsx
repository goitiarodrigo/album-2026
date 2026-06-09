type Props = {
  /** progreso 0..1 */
  value: number;
  size?: number;
  stroke?: number;
  /** al 100% el anillo salta a dorado + pulse */
  complete?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export function ProgressRing({
  value,
  size = 60,
  stroke = 5,
  complete = false,
  className = '',
  children,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(1, value));
  const offset = c * (1 - clamped);
  const color = complete ? '#F5C542' : '#00AEEF';

  return (
    <div
      className={`relative inline-flex items-center justify-center ${complete ? 'animate-ringPulse' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 600ms ease-out, stroke 300ms ease-out',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
