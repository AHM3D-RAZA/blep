/**
 * Turns a word into a set of grid points using a small hand-drawn 5×7
 * dot-matrix font — used to lay out where individual stars/fireflies
 * should move to so they physically spell something out, instead of
 * ever rendering the word as real typography (see `ConstellationStars`
 * and `FireflyName`).
 */

const FONT_5X7: Record<string, string[]> = {
  I: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '#####'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
};

const GLYPH_WIDTH = 5;
const GLYPH_HEIGHT = 7;
const LETTER_GAP = 1;
const SPACE_WIDTH = 3;

/**
 * A pure, deterministic stand-in for Math.random(), seeded by index.
 * Render must stay pure (no Math.random) — this gives scattered-looking
 * but reproducible values instead. Returns a value in [0, 1).
 */
export function pseudoRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export interface GridPoint {
  x: number;
  y: number;
}

/** Raw grid-space points (integer columns/rows) for an upper-case word. */
function wordToGridPoints(word: string): { points: GridPoint[]; width: number; height: number } {
  const points: GridPoint[] = [];
  let cursor = 0;

  for (const char of word.toUpperCase()) {
    if (char === ' ') {
      cursor += SPACE_WIDTH;
      continue;
    }
    const glyph = FONT_5X7[char];
    if (!glyph) {
      cursor += GLYPH_WIDTH + LETTER_GAP;
      continue;
    }
    glyph.forEach((row, rowIndex) => {
      row.split('').forEach((cell, colIndex) => {
        if (cell === '#') {
          points.push({ x: cursor + colIndex, y: rowIndex });
        }
      });
    });
    cursor += GLYPH_WIDTH + LETTER_GAP;
  }

  return { points, width: Math.max(cursor - LETTER_GAP, 1), height: GLYPH_HEIGHT };
}

export interface PercentPoint {
  xPercent: number;
  yPercent: number;
  /** A per-point size/brightness multiplier (0.6–1.5ish) so points read as real stars of varying magnitude, not a uniform grid. */
  scale: number;
}

/**
 * Lays a word out as percentage coordinates within a bounding box
 * (itself given as percentages of whatever container renders it), so
 * the result can be used directly as CSS `left`/`top`. Aspect ratio of
 * the letters is preserved — the box's width or height is used as the
 * limiting dimension rather than stretching the font.
 *
 * Each point gets a small random offset and a random size — a raw grid
 * of evenly-spaced, evenly-sized dots reads as printed text; real stars
 * (and constellations) are never that regular. `jitterFactor` is the
 * offset's max size as a fraction of the grid cell — kept modest so the
 * shape stays legible rather than dissolving into noise. `keepRatio` is
 * the fraction of the raster's points kept before scattering — a denser
 * word (more letters, more strokes, like "I LOVE YOU") needs a lower
 * ratio than a short one to avoid reading as a printed grid.
 */
export function wordToPercentPoints(
  word: string,
  box: { leftPercent: number; topPercent: number; widthPercent: number; heightPercent: number },
  jitterFactor = 0.2,
  keepRatio = 0.8,
): PercentPoint[] {
  const { points: rawPoints, width, height } = wordToGridPoints(word);
  // A filled dot-matrix raster reads as printed text no matter how much
  // it's jittered afterward — real constellations are sparse. Thinned
  // down a little (deterministically, so the shape is stable across
  // renders) before scattering what's left.
  const points = rawPoints.filter((_, i) => pseudoRandom(i * 3.7 + 500) < keepRatio);
  const cellFromWidth = box.widthPercent / width;
  const cellFromHeight = box.heightPercent / height;
  const cell = Math.min(cellFromWidth, cellFromHeight);
  const usedWidth = width * cell;
  const usedHeight = height * cell;
  const offsetX = box.leftPercent + (box.widthPercent - usedWidth) / 2;
  const offsetY = box.topPercent + (box.heightPercent - usedHeight) / 2;

  return points.map((p, i) => {
    const jitterX = (pseudoRandom(i * 7.13 + 1) - 0.5) * 2 * cell * jitterFactor;
    const jitterY = (pseudoRandom(i * 7.13 + 2) - 0.5) * 2 * cell * jitterFactor;
    const scale = 0.78 + pseudoRandom(i * 7.13 + 3) * 0.55;
    return {
      xPercent: offsetX + p.x * cell + jitterX,
      yPercent: offsetY + p.y * cell + jitterY,
      scale,
    };
  });
}
