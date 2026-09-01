import type { TimelineEntry, OurTimeLabels } from '../types/content';

/**
 * Relationship milestones shown in the "Our Time" Easter egg's
 * timeline, in chronological order. Each entry is fully self-contained
 * and safe to edit:
 *   - `dateLabel` / `timeLabel` are freeform display strings (not
 *     parsed dates), so you can write them however reads nicest.
 *   - Leave `dateLabel`/`timeLabel` out and set `pending: true` for a
 *     milestone whose date/time you don't know yet — it'll show a
 *     gentle "to be added" placeholder instead, and nothing else
 *     breaks. That's exactly what entry `timeline-3` below does; once
 *     you know the date/time, just fill in `dateLabel`/`timeLabel` and
 *     delete the `pending: true` line.
 *   - `description` is optional — a short line under the title, for
 *     if you ever want to add a bit more to a moment.
 * Add, remove, or reorder entries freely; the timeline just renders
 * whatever's in this array, top to bottom.
 */
export const timeline: TimelineEntry[] = [
  {
    id: 'timeline-1',
    dateLabel: '3rd February 2026',
    timeLabel: '12:00 AM',
    title: 'When We Met',
  },
  {
    id: 'timeline-2',
    dateLabel: '29th April 2026',
    timeLabel: '5:08 PM',
    title: "You Used 'Rassa' for us for the First Time",
  },
  {
    id: 'timeline-3',
    title: "I called you by saying 'My' for the First Time",
    // Date/time not decided yet — fill these in and remove the
    // `pending` line below whenever it's figured out:
    // dateLabel: '',
    // timeLabel: '',
    pending: true,
  },
  {
    id: 'timeline-4',
    dateLabel: '27th May 2026',
    timeLabel: '9:00 PM',
    title: 'The Confession',
  },
];

/**
 * Relationship start date, used by the live relationship timer Easter egg.
 * ISO 8601 format, interpreted in `relationshipStartTimezone`. Set to
 * the moment from `timeline-1` above (when we met).
 */
export const relationshipStartDate = '2026-02-03T00:00:00';
export const relationshipStartTimezone = 'Asia/Karachi';

/**
 * IANA timezone identifiers for the live time display Easter egg.
 * Kept as a config map so the timer logic never hardcodes timezone strings.
 */
export const timezones = {
  pakistan: 'Asia/Karachi',
  philippines: 'Asia/Manila',
} as const;

/**
 * Display copy for the "Our Time" Easter egg (hidden near Letter One).
 * `hereTimezoneKey`/`thereTimezoneKey` must match keys in `timezones`
 * above. Everything here is safe to edit freely.
 */
export const ourTimeLabels: OurTimeLabels = {
  title: 'RASSA CLOCK',
  hereLabel: "I'm here...",
  thereLabel: "while you're there...",
  hereTimezoneKey: 'pakistan',
  thereTimezoneKey: 'philippines',
  hereName: 'Pakistan',
  thereName: 'Philippines',
  durationIntro: "we've been RASSA for",
};
