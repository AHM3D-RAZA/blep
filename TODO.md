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
* [x] One tiny handwritten loading line below the flowers (random pick
      from loadingMessages), the entire loading indicator
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
      call it themselves.)
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
* [x] Second note page (scrapbook style, `LetterTwoScene.tsx`)
* [x] Warmer reflective tone (new letterTwo copy in `src/content/letters.ts`)
* [x] Transition to ending (labeled "walk to the promise tree" button on the last page)

---

## Promise Tree + Easter Eggs

* [ ] Promise Tree
* [ ] Swing
* [ ] Hidden mailbox
* [ ] Subtle initials
* [ ] Final hidden note
* [ ] Replay control
* [ ] Download control
* [ ] Visit-again control
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
* [ ] Shooting star interaction
* [ ] Secret replay variation

---

## Content

* [ ] Loading messages
* [ ] Letter one text
* [x] Letter two text
* [ ] Compliments
* [ ] Memories
* [ ] Hidden notes
* [ ] Final mailbox note
* [ ] Button labels
* [ ] Relationship start date
* [ ] Timezone settings
* [ ] Audio file path
* [ ] Photo list

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
* [ ] `feat/promise-eggs`