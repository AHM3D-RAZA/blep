import type { ExtraDownload } from '../types/content';

/**
 * Extra files sent along with the letters PDF when the "download our
 * letters" button (in the night-sky ending, see `NightSkyScene.tsx`)
 * is pressed — e.g. a lyrics sheet.
 *
 * To add one:
 *   1. Drop the actual PDF file into `public/downloads/` (create the
 *      folder if it isn't there — same place `public/audio/` lives).
 *   2. Add an entry below with that exact file name.
 *
 * That's it — nothing else needs to change. Every entry here is
 * downloaded automatically alongside the letters PDF, in the order
 * listed. Remove an entry (or comment it out) to stop sending that
 * file without deleting it from the folder.
 */
export const extraDownloads: ExtraDownload[] = [
  // { id: 'lyrics', fileName: 'lyrics.pdf', downloadName: 'lyrics.pdf' },
  // { id: 'keepsake', fileName: 'keepsake.pdf', downloadName: 'keepsake.pdf' },
];
