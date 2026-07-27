# PROJECT_BIBLE.md

# Issu's Gift — Engineering Project Bible

## 1. Project Identity

**Project name:** Issu Gift
**Creator:** Razey
**Recipient:** Issu

This project is a mobile-first, Android-friendly interactive digital love letter. It must feel like a handcrafted romantic experience, not a normal website.

The app is a single continuous emotional journey that moves through:

* loading meadow
* sunrise meadow
* envelope opening
* first letter
* audio scene
* second letter
* golden hour
* sunset
* night meadow
* Promise Tree ending
* replay / download / visit-again state
* hidden Easter eggs

The project must be built as a modular scene-driven experience so separate Claude accounts can work on different branches without conflicting.

---

## 2. Technical Vision

### Recommended stack

Use a lightweight modular frontend stack. Preferred:

* React + TypeScript
* Vite
* CSS modules or plain CSS
* GSAP for cinematic motion
* small utility modules for timing, scene switching, and config

The project should remain easy to maintain, easy to personalize, and easy to animate.

### Architecture principles

* one scene system
* config-driven personal content
* modular components
* isolated scene modules
* no hardcoded personal text scattered through the UI
* no unnecessary state duplication
* no unrelated code edits
* no giant all-in-one components

---

## 3. Required File / Folder Contracts

The build should use explicit modules so Claude can work on one part at a time.

### Shared content/config files

Use these exact or equivalent files:

* `src/content/site.ts`
* `src/content/letters.ts`
* `src/content/compliments.ts`
* `src/content/memories.ts`
* `src/content/timeline.ts`
* `src/content/easterEggs.ts`
* `src/content/photos.ts`
* `src/content/buttons.ts`

### Shared scene / architecture files

Use these exact or equivalent files:

* `src/scenes/SceneManager.tsx`
* `src/scenes/sceneTypes.ts`
* `src/scenes/sceneRegistry.ts`
* `src/scenes/sceneTiming.ts`
* `src/components/SceneFrame.tsx`
* `src/components/SceneTransition.tsx`

### Meadow / environment files

Use these exact or equivalent files:

* `src/scenes/meadow/MeadowScene.tsx`
* `src/scenes/meadow/sky.ts`
* `src/scenes/meadow/clouds.ts`
* `src/scenes/meadow/grass.ts`
* `src/scenes/meadow/daisies.ts`
* `src/scenes/meadow/sunflowers.ts`
* `src/scenes/meadow/butterflies.ts`
* `src/scenes/meadow/petals.ts`
* `src/scenes/meadow/fireflies.ts`
* `src/scenes/meadow/wind.ts`
* `src/scenes/meadow/camera.ts`
* `src/scenes/meadow/dayCycle.ts`

### Envelope / first letter files

Use these exact or equivalent files:

* `src/scenes/envelope/EnvelopeScene.tsx`
* `src/scenes/envelope/Envelope.tsx`
* `src/scenes/envelope/envelopeMotion.ts`
* `src/scenes/letters/LetterOneScene.tsx`
* `src/scenes/letters/LetterPage.tsx`
* `src/scenes/letters/photoLayout.ts`

### Audio / second letter files

Use these exact or equivalent files:

* `src/scenes/audio/AudioScene.tsx`
* `src/scenes/audio/CDPlayer.tsx`
* `src/scenes/audio/audioControls.ts`
* `src/scenes/letters/LetterTwoScene.tsx`

### Ending / Easter egg files

Use these exact or equivalent files:

* `src/scenes/ending/PromiseTreeScene.tsx`
* `src/scenes/ending/PromiseTree.tsx`
* `src/scenes/ending/Mailbox.tsx`
* `src/scenes/ending/Swing.tsx`
* `src/scenes/easterEggs/EasterEggManager.tsx`
* `src/scenes/easterEggs/riggedDaisy.ts`
* `src/scenes/easterEggs/memoryBubbles.ts`
* `src/scenes/easterEggs/relationshipTimer.ts`
* `src/scenes/easterEggs/timezones.ts`

These names can vary slightly if needed, but the modular separation must remain the same.

---

## 4. Scene Flow Contract

The scene flow must be preserved exactly:

1. `loading`
2. `meadow`
3. `envelope`
4. `letterOne`
5. `audio`
6. `letterTwo`
7. `sunsetTransition`
8. `nightMeadow`
9. `promiseTree`
10. `explore` / `finalRest`
11. hidden Easter egg overlays and secret replay states

No scrolling should control this sequence.

The scene manager must be the single source of truth for scene progression.

---

## 5. Visual Direction

The whole experience must feel like:

