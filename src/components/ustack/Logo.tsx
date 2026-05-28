export function Logo({ size = 56, glow = false }: { size?: number; glow?: boolean }) {
  return (
    <div className="relative inline-flex" style={{ width: size, height: size }}>
      {glow && (
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-60"
          style={{ background: "var(--grad-coral)" }}
        />
      )}
      <svg viewBox="0 0 64 64" width={size} height={size} className="relative">
        <defs>
          <linearGradient id="ulg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.82 0.18 30)" />
            <stop offset="60%" stopColor="oklch(0.7 0.2 15)" />
            <stop offset="100%" stopColor="oklch(0.78 0.14 195)" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="60" height="60" rx="18" fill="url(#ulg)" />
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
