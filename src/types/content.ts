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

/** Ambient background sound — no music, just soft atmosphere. */
export interface AmbientAudioConfig {
  src: string;
  /** 0-1, how loud it gets once faded in. Keep this low — "almost silent" per the spec. */
  volume?: number;
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

/** A single photo reference used inside letters / meadow / memories. */
export interface PhotoEntry {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Display text for the "Our Time" Easter egg (live relationship timer +
 * Pakistan/Philippines clocks). Kept separate from `ButtonLabels` since
 * this is one self-contained Easter egg's copy, not a reusable control.
 */
export interface OurTimeLabels {
  title: string;
  /** Small romantic framing line above the "here" clock. */
  hereLabel: string;
  /** Small romantic framing line above the "there" clock. */
  thereLabel: string;
  /** Which entry of `timezones` (from timeline.ts) is "here". */
  hereTimezoneKey: string;
  /** Which entry of `timezones` (from timeline.ts) is "there". */
  thereTimezoneKey: string;
  /** Display name shown next to the "here" clock, e.g. "Pakistan". */
  hereName: string;
  /** Display name shown next to the "there" clock, e.g. "Philippines". */
  thereName: string;
  /** Line introducing the live duration count, e.g. "we've been ours for". */
  durationIntro: string;
}

/**
 * Copy for the "Only You" password-gate Easter egg, hidden in Letter
 * Two. Names themselves aren't duplicated here — the correct/sender
 * replies are composed at render time from `siteIdentity`, so editing
 * the two names there is still the only thing that needs to change.
 */
export interface PasswordGateContent {
  title: string;
  question: string;
  placeholder: string;
  submitLabel: string;
  /**
   * Accepted answers (case-insensitive, whitespace-trimmed) — every
   * name/nickname that should count as "correct". Doesn't need to
   * include every possible spelling; add more here any time.
   */
  correctAnswers: string[];
  /**
   * Names that get their own playful "nice try" hint instead of the
   * generic wrong-answer one (case-insensitive, whitespace-trimmed).
   * Still treated as an ordinary wrong answer otherwise — the input
   * stays open, nothing gets replaced.
   */
  senderAliases: string[];
  correctHeading: string;
  /** Shown under the heading if she enters her own name. */
  correctBody: string;
  /** Inline hint shown if he (or a nickname of his) is entered. */
  senderReplyMessage: string;
  /**
   * Label for the small "skip" button that appears after two wrong
   * answers, letting her bypass the gate instead of being stuck.
   */
  chickenOutLabel: string;
  /** Inline hint shown for any other wrong answer — gentle, not a scold. */
  genericReplyBody: string;
}

/**
 * Copy for the "He Loves Me... He Loves Me More" rigged daisy-plucking
 * Easter egg. `results` is shown after every petal is plucked — one
 * is picked at random. This must stay a positive/romantic/funny line;
 * the whole point of the game is that it's rigged to never land
 * anywhere else.
 */
export interface DaisyGameContent {
  prompt: string;
  /**
   * Shown one at a time as each petal (except the last) is plucked,
   * cycling in order and repeating if there are more petals than
   * lines — always positive, escalating in warmth.
   */
  petalMessages: string[];
  results: string[];
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
  /** The final control on Letter Two — triggers the lantern transition into the night-sky ending. */
  oneLastThing: string;
  /** The envelope's "continue" control, once opened — leads into Letter One. */
  readMyMind: string;
  /** Letter One's "continue" control — leads into the audio scene. */
  hearMyVoice: string;
  /** The audio scene's "continue" control — leads into Letter Two. */
  someThingsToSay: string;
  /** One of the three closing controls in the night-sky ending's closing state. */
  keepMyVoice: string;
  /** The meadow's own entry prompt, shown on its "step into the meadow" control. */
  enterMeadow: string;
  /** Cute prompt text shown directly on the closed envelope, inviting the tap. */
  envelopeInvite: string;
  /** Aria label for the vinyl record — a scratch toy, not a play/pause control. */
  scratchRecord: string;
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
  /**
   * Playful lines shown for a moment when she drags/swipes across the
   * spinning record (the "DJ scratch" Easter egg). One is picked at
   * random each time. Optional — the scratch effect itself still works
   * without any messages configured.
   */
  scratchMessages?: string[];
}
