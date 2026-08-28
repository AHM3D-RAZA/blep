# TODO.md

# Issu Gift's — Build Checklist

## Foundation

* [x] App shell running
* [x] Scene/state machine implemented
* [x] Shared types/contracts in place
* [x] Config/content files created
* [x] Placeholder scene registry created
* [x] Shared layout baseline created
* [x] Mobile viewport behavior confirmed

---

## Loading

* [x] Poetic cycling text from config (loadingMessages)
* [x] No spinner
* [x] No percentage display
* [x] No abrupt transition
* [x] The meadow is always fully there and rendering, exactly like any
      other time — nothing about it is hidden or specially gated for
      loading. It's dark at first because that's genuinely the meadow's
      own pre-dawn state, not because anything was hidden.
* [x] The only addition: the two focal flowers (sunflower + daisy) show
      on top during loading, then fade out after the text finishes.
      Underneath, the meadow's own day cycle just keeps progressing on
      its own — sun rising, sky brightening — completely unmodified,
      and carries on exactly the same way after hand-off.
* [x] One small kept enhancement: the sun rises up from below the
      visible screen instead of just fading in already mid-sky
      (sunArcPosition in dayCycle.ts).

---

## Opening scene rework (per detailed opening-scene spec)

* [x] Genuine pre-dawn base state (deep blue, not pitch black; ground
      mist; faint fading fireflies/stars/moon; almost no butterflies)
* [x] Two focal flowers (sunflower taller/heavier/slower, daisy leaning
      toward it, non-looping organic sway) — SunflowerGraphic/
      DaisyGraphic extracted as shared components, reused by both the
      loading scene and the ambient meadow field
* [x] Compressed ~18s cinematic sunrise arc for the opening leg only
      (CHECKPOINT_LEG_SECONDS override in dayCycle.ts), every later
      leg keeps its normal slow pace
* [x] One sentence (openingLine in content/site.ts), fades in/holds/
      fades out, no typing effect
* [x] One tiny handwritten loading line below the flowers, the entire
      loading indicator — cycles through a shuffled, non-repeating pass
      of loadingMessages every few seconds while on screen (was: single
      random pick, static for the whole loading duration)
* [x] Flowers + sentence + handwritten line now hold together and fade
      out as one only once the sun is actually visible during the
      cinematic sunrise (SUN_VISIBLE_DELAY_MS in LoadingScene.tsx, timed
      to SUN_WINDOW/CHECKPOINT_LEG_SECONDS in meadow/dayCycle.ts), rather
      than fading early and padding the rest with an idle settle pause
* [x] Ambient audio (soft wind/birds) — wired via useAmbientAudio hook +
      openingAmbience config, following the exact same public/audio path
      convention as the song. Fades in on mount, fades out in sync with
      the hand-off pause. **File itself still needs to be placed** at
      public/audio/opening-ambience.mp3 — see the comment on
      openingAmbience in content/site.ts for format recommendations.
* [ ] Cinematic hand-off: camera push through the meadow, flowers exit
      frame, sun finishes rising, butterflies begin appearing, one
      continuous shot through to the envelope (no cut). Current
      hand-off is a placeholder pause-then-onNext(); this replaces it.

---

## Meadow

* [x] Sunrise meadow
* [x] Grass layers
* [x] Daisies present throughout
* [x] Sunflowers present
* [x] Clouds
* [x] Moon
* [x] Stars
* [x] Wind
* [x] Butterflies
* [x] Butterfly landing behavior
* [x] Petal drift
* [x] Golden hour dust
* [x] Fireflies
* [x] Camera drift
* [x] Sunrise-to-night progression
* [x] Background hills (2-layer parallax, with daisies growing on them)
* [x] Wildflowers (foreground field)
* [x] Checkpoint-gated day progression (advanceMeadowCheckpoint() in
      dayCycle.ts — wired centrally in SceneManager.tsx: 20% of the cycle
      per section, in order — start screen, meadow+envelope, letter 1,
      song, letter 2 — reaching 100% at the end of letter 2. It calls this
      once whenever leaving loading/envelope/letterOne/audio, matching the
      mapping documented in dayCycle.ts. Individual scenes don't need to
      call it themselves. The meadow's own "continue" button does NOT make
      an extra call of its own — confirmed intentional, see Branch
      Tracking note on feat/loading below.)
* [x] The moon genuinely stops moving once it's fully settled (previously
      drifted gently forever after rising — fixed at the source in
      dayCycle.ts's moonArcPosition)
* [ ] Android layout test passed (needs a real-device/manual check — see summary)

---

## Envelope + First Letter

* [x] Envelope created
* [x] Envelope idle motion
* [x] Wax seal
* [x] Soft shadow
* [x] Tap-to-open
* [x] Letter reveal animation
* [x] First note page
* [x] Paper texture
* [x] Doodles/sketches
* [x] Embedded landscape photos
* [x] Continue control
* [ ] Mobile readability confirmed (built mobile-first and type-checked/linted/built clean; still needs a look on an actual phone)

---

## Audio + Second Letter

