// Date/time rendering for the app.
//
// Contract with the backend (see the timezone middleware): every timestamp is
// stored and returned in UTC, and every request carries an `x-timezone` header
// with this device's IANA zone so server-computed day grouping/labels match
// what the user sees. Here we only ever render in device-local time — never
// hardcode an offset, and always send date-picker values as `YYYY-MM-DD`.

import { intlLocale, t } from '@/i18n';

export const deviceTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
};

// Backend occasionally emits bare (non-Z) ISO strings; treat those as UTC.
export const parseDate = (value?: string | number | Date | null): Date | null => {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') return new Date(value);

  const normalized =
    /^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(value) ? `${value}Z` : value;
  const d = new Date(normalized);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDate = (
  value?: string | Date | null,
  options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' },
): string => {
  const d = parseDate(value);
  return d ? d.toLocaleDateString(intlLocale(), options) : '';
};

export const formatTime = (value?: string | Date | null): string => {
  const d = parseDate(value);
  return d ? d.toLocaleTimeString(intlLocale(), { hour: '2-digit', minute: '2-digit' }) : '';
};

export const formatDateTime = (value?: string | Date | null): string => {
  const d = parseDate(value);
  if (!d) return '';
  return `${formatDate(d)} · ${formatTime(d)}`;
};

// "HH:mm" / "HH:mm:ss" → localized clock label. Backend stores schedule
// check-in/out as plain wall-clock strings, so they are shown as-is.
export const formatClock = (hhmm?: string | null): string => {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':');
  if (h === undefined || m === undefined) return hhmm;
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
};

const clockMinutes = (hhmm: string): number | null => {
  const [h, m] = hhmm.split(':').map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};

/**
 * The cleaner's slot, earliest time first: arrival (the guest has left) then
 * departure (before the next guest arrives). Schedules have been stored with
 * `checkInTime` / `checkOutTime` in both orders, so the two values are ordered
 * by clock time rather than trusted by field name — a cleaning never runs
 * past midnight, so the earlier time is always the arrival.
 */
export const cleaningWindow = (
  a?: string | null,
  b?: string | null,
): { arrival: string; departure: string } => {
  const first = formatClock(a);
  const second = formatClock(b);
  const firstMin = first ? clockMinutes(first) : null;
  const secondMin = second ? clockMinutes(second) : null;
  if (firstMin !== null && secondMin !== null && secondMin < firstMin) {
    return { arrival: second, departure: first };
  }
  return { arrival: first, departure: second };
};

/** "10:00 – 14:00" — arrival first, whatever order the fields came in. */
export const formatCleaningWindow = (
  a?: string | null,
  b?: string | null,
  separator = ' – ',
): string => {
  const { arrival, departure } = cleaningWindow(a, b);
  return [arrival, departure].filter(Boolean).join(separator);
};

/** Length of the slot in hours (one decimal), or null when it cannot be read. */
export const cleaningHours = (a?: string | null, b?: string | null): number | null => {
  const { arrival, departure } = cleaningWindow(a, b);
  const start = arrival ? clockMinutes(arrival) : null;
  const end = departure ? clockMinutes(departure) : null;
  if (start === null || end === null || end <= start) return null;
  return Math.round(((end - start) / 60) * 10) / 10;
};

/**
 * A "YYYY-MM-DD" day key rendered in the app's language ("samedi 19 septembre").
 * Built from local date parts — parsing the key as a timestamp would read it
 * as UTC midnight and show the previous day west of Greenwich.
 */
export const formatDayKey = (
  key?: string | null,
  options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' },
  locale: string = intlLocale(),
): string => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(key ?? '');
  if (!match) return '';
  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return date.toLocaleDateString(locale, options);
};

// Date → "YYYY-MM-DD" in device-local terms (what the backend expects for
// schedule dates; it resolves them against the x-timezone header).
export const toDateKey = (value: Date | string): string => {
  const d = parseDate(value);
  if (!d) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const relativeFromNow = (value?: string | Date | null): string => {
  const d = parseDate(value);
  if (!d) return '';
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return t('Just now');
  if (mins < 60) return t('{n}m ago', { n: mins });
  const hours = Math.round(mins / 60);
  if (hours < 24) return t('{n}h ago', { n: hours });
  const days = Math.round(hours / 24);
  if (days < 7) return t('{n}d ago', { n: days });
  return formatDate(d);
};
