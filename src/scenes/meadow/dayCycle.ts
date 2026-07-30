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
  /** gradient stops, evenly spaced top→bottom — all stops arrays must be the same length */
  sky: string[]
  sunOpacity: number
  moonOpacity: number
  starOpacity: number
  fireflyOpacity: number
  /** golden-hour dust motes — should be 0 by night, this isn't ambient light */
  dustOpacity: number
  glowTint: string // ambient light wash over the scene
}

export const SKY_STOP_COUNT = 4

export const DAY_CYCLE_STOPS: DayCycleStop[] = [
  {
    // Dawn: cool lavender blue up top settling into blush and warm gold
    // near the horizon — a real dawn has that color band, not one flat hue.
    t: 0,
    phase: 'sunrise',
    sky: ['#7c8fb5', '#b98ca3', '#e8a87e', '#f6d9a8'],
    sunOpacity: 0.8,
    moonOpacity: 0.1,
    starOpacity: 0.04,
    fireflyOpacity: 0,
    dustOpacity: 0.15,
    glowTint: 'rgba(240, 190, 150, 0.14)',
  },
  {
    // Clear midday: a proper deep sky blue up top, not washed out.
    t: 0.09,
    phase: 'morning',
    sky: ['#4f8bc9', '#7fb4dd', '#c3e2df', '#eef1e2'],
    sunOpacity: 1,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0,
    dustOpacity: 0,
    glowTint: 'rgba(255, 252, 240, 0.06)',
  },
  {
    // Golden hour: still blue overhead, warming fast toward the horizon.
    t: 0.34,
    phase: 'goldenHour',
    sky: ['#3d6ea0', '#d38f5e', '#eeb877', '#f8dca0'],
    sunOpacity: 0.85,
    moonOpacity: 0,
    starOpacity: 0,
    fireflyOpacity: 0.1,
    dustOpacity: 1,
    glowTint: 'rgba(240, 175, 110, 0.2)',
  },
  {
    // Sunset: dramatic banding — indigo up top, plum, rose, amber horizon.
    t: 0.46,
    phase: 'sunset',
    sky: ['#2c2850', '#6b4570', '#c96b74', '#eb9a68'],
    sunOpacity: 0.5,
    moonOpacity: 0.25,
    starOpacity: 0.2,
    fireflyOpacity: 0.4,
    dustOpacity: 0.25,
    glowTint: 'rgba(200, 130, 140, 0.16)',
  },
  {
    // Night: deep navy with a faint warm-cool gradient still visible near
    // the horizon rather than a single flat black-blue.
    t: 0.58,
    phase: 'night',
    sky: ['#080b1e', '#10162e', '#181f40', '#242a4c'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 1,
    fireflyOpacity: 1,
    dustOpacity: 0,
    glowTint: 'rgba(130, 145, 220, 0.08)',
  },
  {
    // Identical to the stop above — this is the dwell. Interpolating between
    // two equal stops holds night steady for the last ~42% of the cycle
    // instead of snapping straight back to sunrise.
    t: 1,
    phase: 'night',
    sky: ['#080b1e', '#10162e', '#181f40', '#242a4c'],
    sunOpacity: 0,
    moonOpacity: 1,
    starOpacity: 1,
    fireflyOpacity: 1,
    dustOpacity: 0,
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
    sky: lo.sky.map((color, i) => lerpColor(color, hi.sky[i], localT)),
    sunOpacity: lerp(lo.sunOpacity, hi.sunOpacity, localT),
    moonOpacity: lerp(lo.moonOpacity, hi.moonOpacity, localT),
    starOpacity: lerp(lo.starOpacity, hi.starOpacity, localT),
    fireflyOpacity: lerp(lo.fireflyOpacity, hi.fireflyOpacity, localT),
    dustOpacity: lerp(lo.dustOpacity, hi.dustOpacity, localT),
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
    sample.sky.forEach((color, i) => el.style.setProperty(`--sky-${i}`, color))
    el.style.setProperty('--sun-opacity', String(sample.sunOpacity))
    el.style.setProperty('--moon-opacity', String(sample.moonOpacity))
    el.style.setProperty('--star-opacity', String(sample.starOpacity))
    el.style.setProperty('--firefly-opacity', String(sample.fireflyOpacity))
    el.style.setProperty('--dust-opacity', String(sample.dustOpacity))
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
