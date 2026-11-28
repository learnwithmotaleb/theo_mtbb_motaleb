import { showToast } from '@/components/shared/Toast';
import { useCallback, useRef, useState } from 'react';
import type { LayoutChangeEvent, ScrollView } from 'react-native';
import { hp } from '../../utils/responsiveDevice';

export type FieldErrors<F extends string> = Partial<Record<F, string>>;

/**
 * One validation behaviour for every required field of a form: the field gets
 * a red border with its message underneath, the first message is also shown
 * as a toast at the top, and the screen scrolls to the first field to fix.
 *
 * `order` lists the fields top to bottom, so "first" matches what the user sees.
 */
export function useFieldErrors<F extends string>(order: readonly F[]) {
    const [errors, setErrors] = useState<FieldErrors<F>>({});
    const scrollRef = useRef<ScrollView>(null);
    const fieldY = useRef<Partial<Record<F, number>>>({});

    /** Pass to a field's `onLayout` so the screen can scroll back to it. */
    const remember = useCallback(
        (field: F) => (event: LayoutChangeEvent) => {
            fieldY.current[field] = event.nativeEvent.layout.y;
        },
        [],
    );

    /** Removes a field's error as soon as the user changes it. */
    const clear = useCallback((...fields: F[]) => {
        setErrors((prev) => {
            if (!fields.some((field) => prev[field])) return prev;
            const next = { ...prev };
            fields.forEach((field) => delete next[field]);
            return next;
        });
    }, []);

    /**
     * Shows the given errors. Returns true when there were none, so a screen
     * can write `if (!report(found)) return;`.
     */
    const report = useCallback(
        (found: FieldErrors<F>): boolean => {
            setErrors(found);
            const first = order.find((field) => found[field]);
            if (!first) return true;
            showToast(found[first] as string, 'error');
            const y = fieldY.current[first];
            if (y !== undefined) {
                scrollRef.current?.scrollTo({ y: Math.max(0, y - hp(20)), animated: true });
            }
            return false;
        },
        [order],
    );

    return { errors, clear, report, remember, scrollRef };
}
