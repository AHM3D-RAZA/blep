/**
 * The "meadow" step no longer renders the meadow itself — the real meadow
 * is now a single persistent instance mounted once in `SceneManager`, so
 * its day/night cycle never resets and it never crossfades. This overlay
 * is intentionally empty: the meadow's own "step into the meadow" button
 * (shown via its `interactive` prop) is the only foreground UI this step
 * needs, and that button lives on the persistent instance, not here.
 */
export default function MeadowStepOverlay() {
  return null
}
