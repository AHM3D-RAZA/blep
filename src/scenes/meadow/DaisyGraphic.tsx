interface DaisyGraphicProps {
  className?: string
}

/** The daisy artwork itself — no positioning, sizing is via the SVG's own width/className. */
export function DaisyGraphic({ className }: DaisyGraphicProps) {
  return (
    <svg viewBox="0 0 30 70" className={className ?? 'daisy-svg'} aria-hidden="true">
      <line x1="15" y1="26" x2="15" y2="70" stroke="#4a7c3f" strokeWidth="2" />
      <g transform="translate(15 16)">
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={i} cx="0" cy="-8" rx="2.6" ry="7" fill="#f6f1e2" transform={`rotate(${i * 45})`} />
        ))}
        <circle r="4.5" fill="#e6b23f" />
      </g>
    </svg>
  )
}
