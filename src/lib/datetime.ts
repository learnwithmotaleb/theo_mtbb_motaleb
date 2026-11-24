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
 * Extracts the host's configured cleaning duration from the accommodation or mission.
 * In property onboarding, the host chooses an average duration (e.g. '1h00', '1h30', '2h00', '2h30')
 * which is saved in `instructions` as "Average cleaning duration: 2h00" (or in notes/cleaningDuration).
 * Normalizes e.g. "2h00" to "2h", while keeping "2h30" as "2h30".
 */
/** "2h30" / "2h" / "2h00" -> 150 / 120 / 120 minutes; anything else -> null. */
export const durationToMinutes = (value?: string | null): number | null => {
  const match = /(\d+)\s*h\s*(\d{1,2})?/i.exec(value ?? '');
  if (!match) return null;
  const minutes = Number(match[1]) * 60 + Number(match[2] ?? 0);
  return minutes > 0 ? minutes : null;
};

/** 120 -> "2h", 150 -> "2h30", 45 -> "45 min". */
export const formatDurationMinutes = (minutes?: number | null): string => {
  const total = Math.round(Number(minutes));
  if (!total || total <= 0) return '';
  const h = Math.floor(total / 60);
  const m = total % 60;
  if (!h) return `${m} min`;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
};

/**
 * The cleaning time the host entered, for the cleaner's cards. Order:
 *  1. backend `estimationMinutes` when it comes from the host's duration
 *  2. `accommodation.cleaningDuration` (minutes)
 *  3. the legacy "Average cleaning duration: 2h30" text
 * Never the arrival–departure window: that is shown separately and is not
 * how long the cleaning takes. Unknown -> "—".
 */
export const cleaningEstimate = (accommodation?: any, mission?: any): string => {
  if (mission?.estimationSource === 'cleaning_duration' && mission?.estimationMinutes) {
    return formatDurationMinutes(mission.estimationMinutes);
  }
  const fromField = formatDurationMinutes(accommodation?.cleaningDuration);
  if (fromField) return fromField;
  return extractCleaningDuration(accommodation, mission) ?? '—';
};

export const extractCleaningDuration = (
  accommodation?: any,
  mission?: any,
): string | null => {
  // 0. The real field: a number of minutes (backend `cleaningDuration`).
  if (typeof accommodation?.cleaningDuration === 'number') {
    return formatDurationMinutes(accommodation.cleaningDuration) || null;
  }

  // 1. Direct duration properties if available
  const direct =
    accommodation?.cleaningDuration ??
    accommodation?.averageDuration ??
    accommodation?.duration ??
    mission?.cleaningDuration ??
    mission?.duration;

  if (direct) {
    const s = String(direct).trim();
    if (/^\d+h00$/i.test(s)) return s.replace(/h00$/i, 'h');
    return s;
  }

  // 2. Check instructions or notes (set during onboarding / property creation)
  const textCandidates = [
    accommodation?.instructions,
    accommodation?.notes,
    mission?.notes,
  ].filter(Boolean).join(' ');

  if (textCandidates) {
    // Matches e.g. "Average cleaning duration: 2h00" or "Durée moyenne du ménage: 2h00" or "2h00", "2h30", "2h"
    const match = /(?:average\s+cleaning\s+duration|durée\s+moyenne\s+du\s+ménage|duration|durée)?[:\s]*(\d+h(?:\d{2})?)/i.exec(textCandidates);
    if (match && match[1]) {
      const val = match[1];
      if (/^\d+h00$/i.test(val)) {
        return val.replace(/h00$/i, 'h');
      }
      return val;
    }

    const hourMatch = /(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|h)\b/i.exec(textCandidates);
    if (hourMatch && hourMatch[1]) {
      return `${hourMatch[1]}h`;
    }
  }

  return null;
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
  if (locale.startsWith('fr')) return formatFrenchDate(date, options);
  return date.toLocaleDateString(locale, options);
};

// French names spelled out here: on some phones the JS date formatter ignores
// the requested locale and follows the device language, which showed
// "Monday 5 October" inside the French app.
const FR_WEEKDAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
const FR_MONTHS = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];
const FR_MONTHS_SHORT = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

/** "lundi 5 octobre 2026", honouring the weekday / day / month / year options. */
const formatFrenchDate = (date: Date, options: Intl.DateTimeFormatOptions): string => {
  const parts: string[] = [];
  if (options.weekday) {
    const name = FR_WEEKDAYS[date.getDay()];
    parts.push(options.weekday === 'long' ? name : `${name.slice(0, 3)}.`);
  }
  if (options.day) {
    parts.push(options.day === '2-digit' ? String(date.getDate()).padStart(2, '0') : String(date.getDate()));
  }
  if (options.month) {
    parts.push(
      options.month === 'long'
        ? FR_MONTHS[date.getMonth()]
        : options.month === 'short'
          ? FR_MONTHS_SHORT[date.getMonth()]
          : String(date.getMonth() + 1).padStart(2, '0'),
    );
  }
  if (options.year) parts.push(String(date.getFullYear()));
  return parts.join(' ');
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