* cottagecore
* moon and stars
* sunflower and daisy
* warm golden light
* Ghibli-inspired
* dreamy but believable
* handcrafted
* scrapbook-like
* romantic but not cheesy

### Visual non-negotiables

* daisies are always present in the meadow
* sunflowers are present as a warm companion element
* butterflies begin sparse and gradually increase
* butterflies sometimes land on daisies
* petals drift occasionally and naturally
* golden hour must be especially beautiful
* night must be peaceful, moonlit, and full of fireflies
* all motion must feel organic

---

## 6. Emotional Contract

The app must evoke this emotional progression:

* curiosity
* comfort
* anticipation
* tenderness
* intimacy
* reflection
* peace

The experience should feel like one long cinematic day:

* dawn
* sunrise
* morning
* afternoon
* golden hour
* sunset
* night

---

## 7. Scene-Specific Requirements

### Loading scene

* sunflower and daisy swaying together
* poetic loading text from config
* no spinner
* no percentage display
* no abrupt transition

### Meadow scene

* full-screen living meadow
* sunrise to sunset to night lighting progression
* daisies everywhere
* sunflowers present
* clouds, wind, grass, petals, butterflies, fireflies, moon, stars
* subtle camera drift
* warm realistic atmosphere
* meadow remains the continuous world base

### Envelope scene

* handcrafted envelope in the meadow
* idle motion
* wax seal
* soft shadow
* tap to open
* smooth reveal of letter one

### Letter one scene

* handmade paper look
* doodles and sketches
* embedded landscape photos
* readable on mobile
* continue button or story continuation control

### Audio scene

* custom vintage-style player
* play / pause / replay
* progress indicator
* download action
* no default browser audio UI
* quiet focused atmosphere

### Letter two scene

* warmer and more reflective than letter one
* handcrafted paper presentation
* transition toward ending

### Promise Tree ending

* tree feels like it has always existed
* swing
* hidden mailbox
* subtle initials
* final note
* replay / download / visit-again controls

### Easter eggs

* subtle, romantic, playful, discovery-based
* must not break the main flow
* must remain optional

---

## 8. Content / Personalization Rules

All personal content must be editable through config files, not hardcoded across the app.

### Must be configurable

* Issu / Razey names
* loading messages
* letter one content
* letter two content
* compliments
* memory bubbles
* hidden notes
* button labels
* photo list
* audio path
* relationship start date
* timezone settings
* Easter egg lines

### Content storage requirement

Use a single content layer so future edits are easy:

* `src/content/site.ts`
* `src/content/letters.ts`
* `src/content/compliments.ts`
* `src/content/memories.ts`
* `src/content/timeline.ts`
* `src/content/easterEggs.ts`
* `src/content/photos.ts`
* `src/content/buttons.ts`

---

## 9. Relationship Timer Contract

The timer must support:

* Pakistan local time
* Philippines local time
* live duration count
* exact, readable display

The timer should use proper timezone logic, not hardcoded assumptions.

---

## 10. Easter Egg Philosophy

Easter eggs should feel like personal discoveries, not game features.

Approved examples:

* rigged “He Loves Me… He Loves Me More” daisy mini-game
* floating memory bubbles
* “Only You” password gate
* DJ scratch interaction
* live relationship timer
* Pakistan / Philippines time display
* infinite compliment daisy
* butterfly friend interaction
* secret sunflower interaction
* hidden shooting star interaction
* secret replay variation

---

## 11. Performance Contract

The project must run smoothly on Android.

### Required performance behavior

* efficient motion
* minimal layout thrash
* mobile-safe typography and spacing
* optimized assets
* graceful fallback for missing files
* no major jank
* no unnecessary heavy rendering

Use transforms and composited motion where practical.

---

## 12. Accessibility Contract

The experience should remain usable and readable:

* readable text
* adequate contrast
* comfortable tap targets
* reduced-motion awareness where practical
* no hover-only critical actions
* no broken controls on touch devices

---

## 13. No-Go List

Never include:

* generic dashboard UI
* default audio controls
* unnecessary modal stacks
* hardcoded content everywhere
* scrolling narrative flow
* cluttered navigation
* stock illustrations
* flashy effects that break the mood
* unrelated features outside the romantic meadow story

---

## 14. Definition of Done

The project is complete only if:

* the meadow feels alive
* the envelope reveal feels magical
* the first letter feels like a keepsake
* the audio scene feels intimate
* the second letter feels reflective
* the Promise Tree ending feels peaceful
* the Easter eggs feel delightful
* replay and download work
* the layout works on Android
* the full experience feels emotionally complete

The final result should feel like a place, not a page.