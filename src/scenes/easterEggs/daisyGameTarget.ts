/**
 * The rigged "He Loves Me... He Loves Me More" Easter egg's position.
 *
 * This is deliberately its own small daisy graphic rather than one of
 * the meadow's own generated field of them (see `meadow/daisies.ts`):
 * that field is procedurally placed in a coordinate space tied to the
 * meadow's own slow camera drift, which keeps every one of those
 * daisies clustered in a thin strip right at the very bottom edge of
 * the screen — not a reliable, comfortably visible spot for something
 * meant to be found. A dedicated daisy at a hand-picked position (see
 * DaisyGame.tsx, which portals it above every scene) is simpler and
 * actually findable.
 */
export const DAISY_GAME_POSITION = { left: '11%', bottom: '2px' };
