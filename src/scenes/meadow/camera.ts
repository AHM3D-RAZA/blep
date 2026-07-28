import gsap from 'gsap'

/**
 * Very slow, composited pan+scale loop. Kept subtle intentionally —
 * this should read as "the world is alive", not as a camera move.
 */
export function startCameraDrift(el: HTMLElement) {
  gsap.set(el, { transformOrigin: '50% 60%' })
  const tl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } })
  tl.to(el, { xPercent: 1.2, yPercent: -0.6, scale: 1.03, duration: 26 })
    .to(el, { xPercent: -1, yPercent: 0.8, scale: 1.015, duration: 30 })

  return () => tl.kill()
}
