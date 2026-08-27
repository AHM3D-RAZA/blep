/**
 * "The Butterfly That Remembers" Easter egg. Mechanically this butterfly
 * is just one of the meadow's ordinary ones (see `meadow/butterflies.ts`)
 * — same wing markup, same size, same wander behavior as every other —
 * picked here by id so the choice lives in one obvious place. It looks
 * and moves exactly like the rest of the flock the whole time; the only
 * thing that's actually different is in `MeadowScene.tsx`: once the
 * night sky's moon has fully settled, this one specific butterfly flies
 * to a flower and stays there for good instead of continuing to wander,
 * same as any of its ordinary brief landings but permanent. No visual
 * marker, no text — purely for anyone who happens to notice the same
 * one kept turning up.
 */
export const MEMORY_BUTTERFLY_ID = 'butterfly-0';
