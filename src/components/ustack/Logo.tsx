export function Logo({ size = 56, glow: _glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      <svg viewBox="0 0 64 64" width={size} height={size} className="relative">
        <rect x="2" y="2" width="60" height="60" rx="18" fill="oklch(0.74 0.18 25)" />
        <path
          d="M20 18 V36 a12 12 0 0 0 24 0 V18"
          stroke="white"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="32" cy="48" r="3" fill="white" />
      </svg>
    </div>
  );
}
