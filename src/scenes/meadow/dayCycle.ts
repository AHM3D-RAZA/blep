import gsap from 'gsap'

export type DayPhase =
  | 'sunrise'
  | 'morning'
  | 'goldenHour'
  | 'sunset'
  | 'night'

export interface DayCycleStop {
  /** 0–1 position along the whole cycle */
  t: number
  phase: DayPhase
  sky: [string, string, string] // top, mid, bottom gradient stops
  sunOpacity: number
  moonOpacity: number
  starOpacity: number
  fireflyOpacity: number
  glowTint: string // ambient light wash over the scene
}

export const DAY_CYCLE_STOPS: DayCycleStop[] = [
  {
    t: 0,
    phase: 'sunrise',
    sky: ['#8aa9c8', '#f5c48c', '#f9dfb0'],
    sunOpacity: 0.85,
    moonOpacity: 0.15,
    starOpacity: 0.05,
    fireflyOpacity: 0,
    glowTint: 'rgba(255, 200, 150, 0.18)',
  },
  {
    t: 0.28,
    phase: 'morning',
    sky: ['#7ec2e6', '#bfe3f0', '#eaf6ee'],
    sunOpacity: 1,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0,
    glowTint: 'rgba(255, 255, 240, 0.08)',
  },
  {
    t: 0.55,
    phase: 'goldenHour',
    sky: ['#e8935f', '#f2b877', '#fbe1a8'],
    sunOpacity: 0.9,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0.15,
    glowTint: 'rgba(255, 176, 100, 0.28)',
  },
  {
    t: 0.72,
    phase: 'sunset',
    sky: ['#4b3b6b', '#c8607a', '#f0a86a'],
    sunOpacity: 0.55,
    moonOpacity: 0.2,
    starOpacity: 0.25,
    fireflyOpacity: 0.5,
    glowTint: 'rgba(220, 130, 140, 0.22)',
  },
  {
    t: 1,
    phase: 'night',
    sky: ['#0b1330', '#1c2650', '#33366b'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 1,
    fireflyOpacity: 1,
    glowTint: 'rgba(140, 160, 255, 0.12)',
  },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function lerpColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a)
  const pb = hexToRgb(b)
  const r = Math.round(lerp(pa[0], pb[0], t))
  const g = Math.round(lerp(pa[1], pb[1], t))
  const bch = Math.round(lerp(pa[2], pb[2], t))
  return `rgb(${r}, ${g}, ${bch})`
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const bigint = parseInt(h, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
}

export function sampleDayCycle(progress: number) {
  const p = Math.min(1, Math.max(0, progress))
  let lo = DAY_CYCLE_STOPS[0]
  let hi = DAY_CYCLE_STOPS[DAY_CYCLE_STOPS.length - 1]
  for (let i = 0; i < DAY_CYCLE_STOPS.length - 1; i++) {
    if (p >= DAY_CYCLE_STOPS[i].t && p <= DAY_CYCLE_STOPS[i + 1].t) {
      lo = DAY_CYCLE_STOPS[i]
      hi = DAY_CYCLE_STOPS[i + 1]
      break
    }
  }
  const span = hi.t - lo.t || 1
  const localT = (p - lo.t) / span

  return {
    phase: localT < 0.5 ? lo.phase : hi.phase,
    sky: [
      lerpColor(lo.sky[0], hi.sky[0], localT),
      lerpColor(lo.sky[1], hi.sky[1], localT),
      lerpColor(lo.sky[2], hi.sky[2], localT),
    ] as [string, string, string],
    sunOpacity: lerp(lo.sunOpacity, hi.sunOpacity, localT),
    moonOpacity: lerp(lo.moonOpacity, hi.moonOpacity, localT),
    starOpacity: lerp(lo.starOpacity, hi.starOpacity, localT),
    fireflyOpacity: lerp(lo.fireflyOpacity, hi.fireflyOpacity, localT),
    glowTint: localT < 0.5 ? lo.glowTint : hi.glowTint,
  }
}

/**
 * Drives the meadow's lighting timeline onto CSS custom properties on `el`.
 * Single source of truth — everything else (sky, sun/moon, stars, fireflies)
 * just reads these vars, so nothing fights over "what time it is".
 */
export function startDayCycle(
  el: HTMLElement,
  durationSeconds: number,
  onPhaseChange?: (phase: DayPhase) => void,
  onProgress?: (progress: number) => void,
) {
  const state = { progress: 0 }
  let lastPhase: DayPhase | null = null

  const apply = () => {
    const sample = sampleDayCycle(state.progress)
    el.style.setProperty('--sky-top', sample.sky[0])
    el.style.setProperty('--sky-mid', sample.sky[1])
    el.style.setProperty('--sky-bottom', sample.sky[2])
    el.style.setProperty('--sun-opacity', String(sample.sunOpacity))
    el.style.setProperty('--moon-opacity', String(sample.moonOpacity))
    el.style.setProperty('--star-opacity', String(sample.starOpacity))
    el.style.setProperty('--firefly-opacity', String(sample.fireflyOpacity))
    el.style.setProperty('--glow-tint', sample.glowTint)
    // sun/moon travel across the sky, opposite arcs
    const arcX = 10 + state.progress * 80
    const arcY = 60 - Math.sin(state.progress * Math.PI) * 45
    el.style.setProperty('--celestial-x', `${arcX}%`)
    el.style.setProperty('--celestial-y', `${arcY}%`)

    if (sample.phase !== lastPhase) {
      lastPhase = sample.phase
      onPhaseChange?.(sample.phase)
    }
    onProgress?.(state.progress)
  }

  const tween = gsap.to(state, {
    progress: 1,
    duration: durationSeconds,
    ease: 'none',
    repeat: -1,
    onUpdate: apply,
  })

  apply()
  return () => tween.kill()
}
