Drop extra files here that should download alongside the letters PDF
when the "download our letters" button is pressed — e.g. your lyrics
PDF.

1. Put the file in this folder (e.g. `lyrics.pdf`).
2. Register it in `src/content/downloads.ts` (see the example entries
   commented out there) with the exact file name you used.

Files placed here but NOT listed in `src/content/downloads.ts` are
just quietly ignored — they won't be downloaded, and nothing breaks.

This README itself is harmless to leave here — it's never referenced
by the app, so it's never downloaded.
