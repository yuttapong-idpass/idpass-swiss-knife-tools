import { useTheme } from '@/providers/ThemeProvider'

// ── Static data (deterministic — stable across every render) ─────────────────

interface FishConfig {
  id: number; body: string; fin: string; stripe?: string
  y: number; w: number; dur: number; del: number; dir: 1 | -1; wig: number
}

const FISH: FishConfig[] = [
  { id: 0, body: '#ff5a1f', fin: '#cc2200', stripe: '#ffffff', y: 18, w: 82,  dur: 16, del: 0,  dir:  1, wig: 0.70 },
  { id: 1, body: '#1e7fff', fin: '#0040c0', stripe: '#ffee00', y: 38, w: 58,  dur: 23, del: 6,  dir: -1, wig: 0.90 },
  { id: 2, body: '#00c88c', fin: '#007850',                    y: 60, w: 104, dur: 19, del: 11, dir:  1, wig: 1.10 },
  { id: 3, body: '#c030e0', fin: '#7010a8', stripe: '#f0b0ff', y: 26, w: 46,  dur: 28, del: 3,  dir: -1, wig: 0.80 },
  { id: 4, body: '#f8c000', fin: '#c07000',                    y: 70, w: 70,  dur: 21, del: 14, dir:  1, wig: 1.00 },
  { id: 5, body: '#ff3882', fin: '#bb0050', stripe: '#ffffff', y: 46, w: 50,  dur: 26, del: 8,  dir:  1, wig: 0.85 },
  { id: 6, body: '#18d8e8', fin: '#0898b0',                    y: 14, w: 40,  dur: 32, del: 19, dir: -1, wig: 0.65 },
  { id: 7, body: '#e05010', fin: '#902800', stripe: '#fff8',   y: 54, w: 64,  dur: 22, del: 21, dir: -1, wig: 0.90 },
]

const SEAWEEDS = [
  { id: 0, x: 4,  h: 100, shade: '#1a8040', dur: 3.8 },
  { id: 1, x: 14, h: 76,  shade: '#25a050', dur: 4.5 },
  { id: 2, x: 30, h: 116, shade: '#158035', dur: 3.2 },
  { id: 3, x: 54, h: 88,  shade: '#1a8040', dur: 4.1 },
  { id: 4, x: 70, h: 128, shade: '#25a050', dur: 3.6 },
  { id: 5, x: 84, h: 74,  shade: '#1a7038', dur: 4.8 },
  { id: 6, x: 93, h: 100, shade: '#158035', dur: 3.4 },
]

// Deterministic pseudo-random using sine
function sr(n: number) { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x) }

const BUBBLES = Array.from({ length: 26 }, (_, i) => ({
  id:   i,
  size: sr(i * 5)  * 16 + 4,       // 4–20 px
  x:    sr(i * 11) * 86 + 7,        // 7–93 %
  dur:  sr(i * 19) * 8  + 6,        // 6–14 s
  del:  sr(i * 29) * 20,            // 0–20 s  (negative delay → mid-flight on load)
  bx:   (sr(i * 37) - 0.5) * 30,
  bx2:  (sr(i * 43) - 0.5) * 30,
}))

// ── Sub-components ────────────────────────────────────────────────────────────

function FishSvg({ body, fin, stripe }: { body: string; fin: string; stripe?: string }) {
  return (
    <svg viewBox="0 0 70 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tail fan */}
      <path d="M 13 18 L 1 4 L 1 32 Z" fill={fin} />
      {/* Body */}
      <ellipse cx="36" cy="18" rx="24" ry="14" fill={body} />
      {/* Dorsal fin */}
      <path d="M 23 5 Q 37 0 50 6 L 48 9 Q 36 4 23 8 Z" fill={fin} opacity="0.9" />
      {/* Pectoral fin */}
      <path d="M 30 26 Q 24 33 30 32 Q 34 29 30 26 Z" fill={fin} opacity="0.75" />
      {/* Body stripe */}
      {stripe && (
        <path d="M 35 5 Q 33 18 35 31" stroke={stripe} strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />
      )}
      {/* Body highlight sheen */}
      <ellipse cx="32" cy="13" rx="11" ry="5.5" fill="white" opacity="0.18" transform="rotate(-8, 32, 13)" />
      {/* Eye */}
      <circle cx="52" cy="14" r="4"   fill="white" />
      <circle cx="53" cy="14" r="2.2" fill="#0a1a2e" />
      <circle cx="53.8" cy="13" r="0.9" fill="white" />
    </svg>
  )
}

function SeaweedSvg({ shade }: { shade: string }) {
  return (
    <svg viewBox="0 0 22 100" width="22" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 11 100 Q 17 80 11 60 Q 5 40 11 20 Q 17 5 11 0"
        stroke={shade} strokeWidth="3.5" strokeLinecap="round"
      />
      <path d="M 11 65 Q 2 55 5 45 Q 8 55 11 60"  fill={shade} opacity="0.85" />
      <path d="M 11 40 Q 20 30 18 20 Q 15 30 11 36" fill={shade} opacity="0.85" />
    </svg>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FrutigerAeroAquarium() {
  const { theme } = useTheme()
  if (theme !== 'frutiger-aero') return null

  return (
    <div className="aero-aquarium-container" aria-hidden="true">

      {/* Caustic water-light shimmer */}
      <div className="aero-aquarium-caustics" />

      {/* Seaweed along the bottom */}
      {SEAWEEDS.map(s => (
        <div
          key={s.id}
          className="aero-seaweed"
          style={{
            left:              `${s.x}%`,
            width:             22,
            height:            s.h,
            animationDuration: `${s.dur}s`,
            animationDelay:    `${s.id * 0.6}s`,
          }}
        >
          <SeaweedSvg shade={s.shade} />
        </div>
      ))}

      {/* Air bubbles rising from the bottom */}
      {BUBBLES.map(b => (
        <div
          key={b.id}
          className="aero-aqua-bubble"
          style={{
            width:              b.size,
            height:             b.size,
            left:               `${b.x}%`,
            bottom:             -30,
            animationDuration:  `${b.dur}s`,
            animationDelay:     `-${b.del}s`,
            '--bx':  `${b.bx}px`,
            '--bx2': `${b.bx2}px`,
          } as React.CSSProperties}
        />
      ))}

      {/* Fish swimming at various depths */}
      {FISH.map(f => (
        <div
          key={f.id}
          className="aero-fish-wrapper"
          style={{
            top:                    `${f.y}%`,
            width:                  f.w,
            animationName:          f.dir === 1 ? 'fish-swim-right' : 'fish-swim-left',
            animationDuration:      `${f.dur}s`,
            animationDelay:         `-${f.del}s`,
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
          }}
        >
          <div
            className="aero-fish-inner"
            style={{ animationDuration: `${f.wig}s` }}
          >
            <FishSvg body={f.body} fin={f.fin} stripe={f.stripe} />
          </div>
        </div>
      ))}

    </div>
  )
}
