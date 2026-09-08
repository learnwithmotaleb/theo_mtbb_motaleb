import { useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useSelector } from 'react-redux';

import type { Locale } from '@/redux/slices/localeSlice';
import { deviceLocale } from '@/redux/slices/localeSlice';
import { fr } from './fr';

export const LOCALE_KEY = 'gestlio_locale';

/**
 * Catalogs are keyed by the English copy itself, not by invented ids. A string
 * with no translation yet falls through to the English it was written in, so a
 * screen the translator has not reached still reads fine instead of showing
 * something like `profile.language.title`.
 */
const CATALOGS: Record<Locale, Record<string, string>> = {
  en: {},
  fr,
};

/**
 * The active locale is held in a module variable so `t()` can be called from
 * anywhere — helper functions, mappers, `showToast` arguments — not just from
 * inside a component. `LocaleProvider` keeps it in sync with the store.
 *
 * Components must NOT use this module-level `t`: reading mutable module state
 * during render breaks the Rules of React, and the React Compiler (enabled in
 * app.json) rightly caches `t("Home")` forever because nothing reactive feeds
 * it. Components call `useT()` instead — see below.
 */
let activeLocale: Locale = deviceLocale();

export const setActiveLocale = (locale: Locale) => {
  activeLocale = locale;
};

export const getActiveLocale = (): Locale => activeLocale;

/** `{name}` placeholders are filled from `vars`. */
const interpolate = (text: string, vars?: Record<string, string | number>) => {
  if (!vars) return text;
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    key in vars ? String(vars[key]) : match,
  );
};

/** The shape of `t`, for helpers that take it as an argument. */
export type Translate = (
  text: string,
  vars?: Record<string, string | number>,
) => string;

export const t: Translate = (text, vars) =>
  interpolate(CATALOGS[activeLocale]?.[text] ?? text, vars);

/** BCP 47 tag for `Intl` formatting (dates, currency). */
export const intlLocale = (): string => (activeLocale === 'fr' ? 'fr-FR' : 'en-GB');

/**
 * The translator for use inside components: `const t = useT();`.
 *
 * It returns a *new function identity* whenever the language changes, and that
 * is the whole point. The React Compiler memoises by dependency, so a call to
 * the module-level `t()` — whose arguments are constant strings — is compiled
 * into a cache slot that is filled once and never recomputed, freezing the
 * screen in whatever language it first rendered in. Depending on this `t`
 * instead puts the locale into every one of those cache keys, so switching the
 * language invalidates them and the screen re-renders in full.
 *
 * Nested components need their own `useT()`; a parent re-render does not clear
 * a child's cache slots.
 */
export const useT = (): Translate => {
  const locale = useSelector(
    (state: { locale: { locale: Locale } }) => state.locale.locale,
  );
  return useMemo(
    () =>
      (text: string, vars?: Record<string, string | number>): string =>
        interpolate(CATALOGS[locale]?.[text] ?? text, vars),
    [locale],
  );
};

/** `Intl` tag bound to the language, for use inside components. */
export const useIntlLocale = (): string => {
  const locale = useSelector(
    (state: { locale: { locale: Locale } }) => state.locale.locale,
  );
  return locale === 'fr' ? 'fr-FR' : 'en-GB';
};

export const readStoredLocale = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(LOCALE_KEY);
  } catch {
    return null;
  }
};

export const persistLocale = async (locale: Locale) => {
  try {
    await SecureStore.setItemAsync(LOCALE_KEY, locale);
  } catch {
    /* a failed write only means the choice is not remembered next launch */
  }
};
