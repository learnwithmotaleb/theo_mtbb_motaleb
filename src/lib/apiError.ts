// RTK Query surfaces errors as either a FetchBaseQueryError (with the backend's
// JSON envelope in `data`) or a SerializedError. One helper so every screen
// shows the backend's own message instead of "[object Object]".

import { getActiveLocale, t } from '@/i18n';

export const getApiErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  if (!error) return fallback;

  const err = error as {
    data?: { message?: string; errorMessages?: { message?: string }[] };
    error?: string;
    message?: string;
    status?: number | string;
  };

  const first = err.data?.errorMessages?.[0]?.message;
  const rawMsg = first || err.data?.message;
  if (rawMsg) {
    if (rawMsg === 'Request already accepted') return 'Cette demande a déjà été acceptée.';
    if (rawMsg === 'Assignment not found') return 'Affectation introuvable.';
    return t(rawMsg);
  }
  if (err.status === 'FETCH_ERROR') return t('Network error — check your connection.');
  if (err.message) return t(err.message);
  if (typeof err.error === 'string') return t(err.error);
  return fallback;
};

/** Auth screens use a localized fallback for uncatalogued server messages. */
export const getLocalizedAuthErrorMessage = (error: unknown, fallback: string): string => {
  const message = getApiErrorMessage(error, fallback);
  const translated = t(message);
  return getActiveLocale() === 'fr' && translated === message ? fallback : translated;
};
