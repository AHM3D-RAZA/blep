/**
 * Shared content contracts.
 *
 * Every file in `src/content/` implements one or more of these shapes.
 * Later modules should only ever need to import types from here + the
 * relevant `src/content/*.ts` file — never redefine content shapes locally.
 */

/** Names and other site-wide identity info. */
export interface SiteIdentity {
  recipientName: string;
  senderName: string;
  tagline: string;
}

/** A single poetic loading message shown while the app boots. */
export interface LoadingMessage {
  id: string;
  text: string;
}

/** One page/section of a letter scene. */
export interface LetterPageContent {
  id: string;
  heading?: string;
  body: string[];
}

/** Full content for a letter scene (letterOne / letterTwo). */
export interface LetterContent {
  id: 'letterOne' | 'letterTwo';
  title: string;
  pages: LetterPageContent[];
}

/** A single compliment line, used for compliment-driven scenes/eggs. */
export interface ComplimentEntry {
  id: string;
  text: string;
}

/** A single memory bubble / memory snippet. */
export interface MemoryEntry {
  id: string;
  title: string;
  description: string;
  date?: string;
}

/** A single timeline/relationship milestone. */
export interface TimelineEntry {
  id: string;
  date: string;
  title: string;
  description?: string;
}

/** A single Easter egg's display text (not its trigger logic). */
export interface EasterEggEntry {
  id: string;
  label: string;
  text: string;
}

/** A single photo reference used inside letters / meadow / memories. */
export interface PhotoEntry {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

/** Labels for all reusable buttons/controls across the app. */
export interface ButtonLabels {
  continue: string;
  next: string;
  replay: string;
  download: string;
  visitAgain: string;
  openEnvelope: string;
  play: string;
  pause: string;
  explore: string;
  skip: string;
  /** Label for the control that leaves letter two toward the Promise Tree ending. */
  toPromiseTree: string;
}

/** Audio asset configuration for the audio scene. */
export interface AudioConfig {
  src: string;
  title: string;
  credit?: string;
  /** Small line under the title, e.g. who it's from / what it is. */
  subtitle?: string;
  /** File name suggested for the download button. */
  downloadFileName?: string;
}
