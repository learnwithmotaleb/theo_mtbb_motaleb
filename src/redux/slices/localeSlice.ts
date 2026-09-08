import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const isSupportedLocale = (value?: string | null): value is Locale =>
  !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);

/**
 * The device's language, used until the user picks one explicitly.
 * Hermes ships Intl, which `lib/datetime.ts` already relies on for the
 * timezone, so no extra native module is needed just to read the language.
 */
export const deviceLocale = (): Locale => {
  try {
    const tag = new Intl.DateTimeFormat().resolvedOptions().locale ?? 'en';
    const base = tag.split('-')[0].toLowerCase();
    return isSupportedLocale(base) ? base : 'en';
  } catch {
    return 'en';
  }
};

interface LocaleState {
  locale: Locale;
  /** False until the stored choice has been read back from the keychain. */
  isHydrated: boolean;
}

const initialState: LocaleState = {
  locale: deviceLocale(),
  isHydrated: false,
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    /** Applies the persisted choice, or keeps the device default when none. */
    hydrateLocale: (state, action: PayloadAction<string | null>) => {
      if (isSupportedLocale(action.payload)) state.locale = action.payload;
      state.isHydrated = true;
    },
  },
});

export const { setLocale, hydrateLocale } = localeSlice.actions;
export default localeSlice.reducer;
