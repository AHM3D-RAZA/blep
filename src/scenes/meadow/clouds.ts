export interface CloudDef {
  id: string
  top: number // %
  scale: number
  duration: number // seconds to drift fully across
  delay: number
  opacity: number
}

export const CLOUDS: CloudDef[] = [
  { id: 'c1', top: 8, scale: 1.1, duration: 90, delay: 0, opacity: 0.9 },
  { id: 'c2', top: 16, scale: 0.7, duration: 70, delay: -20, opacity: 0.7 },
  { id: 'c3', top: 5, scale: 0.85, duration: 110, delay: -55, opacity: 0.85 },
  { id: 'c4', top: 22, scale: 0.6, duration: 60, delay: -10, opacity: 0.6 },
  { id: 'c5', top: 12, scale: 1.3, duration: 130, delay: -80, opacity: 0.75 },
]
