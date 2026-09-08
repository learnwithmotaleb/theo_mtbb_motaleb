import { useMemo } from 'react';

import { useIntlLocale } from '@/i18n';
import {
    formatDate,
    formatDateTime,
    formatTime,
    relativeFromNow,
} from './datetime';
import { formatMoney } from './pricing';

/**
 * The locale-sensitive formatters, for use inside components:
 * `const { formatDate, formatMoney } = useFormat();`
 *
 * The functions themselves already read the active locale, so this hook does
 * not change what they return — it changes *when* they are recomputed. The
 * React Compiler caches a call like `formatMoney(row.total)` against `row`
 * alone, so after a language switch a screen would keep showing `€12.00`
 * where French wants `12,00 €` until the data itself changed. Rebuilding the
 * object on every locale change gives those cache slots a dependency that
 * actually moves.
 *
 * `formatClock`, `toDateKey`, `fromCents` and `computeSchedulePrice` are not
 * here: they produce the same output in every language, so importing them
 * directly is correct.
 */
export const useFormat = () => {
    const locale = useIntlLocale();
    return useMemo(
        () => ({ formatDate, formatDateTime, formatTime, formatMoney, relativeFromNow }),
        // The identities are stable; the locale is what makes this recompute.
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [locale],
    );
};
