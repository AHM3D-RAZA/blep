import type { SiteIdentity, LoadingMessage, AudioConfig } from '../types/content';

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
 * Poetic loading messages shown while the loading scene is active.
 * No spinner, no percentage — the loading scene should cycle through
 * these lines instead. Add/remove freely.
 */
export const loadingMessages: LoadingMessage[] = [
  { id: 'loading-1', text: 'planting a few daisies…' },
  { id: 'loading-2', text: 'waking up the sunflowers…' },
  { id: 'loading-3', text: 'warming the morning light…' },
];

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