* [x] Custom audio player (handcrafted vintage record player, `CDPlayer.tsx`)
* [x] Play
* [x] Pause
* [x] Replay
* [x] Progress indicator (draggable satin-ribbon progress bar)
* [x] Download audio
* [x] No default browser audio UI
* [x] Quiet playback atmosphere (dimmed sky, vignette, fewer sparkles while playing)
* [x] Second note page (`LetterTwoScene.tsx`, shared LetterPage overlay)
* [x] Warmer reflective tone (letterTwo copy in `src/content/letters.ts`)
* [x] Transition to ending (Letter Two's control folds the paper into a lantern that drifts up into the night sky, then hands off into the Night Sky ending — see below)

---

## Night Sky Ending

_The originally planned Promise Tree ending (tree, swing, hidden mailbox, carved initials) was replaced by a night-sky ending per a later design change — nothing from that plan was ever built, so nothing needed removing._

* [x] Lantern transition (paper folds, becomes a small glowing lantern, floats up and fades — on Letter Two's "One Last Thing..." control)
* [x] Silence pause (~3s of ambient-only meadow before anything new happens)
* [x] Stars physically drift into "I LOVE YOU" (real star elements moving to positions, not text/font)
* [x] Constellation twinkles gently once formed (not static)
* [x] Fireflies gather into "ISSU" (real firefly elements, not text/font)
* [x] Firefly name stays visibly alive once formed (flicker + idle wobble)
* [x] Shooting star crosses the sky once
* [x] Tapping the shooting star reveals a short fading message; ignoring it does nothing
* [x] World keeps breathing throughout (existing meadow ambient systems untouched)
* [x] Final closing message ("Thank you for spending today with me.") fades in only after everything else finishes
* [x] Replay Journey control
* [x] Download Our Letters control (generates a real text file from the letters content)
* [x] Keep My Voice control (downloads the audio file)
* [x] Stars/fireflies fade in with the meadow's own day cycle (from sunset through to night) rather than always being visible; formation begins once the moon has FULLY settled in place
* [x] Star formation uses more jitter/thinning than fireflies (tuned separately — "I LOVE YOU" is longer with straighter strokes, needed more scatter to avoid reading as a grid) and true per-star random twinkle timing instead of a repeating cycle
* [x] Constellation/fireflies/shooting star never disappear once formed — the night-sky sequence and the closing state are one continuous scene (no crossfade between them) so nothing unmounts until "replay" is actually pressed
* [x] Closing controls: night-appropriate frosted-glass style, laid out in normal document flow so the message and buttons can never overlap regardless of how many lines they wrap to
* [x] Closing controls also gated on the moon being FULLY settled (a later, separate signal from the "halfway" one that used to start the sky sequence) — they no longer appear while the moon is still mid-rise even if the shooting star moment has already wrapped up
* [x] Closing controls have bespoke hand-drawn icons (moon/envelope/music note) instead of emoji, moonlit-glass background, twinkling sparkle accent per pill on the same rhythm as the constellation stars
* [x] Constellation band repositioned below the moon's resting spot so the two never overlap
* [ ] Literal same DOM stars/fireflies relocating (current implementation uses a dedicated layer styled identically to the ambient ones, rather than animating the meadow's own ~110 background stars)
* [ ] Fireflies individually leaving/being replaced during formation (currently: idle wobble + flicker sells "alive"; literal cycling not implemented)
* [ ] Occasional butterfly landing during idle world (not implemented this pass)
* [ ] Rigged daisy mini-game
* [ ] Memory bubbles
* [ ] Password gate
* [ ] DJ scratch interaction
* [ ] Live relationship timer
* [ ] Pakistan time display
* [ ] Philippines time display
* [ ] Infinite compliment daisy
* [ ] Butterfly friend interaction
* [ ] Secret sunflower interaction
* [ ] Secret replay variation

---

## Content

* [ ] Loading messages
* [ ] Letter one text
* [x] Letter two text
* [ ] Compliments
* [ ] Memories
* [ ] Hidden notes
* [x] Closing message ("Thank you for spending today with me.")
* [x] Shooting star messages (3 defaults in place — content/site.ts)
* [x] Button labels
* [ ] Relationship start date
* [ ] Timezone settings
* [x] Audio file path
* [x] Photo list

---

## Polish

* [ ] Lighting refinement
* [ ] Shadow refinement
* [ ] Typography refinement
* [ ] Motion timing refinement
* [ ] Photo placement refinement
* [ ] Button styling refinement
* [ ] Golden hour refinement
* [ ] Night atmosphere refinement
* [ ] Scene transition refinement
* [ ] Mobile readability refinement

---

## Performance

* [ ] Android performance test
* [ ] Asset optimization
* [ ] Motion efficiency check
* [ ] No major jank
* [ ] Missing asset fallback behavior
* [ ] Reduced-motion considerations
* [ ] Touch target review

---

## Final Review

* [ ] Compare against PROJECT_BIBLE.md
* [ ] Compare against ROADMAP.md
* [ ] Identify missing items
* [ ] Fix missing items
* [ ] Update TODO status
* [ ] Final commit made
* [ ] Project ready to ship

---

## Branch Tracking

* [ ] `feat/foundation`
* [x] `feat/meadow`
* [x] `feat/envelope-letter1`
* [x] `feat/audio-letter2`
* [x] `feat/loading` (real opening scene + pre-dawn/mist/cinematic-sunrise day-cycle work — merged into `feat/full-integrated`; its meadow-continue button's redundant direct advanceMeadowCheckpoint() call was NOT carried over, per explicit confirmation — night now falls later, around Audio → Letter Two, matching feat/loading's intended checkpoint mapping)
* [x] `feat/promise-easterEggs` (Promise Tree ending was never built here; became the Night Sky ending instead — merged into `feat/full-integrated`, everything through Letter Two taken from `feat/audio-letter2`, opening/loading taken from `feat/loading`)
