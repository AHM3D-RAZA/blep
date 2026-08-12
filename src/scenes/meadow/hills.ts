export interface HillLayer {
  id: string
  path: string // SVG path, viewBox "0 0 100 30"
  heightVh: number
  bottomVh: number // vertical offset from the ground
  fill: string
  opacity: number
}

// Front hill: closer, fuller, richer color, sits right at the ground line.
const FRONT_HEIGHT_VH = 15

// Back hill: farther away, so it reads smaller and sits higher on the
// horizon. Its visible rise starts at ~30% of the front hill's height and
// adds a bit more on top of that ("a few inches" of extra rise) — it peeks
// up behind the front hill rather than standing on the ground itself.
const BACK_HEIGHT_VH = FRONT_HEIGHT_VH * 0.3 + 3.5
const BACK_BOTTOM_VH = FRONT_HEIGHT_VH * 0.3

export const HILLS: HillLayer[] = [
  {
    id: 'hill-back',
    path: 'M0,30 L0,16 C12,9 22,20 34,13 C46,6 56,16 68,11 C80,6 90,14 100,10 L100,30 Z',
    heightVh: BACK_HEIGHT_VH,
    bottomVh: BACK_BOTTOM_VH,
    fill: '#7fa08f',
    opacity: 0.55,
  },
  {
    id: 'hill-front',
    path: 'M0,30 L0,15 C10,7 24,19 38,12 C52,5 64,17 78,10 C88,5 95,11 100,8 L100,30 Z',
    heightVh: FRONT_HEIGHT_VH,
    bottomVh: 0,
    fill: '#5c8a5f',
    opacity: 0.85,
  },
]

// Small daisy clusters sitting along each hill's silhouette — approximate
// positions along the curve, not physically simulated, just enough to read
// as "a field growing on the hill".
export interface HillDaisy {
  x: number // %
  y: number // % up from the hill layer's own bottom
  scale: number
}

export const HILL_DAISIES: Record<string, HillDaisy[]> = {
  'hill-back': [
    { x: 14, y: 55, scale: 0.4 },
    { x: 30, y: 68, scale: 0.35 },
    { x: 48, y: 48, scale: 0.4 },
    { x: 63, y: 62, scale: 0.35 },
    { x: 82, y: 45, scale: 0.4 },
  ],
  'hill-front': [
    { x: 8, y: 45, scale: 0.55 },
    { x: 20, y: 62, scale: 0.5 },
    { x: 33, y: 40, scale: 0.6 },
    { x: 47, y: 58, scale: 0.5 },
    { x: 58, y: 38, scale: 0.55 },
    { x: 72, y: 55, scale: 0.5 },
    { x: 85, y: 35, scale: 0.6 },
    { x: 93, y: 48, scale: 0.5 },
  ],
}
