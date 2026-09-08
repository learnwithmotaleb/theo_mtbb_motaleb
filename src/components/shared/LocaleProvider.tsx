import React, { useEffect, useState } from 'react';

import { readStoredLocale, setActiveLocale } from '@/i18n';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { hydrateLocale } from '@/redux/slices/localeSlice';

/**
 * Restores the saved language on a cold start and keeps the translator in step
 * with the store.
 *
 * It deliberately does NOT remount its children on a language change: the
 * navigator lives below it, so remounting replayed the splash animation and
 * bounced the user back to their home tab. Components re-render themselves
 * instead — each one calls `useT()`, whose identity changes with the locale.
 *
 * The module-level locale it maintains here is for the non-component callers
 * (mappers, helpers, `showToast` arguments) only.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const locale = useAppSelector((state) => state.locale.locale);
    const isHydrated = useAppSelector((state) => state.locale.isHydrated);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let alive = true;
        readStoredLocale().then((stored) => {
            if (!alive) return;
            // Set the module variable before the store update, so the render
            // triggered by `hydrateLocale` already uses the right catalog.
            setActiveLocale(
                stored === 'fr' || stored === 'en' ? stored : locale,
            );
            dispatch(hydrateLocale(stored));
            setReady(true);
        });
        return () => {
            alive = false;
        };
        // Runs once: the stored value is only read on a cold start.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    // A safety net for any path that changes the locale without going through
    // the language screen; setting the same value again is free.
    setActiveLocale(locale);

    // Holding the tree back until the stored choice is known avoids a flash of
    // the device language before the user's own choice loads.
    if (!ready && !isHydrated) return null;

    return <>{children}</>;
}
