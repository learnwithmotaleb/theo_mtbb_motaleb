// City search and postal-code checks against the French government's public
// geo API (https://geo.api.gouv.fr — free, no key, covers every commune).
//
// Every call is time-boxed: a slow or unreachable service must never leave the
// property form stuck, so callers get a distinct 'unavailable' outcome and can
// fall back to a format-only check.

const GEO_API = 'https://geo.api.gouv.fr/communes';
const TIMEOUT_MS = 8000;

export interface Commune {
  name: string;
  postalCodes: string[];
  /** Département code, e.g. "74" — disambiguates homonyms in the list. */
  department: string;
}

/** The five quick picks shown before the host starts typing. */
export const POPULAR_CITIES: Commune[] = [
  { name: 'Paris', department: '75', postalCodes: [] },
  { name: 'Lyon', department: '69', postalCodes: [] },
  { name: 'Marseille', department: '13', postalCodes: [] },
  { name: 'Bordeaux', department: '33', postalCodes: [] },
  { name: 'Toulouse', department: '31', postalCodes: [] },
];

export const POSTAL_CODE_PATTERN = /^\d{5}$/;

/** "Saint-Étienne" and "st etienne" compare equal. */
const stripAccents = (value: string): string => {
  try {
    return value.normalize('NFD').replace(/[̀-ͯ]/g, '');
  } catch {
    return value; // engine without Unicode normalization
  }
};

export const normalizeCityName = (value: string): string =>
  stripAccents(value)
    .toLowerCase()
    .replace(/[-'’]/g, ' ')
    .replace(/\bste\b/g, 'sainte')
    .replace(/\bst\b/g, 'saint')
    .replace(/\s+/g, ' ')
    .trim();

const fetchJson = async (url: string, signal?: AbortSignal): Promise<any> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`geo api ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
};

const toCommune = (row: any): Commune => ({
  name: String(row?.nom ?? ''),
  postalCodes: Array.isArray(row?.codesPostaux) ? row.codesPostaux.map(String) : [],
  department: String(row?.codeDepartement ?? ''),
});

/** Communes whose name matches what the host typed, biggest first. */
export const searchCommunes = async (
  query: string,
  signal?: AbortSignal,
): Promise<Commune[]> => {
  const q = query.trim();
  if (q.length < 2) return [];
  const url =
    `${GEO_API}?nom=${encodeURIComponent(q)}` +
    '&fields=nom,codesPostaux,codeDepartement&boost=population&limit=8';
  const rows = await fetchJson(url, signal);
  return (Array.isArray(rows) ? rows : []).map(toCommune).filter((c) => c.name);
};

/** Communes served by a postal code (one code can cover several villages). */
export const communesForPostalCode = async (
  postalCode: string,
  signal?: AbortSignal,
): Promise<Commune[]> => {
  const url =
    `${GEO_API}?codePostal=${encodeURIComponent(postalCode)}` +
    '&fields=nom,codesPostaux,codeDepartement';
  const rows = await fetchJson(url, signal);
  return (Array.isArray(rows) ? rows : []).map(toCommune);
};

export type PostalCheck =
  | 'ok'
  | 'invalid_format'
  | 'unknown_postal_code'
  | 'mismatch'
  /** The geo service could not be reached — only the format was checked. */
  | 'unavailable';

/**
 * Does `postalCode` belong to `city`? When the city was picked from the
 * suggestions its codes are already known and no request is made.
 */
export const checkPostalCode = async (
  city: string,
  postalCode: string,
  knownCodes?: string[],
): Promise<PostalCheck> => {
  const zip = postalCode.trim();
  if (!POSTAL_CODE_PATTERN.test(zip)) return 'invalid_format';
  if (knownCodes && knownCodes.length > 0) {
    return knownCodes.includes(zip) ? 'ok' : 'mismatch';
  }
  try {
    const communes = await communesForPostalCode(zip);
    if (communes.length === 0) return 'unknown_postal_code';
    const wanted = normalizeCityName(city);
    return communes.some((c) => normalizeCityName(c.name) === wanted) ? 'ok' : 'mismatch';
  } catch {
    return 'unavailable';
  }
};
