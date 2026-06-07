import { useTheme } from '@/providers/ThemeProvider'

// Deterministic pseudo-random using sine — stable across every render
function sr(n: number) {
  const x = Math.sin(n + 1) * 10000
  return x - Math.floor(x)
}

const BUBBLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size:     Math.floor(sr(i * 7)  * 110) + 18,   // 18–128 px
  left:     sr(i * 13) * 93 + 2,                  // 2–95 %
  delay:    sr(i * 17) * 24,                       // 0–24 s  (negative = mid-flight on load)
  duration: sr(i * 23) * 15 + 9,                  // 9–24 s
  dx:       (sr(i * 31) - 0.5) * 100,             // drift X pass 1
  dx2:      (sr(i * 37) - 0.5) * 100,             // drift X pass 2
}))

export default function FrutigerAeroBubbles() {
  const { theme } = useTheme()
  if (theme !== 'frutiger-aero') return null

  return (
    <div className="aero-bubbles-container" aria-hidden="true">
      {BUBBLES.map(b => (
        <div
          key={b.id}
          className="aero-bubble"
          style={{
            width:           b.size,
            height:          b.size,
            left:            `${b.left}%`,
            animationDuration:  `${b.duration}s`,
            animationDelay:     `-${b.delay}s`,   // negative = already in flight
            '--bubble-dx':  `${b.dx}px`,
            '--bubble-dx2': `${b.dx2}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
