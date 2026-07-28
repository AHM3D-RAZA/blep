import type { PhotoEntry } from '../types/content';

/**
 * Photos embedded in letters/meadow/memories. Drop real files into
 * `src/assets/photos/` (or `public/photos/`) and update `src` — no
 * component code should ever reference a photo path directly.
 */
export const photos: PhotoEntry[] = [
  {
    id: 'photo-1',
    src: '/photos/placeholder-1.jpg',
    alt: '[ photo description placeholder ]',
  },
];
