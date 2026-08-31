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
  'For someone who makes every ordinary days feel extraordinary.';

/**
 * Tiny handwritten-style loading line shown below the opening scene's two
 * focal flowers. Only ONE of these shows per visit (picked at random) —
 * this is the entire "loading indicator", deliberately not a spinner, bar,
 * or percentage. Add/remove lines freely.
 */
export const loadingMessages: LoadingMessage[] = [
  { id: 'loading-1', text: 'planting a few secrets among the daisies…' },
  { id: 'loading-2', text: 'not every daisy is the same…' },
  { id: 'loading-3', text: 'glowing flowers are special…' },
  { id: 'loading-4', text: 'pop the bubbles!' },
  { id: 'loading-5', text: 'winding up a little clock somewhere nearby…' },
  { id: 'loading-6', text: 'tap the flowers… and find a secret or two…' },
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
  scratchMessages: [
    'whoa there, DJ Issu!',
    "let's leave the scratching to the professionals",
    'the record is ticklish',
    'okay, DJ. save some vinyl for the song',
  ],
};

/**
 * Shown if Letter Two's lantern finishes before the meadow's own moon has
 * fully settled in place — see `NightSkyScene.tsx`, which waits for that
 * rather than forcing it.
 */
export const waitingForMoonMessage = 'wait for the moon to be here, my moon.';

/**
 * The small line that fades in at the very end of the night-sky ending,
 * once the constellation and the fireflies have both settled — see
 * `NightSkyScene.tsx`.
 */
export const closingMessage = 'Thank you for spending today with me :)';
