import { useTheme } from '@/providers/ThemeProvider'

function sr(n: number) { const x = Math.sin(n + 1) * 10000; return x - Math.floor(x) }

const SEAWEEDS = [
  { id: 0, x: 4,  h: 110, shade: '#158870', dur: 3.8 },
  { id: 1, x: 13, h: 80,  shade: '#1a9878', dur: 4.5 },
  { id: 2, x: 24, h: 125, shade: '#107068', dur: 3.2 },
  { id: 3, x: 38, h: 90,  shade: '#20a888', dur: 4.9 },
  { id: 4, x: 52, h: 72,  shade: '#158870', dur: 3.5 },
  { id: 5, x: 64, h: 130, shade: '#1a9878', dur: 4.1 },
  { id: 6, x: 76, h: 85,  shade: '#107068', dur: 3.8 },
  { id: 7, x: 86, h: 105, shade: '#20a888', dur: 4.6 },
  { id: 8, x: 94, h: 78,  shade: '#158870', dur: 3.3 },
]

const BUBBLES = Array.from({ length: 26 }, (_, i) => ({
  id:   i,
  size: sr(i * 5)  * 16 + 4,
  x:    sr(i * 11) * 86 + 7,
  dur:  sr(i * 19) * 8  + 6,
  del:  sr(i * 29) * 20,
  bx:   (sr(i * 37) - 0.5) * 30,
  bx2:  (sr(i * 43) - 0.5) * 30,
}))

function SeaweedSvg({ shade }: { shade: string }) {
  return (
    <svg viewBox="0 0 22 100" width="22" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 11 100 Q 17 80 11 60 Q 5 40 11 20 Q 17 5 11 0"
        stroke={shade} strokeWidth="3.5" strokeLinecap="round"
      />
      <path d="M 11 65 Q 2 55 5 45 Q 8 55 11 60"   fill={shade} opacity="0.85" />
      <path d="M 11 40 Q 20 30 18 20 Q 15 30 11 36" fill={shade} opacity="0.85" />
    </svg>
  )
}

export default function FrutigerAquaBackground() {
  const { theme } = useTheme()
  if (theme !== 'frutiger-aero') return null

  return (
    <div className="aero-bg-container" aria-hidden="true">

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
            animationDelay:    `${s.id * 0.55}s`,
          }}
        >
          <SeaweedSvg shade={s.shade} />
        </div>
      ))}

      {/* Rising air bubbles */}
      {BUBBLES.map(b => (
        <div
          key={b.id}
          className="aero-aqua-bubble"
          style={{
            width:             b.size,
            height:            b.size,
            left:              `${b.x}%`,
            bottom:            -30,
            animationDuration: `${b.dur}s`,
            animationDelay:    `-${b.del}s`,
            '--bx':  `${b.bx}px`,
            '--bx2': `${b.bx2}px`,
          } as React.CSSProperties}
        />
      ))}

    </div>
  )
}
