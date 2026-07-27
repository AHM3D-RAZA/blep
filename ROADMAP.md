# ROADMAP.md

# Issu Gift's — Build Roadmap

## Purpose

This roadmap is the exact build order for the project.
It exists so different Claude accounts can work on independent modules without compromising the original plan.

---

## Phase 0 — Foundation

### Branch

`feat/foundation`

### Account

Claude Account 1

### Goal

Build the shared app shell and module contracts.

### Deliverables

* working app shell
* scene/state machine
* shared types/contracts
* config/content structure
* placeholder scene registry
* shared layout baseline
* mobile-first viewport setup

### Exit criteria

* app runs cleanly
* scene flow exists
* later modules can plug in without redesign

---

## Phase 1 — Meadow Environment

### Branch

`feat/meadow`

### Account

Claude Account 2

### Goal

Build the living meadow base.

### Deliverables

* sunrise meadow
* grass layers
* daisies
* sunflowers
* clouds
* moon
* stars
* wind
* butterflies
* petal drift
* golden hour dust
* fireflies
* camera drift
* sunrise-to-sunset-to-night progression

### Exit criteria

* meadow feels alive
* motion is natural
* the world supports the whole experience

---

## Phase 2 — Envelope + First Letter

### Branch

`feat/envelope-letter1`

### Account

Claude Account 3

### Goal

Build the opening interaction and the first note.

### Deliverables

* envelope component
* idle motion
* wax seal
* tap-to-open
* letter reveal
* first letter page
* paper textures
* doodles/sketches
* embedded landscape photos
* continue transition to audio

### Exit criteria

* envelope reveal feels cinematic
* first letter feels handmade
* mobile layout remains comfortable

---

## Phase 3 — Audio + Second Letter

### Branch

`feat/audio-letter2`

### Account

Claude Account 4

### Goal

Build the audio player and the second note.

### Deliverables

* custom audio player
* play / pause / replay
* progress indicator
* audio download
* quiet playback atmosphere
* second letter page
* warmer reflective tone
* transition toward ending

### Exit criteria

* audio feels personal and custom
* second letter feels distinct
* no default browser audio UI remains

---

## Phase 4 — Promise Tree + Easter Eggs + Final Review

### Branch

`feat/promise-eggs`

### Account

Claude Account 5

### Goal

Finish the ending and hidden discoveries.

### Deliverables

* Promise Tree
* swing
* hidden mailbox
* initials
* final note
* replay / download / visit-again controls
* Easter eggs
* secret replay variation
* final spec review and gap check

### Exit criteria

* ending feels peaceful
* hidden interactions work
* final review finds and fixes missing items

---

## Parallel Work Rule

If one Claude account hits a limit, move the same branch to another free account.

Do not restart the whole project.
Do not rebuild unrelated modules.
Do not move code around unnecessarily.

---

## Merge Order

1. `feat/foundation`
2. `feat/meadow`
3. `feat/envelope-letter1`
4. `feat/audio-letter2`
5. `feat/promise-eggs`

---

## Final Review Order

After all merges:

1. compare the full app against `PROJECT_BIBLE.md`
2. update `TODO.md`
3. list any missing or weak items
4. fix obvious gaps
5. commit final polish pass

---

## Phase Exit Rules

No phase should begin before the previous phase is stable enough to support it.

For example:

* the envelope should not be built before the meadow base is stable
* the first letter should not be built before the envelope works
* the audio and second letter should not be built before the scene flow can hand off cleanly
* Easter eggs should not be added before the main story works

This keeps the project intact.