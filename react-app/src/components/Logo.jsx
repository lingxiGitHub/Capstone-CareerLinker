export function LogoMark({ size = 34 }) {
  return (
    <svg viewBox="0 0 34 34" width={size} height={size} aria-hidden="true" style={{ flexShrink: 0 }}>
      <rect width="34" height="34" rx="4" fill="var(--brand)" />
      <text
        x="17"
        y="24"
        fill="#fff"
        textAnchor="middle"
        fontFamily="Helvetica, Arial, sans-serif"
        fontWeight="700"
        fontSize="17"
        letterSpacing="-0.5"
      >
        CL
      </text>
    </svg>
  );
}

export function Wordmark({ height = 34 }) {
  return (
    <span
      style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--brand)", fontWeight: 700, fontSize: height * 0.7, letterSpacing: "-0.03em", lineHeight: 1 }}
      aria-label="CareerLinker"
    >
      <LogoMark size={height} />
      CareerLinker
    </span>
  );
}
