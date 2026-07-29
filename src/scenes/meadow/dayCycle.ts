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
    sky: ['#9fb2c9', '#e3b48f', '#f2d7ac'],
    sunOpacity: 0.8,
    moonOpacity: 0.1,
    starOpacity: 0.04,
    fireflyOpacity: 0,
    glowTint: 'rgba(240, 190, 150, 0.14)',
  },
  {
    t: 0.09,
    phase: 'morning',
    sky: ['#8bb9d9', '#cfe3d9', '#eef1e2'],
    sunOpacity: 1,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0,
    glowTint: 'rgba(255, 252, 240, 0.06)',
  },
  {
    t: 0.34,
    phase: 'goldenHour',
    sky: ['#d18f61', '#e4ae78', '#f3d6a2'],
    sunOpacity: 0.85,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0.1,
    glowTint: 'rgba(240, 175, 110, 0.2)',
  },
  {
    t: 0.46,
    phase: 'sunset',
    sky: ['#4a3f66', '#a2617a', '#d99a70'],
    sunOpacity: 0.5,
    moonOpacity: 0.25,
    starOpacity: 0.2,
    fireflyOpacity: 0.4,
    glowTint: 'rgba(200, 130, 140, 0.16)',
  },
  {
    t: 0.58,
    phase: 'night',
    sky: ['#0d1226', '#161d3c', '#292c53'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 0.85,
    fireflyOpacity: 1,
    glowTint: 'rgba(130, 145, 220, 0.08)',
  },
  {
    // Identical to the stop above — this is the dwell. Interpolating between
    // two equal stops holds night steady for the last ~42% of the cycle
    // instead of snapping straight back to sunrise.
    t: 1,
    phase: 'night',
    sky: ['#0d1226', '#161d3c', '#292c53'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 0.85,
    fireflyOpacity: 1,
    glowTint: 'rgba(130, 145, 220, 0.08)',
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

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

/**
 * The sun rises, arcs, and sets within its window — that's correct, it
 * should set. The moon is different: it rises once during dusk, then
 * *holds* near the top of the sky with only a slow drift for the rest of
 * the (long) night dwell, rather than re-running the same rise/set arc —
 * otherwise it dips back toward the horizon and appears to "set" right
 * before the cycle loops.
 */
const SUN_WINDOW: [number, number] = [0, 0.56]
const MOON_RISE_WINDOW: [number, number] = [0.42, 0.6]
const MOON_REST_Y = 20 // % from top — stays high in the sky, never near the horizon
const MOON_DRIFT_X: [number, number] = [30, 68] // slow horizontal wander, well clear of both edges

function sunArcPosition(progress: number) {
  const local = clamp01((progress - SUN_WINDOW[0]) / (SUN_WINDOW[1] - SUN_WINDOW[0]))
  const x = 8 + local * 74 // stays inset from the edges — reads as farther away
  const y = 66 - Math.sin(local * Math.PI) * 36 // flatter arc than before, less "in your face"
  return { x, y }
}

function moonArcPosition(progress: number) {
  if (progress <= MOON_RISE_WINDOW[1]) {
    // Rising: climbs from just above the horizon up to its resting height.
    const local = clamp01((progress - MOON_RISE_WINDOW[0]) / (MOON_RISE_WINDOW[1] - MOON_RISE_WINDOW[0]))
    const x = MOON_DRIFT_X[0] + local * 6
    const y = 78 - local * (78 - MOON_REST_Y)
    return { x, y }
  }
  // Holding: a slow, gentle drift across the night — never sets, never
  // reaches the screen edges.
  const dwellLocal = clamp01((progress - MOON_RISE_WINDOW[1]) / (1 - MOON_RISE_WINDOW[1]))
  const drift = Math.sin(dwellLocal * Math.PI) // eases out and back, no snap at the loop point
  const x = MOON_DRIFT_X[0] + 6 + drift * (MOON_DRIFT_X[1] - MOON_DRIFT_X[0] - 6)
  const y = MOON_REST_Y - drift * 3
  return { x, y }
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

    // sun sets normally; moon rises once then holds (see moonArcPosition)
    const sunPos = sunArcPosition(state.progress)
    const moonPos = moonArcPosition(state.progress)
    el.style.setProperty('--sun-x', `${sunPos.x}%`)
    el.style.setProperty('--sun-y', `${sunPos.y}%`)
    el.style.setProperty('--moon-x', `${moonPos.x}%`)
    el.style.setProperty('--moon-y', `${moonPos.y}%`)

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
