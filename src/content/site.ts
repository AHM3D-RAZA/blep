import type { SiteIdentity, LoadingMessage, AudioConfig, AmbientAudioConfig } from '../types/content';

/**
 * Core identity used across the whole experience.
 * Edit these two names and nothing else needs to change anywhere in the app.
 */
export const siteIdentity: SiteIdentity = {
  recipientName: 'Issu',
  senderName: 'Razey',
  tagline: 'a small meadow, made for you',
};

/**
 * The single sentence shown once, centered, during the opening scene —
 * fades in, holds, fades away. Not a headline; small and elegant, per the
 * opening-scene spec. Edit freely, but keep it to one sentence.
 */
export const openingLine =
  'For someone who makes every ordinary day feel extraordinary.';

/**
 * Tiny handwritten-style loading line shown below the opening scene's two
 * focal flowers. Only ONE of these shows per visit (picked at random) —
 * this is the entire "loading indicator", deliberately not a spinner, bar,
 * or percentage. Add/remove lines freely.
 */
export const loadingMessages: LoadingMessage[] = [
  { id: 'loading-1', text: 'planting a few daisies…' },
  { id: 'loading-2', text: 'waking up the sunflowers…' },
  { id: 'loading-3', text: 'warming the morning light…' },
];

/**
 * Ambient sound for the opening scene only — soft wind, distant birds,
 * morning quiet. No music, per the opening-scene spec. `src` is a
 * placeholder path — drop the real file into `public/audio/` (see the
 * comment on the file itself for format/content recommendations) and
 * update this path if you name it differently, no code changes needed.
 */
export const openingAmbience: AmbientAudioConfig = {
  src: '/audio/opening-ambience.mp3',
  volume: 0.18,
};

/**
 * Audio scene configuration. `src` is a placeholder path — drop the real
 * file into `public/audio/` and update the path, no code changes needed.
 */
export const audioConfig: AudioConfig = {
  src: '/audio/letter-song.mp3',
  title: 'a song for you',
  subtitle: 'press play, and come sit with me a while',
  downloadFileName: 'a-song-for-issu.mp3',
};

/**
 * Shown if Letter Two's lantern finishes before the meadow's own moon has
 * fully settled in place — see `NightSkyScene.tsx`, which waits for that
 * rather than forcing it.
 */
export const waitingForMoonMessage = 'wait for the moon to be here, my moon.';

/**
 * The small line that fades in at the very end of the night-sky ending,
 * once the constellation, the fireflies, and the shooting star have all
 * finished — see `NightSkyScene.tsx`.
 */
export const closingMessage = 'Thank you for spending today with me.';

/**
 * Short lines revealed if the shooting star at the end of the night-sky
 * ending is tapped in time — one is picked at random each time. Kept
 * short on purpose; see `ShootingStar.tsx`.
 */
export const shootingStarMessages: string[] = [
  "And I'd choose you again.",
  'In every lifetime.',
  "You'll always be my favorite person.",
];
