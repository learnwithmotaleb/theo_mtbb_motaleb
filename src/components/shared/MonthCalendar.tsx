import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body6, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useIntlLocale } from '@/i18n';
import { toDateKey } from '@/lib/datetime';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

type Props = {
    /** Selected day as "YYYY-MM-DD", or '' for none. */
    value: string;
    onChange: (dateKey: string) => void;
    /** Earliest selectable day ("YYYY-MM-DD"). Defaults to today. */
    minDate?: string;
};

const startOfMonth = (key: string) => {
    const [y, m] = key.split('-').map(Number);
    return new Date(y, (m || 1) - 1, 1);
};

/**
 * A month grid for picking one day. Days before `minDate` are disabled, so a
 * cleaning can never be planned in the past. Week starts on Monday, as French
 * calendars do.
 */
export function MonthCalendar({ value, onChange, minDate }: Props) {
    const locale = useIntlLocale();
    const min = minDate || toDateKey(new Date());
    const [month, setMonth] = useState(() => startOfMonth(value || min));

    const title = useMemo(
        () => month.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
        [month, locale],
    );

    // Monday-first short weekday names in the current language.
    const weekdays = useMemo(() => {
        const monday = new Date(2024, 0, 1); // a Monday
        return Array.from({ length: 7 }, (_, i) =>
            new Date(monday.getFullYear(), 0, 1 + i).toLocaleDateString(locale, {
                weekday: 'short',
            }),
        );
    }, [locale]);

    const cells = useMemo(() => {
        const year = month.getFullYear();
        const m = month.getMonth();
        const offset = (new Date(year, m, 1).getDay() + 6) % 7; // Monday = 0
        const days = new Date(year, m + 1, 0).getDate();
        const out: (string | null)[] = Array(offset).fill(null);
        for (let d = 1; d <= days; d++) out.push(toDateKey(new Date(year, m, d)));
        while (out.length % 7) out.push(null);
        return out;
    }, [month]);

    const canGoBack = toDateKey(month) > min.slice(0, 8) + '01';
    const shift = (delta: number) =>
        setMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => canGoBack && shift(-1)}
                    hitSlop={10}
                    style={[styles.navBtn, !canGoBack && { opacity: 0.3 }]}
                    accessibilityRole="button"
                    accessibilityLabel="previous month"
                >
                    <LeftAngleIcon />
                </Pressable>
                <Body6 color={Colors.PRIMARY_TEXT} style={styles.title}>
                    {title}
                </Body6>
                <Pressable
                    onPress={() => shift(1)}
                    hitSlop={10}
                    style={styles.navBtn}
                    accessibilityRole="button"
                    accessibilityLabel="next month"
                >
                    <RightAngleIcon size={22} color={Colors.PRIMARY_TEXT} />
                </Pressable>
            </View>

            <View style={styles.row}>
                {weekdays.map((day, i) => (
                    <View key={i} style={styles.cell}>
                        <Caption4 color={Colors.TEXT_COLOR}>{day}</Caption4>
                    </View>
                ))}
            </View>

            <View style={styles.grid}>
                {cells.map((key, i) => {
                    if (!key) return <View key={`empty-${i}`} style={styles.cell} />;
                    const disabled = key < min;
                    const selected = key === value;
                    return (
                        <Pressable
                            key={key}
                            disabled={disabled}
                            onPress={() => onChange(key)}
                            style={styles.cell}
                            accessibilityRole="button"
                            accessibilityState={{ disabled, selected }}
                        >
                            <View style={[styles.day, selected && styles.daySelected]}>
                                <Caption3
                                    color={
                                        selected
                                            ? Colors.TEXT_WHITE
                                            : disabled
                                              ? '#C7C7CC'
                                              : Colors.PRIMARY_TEXT
                                    }
                                >
                                    {Number(key.slice(8))}
                                </Caption3>
                            </View>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(12),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(8),
    },
    navBtn: {
        width: wp(32),
        height: wp(32),
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { textTransform: 'capitalize' },
    row: { flexDirection: 'row' },
    grid: { flexDirection: 'row', flexWrap: 'wrap' },
    cell: {
        width: `${100 / 7}%`,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(4),
    },
    day: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        alignItems: 'center',
        justifyContent: 'center',
    },
    daySelected: { backgroundColor: Colors.PRIMARY_TEXT },
});
