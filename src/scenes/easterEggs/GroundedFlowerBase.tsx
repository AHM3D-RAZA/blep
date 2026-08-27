/**
 * A small soft shadow plus a few grass blades, drawn behind a portaled
 * flower's stem. Both DaisyGame's and ComplimentDaisy's triggers are
 * portaled into the meadow's atmosphere layer — the topmost layer in
 * the whole scene, above the meadow's own grass and hills — so on
 * their own they'd just be a small icon floating near the bottom edge
 * with nothing around it to suggest it's standing in anything. This
 * gives each one its own self-contained "planted in the ground" cue
 * that doesn't depend on whatever happens to be rendered underneath
 * it in the (much lower) meadow layers.
 */
export function GroundedFlowerBase() {
  return (
    <svg viewBox="0 0 40 20" className="grounded-flower-base" aria-hidden="true">
      <ellipse cx="20" cy="17" rx="13" ry="2.6" fill="rgba(20, 30, 10, 0.3)" />
      <path d="M9,20 C7,14 10,8 13,4 C13.5,10 12.5,15 13.5,20 Z" fill="#3a6339" />
      <path d="M18,20 C17,12 20,6 22,2 C23,9 21,14 22,20 Z" fill="#4a7346" />
      <path d="M27,20 C26,15 29,10 31,6 C31.5,12 30,16 31,20 Z" fill="#3a6339" />
    </svg>
  );
}
