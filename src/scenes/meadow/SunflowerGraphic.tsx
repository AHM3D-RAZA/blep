interface SunflowerGraphicProps {
  className?: string
}

/** The sunflower artwork itself — no positioning, sizing is via the SVG's own width/className. */
export function SunflowerGraphic({ className }: SunflowerGraphicProps) {
  return (
    <svg viewBox="-4 0 48 100" className={className ?? 'sunflower-svg'} aria-hidden="true">
      <line x1="20" y1="40" x2="20" y2="100" stroke="#3f6b2f" strokeWidth="3" />
      <path d="M20 40 Q8 46 10 58" stroke="#3f6b2f" strokeWidth="2.5" fill="none" />
      <g transform="translate(20 26)">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-14" rx="4.5" ry="10" fill="#e6b23f" transform={`rotate(${i * 30})`} />
        ))}
        <circle r="9" fill="#7a4d2c" />
      </g>
    </svg>
  )
}
