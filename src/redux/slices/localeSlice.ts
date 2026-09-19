import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const SUPPORTED_LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'fr';

export const isSupportedLocale = (value?: string | null): value is Locale =>
  !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value);

interface LocaleState {
  locale: Locale;
  /** False until the stored choice has been read back from the keychain. */
  isHydrated: boolean;
}

const initialState: LocaleState = {
  locale: DEFAULT_LOCALE,
  isHydrated: false,
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.locale = action.payload;
    },
    /** Applies the persisted choice, or keeps French when none exists. */
    hydrateLocale: (state, action: PayloadAction<string | null>) => {
      if (isSupportedLocale(action.payload)) state.locale = action.payload;
      state.isHydrated = true;
    },
  },
});

export const { setLocale, hydrateLocale } = localeSlice.actions;
export default localeSlice.reducer;
