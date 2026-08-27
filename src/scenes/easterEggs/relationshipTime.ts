/**
 * Timezone-aware helpers for the "Our Time" Easter egg. No hardcoded
 * offsets or fixed "current" time anywhere here — everything is derived
 * live from `Date.now()` plus the IANA timezone strings in
 * `content/timeline.ts`, so it stays correct indefinitely (including
 * across DST changes for zones that observe it).
 */

/**
 * Converts a "wall clock" date/time string (e.g. `2024-01-01T00:00:00`,
 * with no zone offset) into the actual UTC instant it represents *in*
 * the given IANA timezone. Standard trick: format the naive timestamp
 * as if it were UTC, compare that to how the same instant reads in the
 * target zone, and use the difference as the correction.
 */
export function zonedTimeToInstant(dateTimeLocal: string, timeZone: string): Date {
  const naiveUtc = new Date(`${dateTimeLocal}Z`);
  const asTargetZone = new Date(naiveUtc.toLocaleString('en-US', { timeZone }));
  const asUtc = new Date(naiveUtc.toLocaleString('en-US', { timeZone: 'UTC' }));
  const offsetMs = asUtc.getTime() - asTargetZone.getTime();
  return new Date(naiveUtc.getTime() + offsetMs);
}

/** Formats the current time in a given IANA timezone, e.g. "10:42:07 PM". */
export function formatZonedTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(date);
}

/** Formats the current date in a given IANA timezone, e.g. "Thu, Aug 20". */
export function formatZonedDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export interface Duration {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

/** Breaks an elapsed millisecond count into days/hours/minutes/seconds. */
export function toDuration(elapsedMs: number): Duration {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

/** "412 days, 14:23:07" — exact and readable, ticking to the second. */
export function formatDuration({ days, hours, minutes, seconds }: Duration): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const dayLabel = days === 1 ? 'day' : 'days';
  return `${days} ${dayLabel}, ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
