import gsap from 'gsap'

/**
 * Drives a --wind-strength CSS variable (0.4–1.4) with gentle, irregular gusts.
 * Grass/flower sway animations read this var to scale their amplitude, so the
 * whole meadow breathes together instead of everything swaying identically.
 */
export function startWind(el: HTMLElement) {
  el.style.setProperty('--wind-strength', '0.7')
  const state = { strength: 0.7 }

  const gust = () => {
    const target = 0.5 + Math.random() * 0.9
    gsap.to(state, {
      strength: target,
      duration: 2.5 + Math.random() * 3,
      ease: 'sine.inOut',
      onUpdate: () => el.style.setProperty('--wind-strength', state.strength.toFixed(2)),
      onComplete: () => {
        timeoutId = window.setTimeout(gust, 1500 + Math.random() * 3500)
      },
    })
  }

  let timeoutId = window.setTimeout(gust, 800)

  return () => {
    window.clearTimeout(timeoutId)
    gsap.killTweensOf(state)
  }
}
