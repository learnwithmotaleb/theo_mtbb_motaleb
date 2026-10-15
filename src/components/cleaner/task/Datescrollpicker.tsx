import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body4, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useIntlLocale } from '@/i18n';
import React, { useEffect, useMemo, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ISO string: "2026-05-15"
function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// Generate continuous dates across multiple months (e.g. 1 month before to 12 months ahead)
function getRangeDates(baseDate: Date, monthsBefore = 1, monthsAhead = 12): Date[] {
    const days: Date[] = [];
    const start = new Date(baseDate.getFullYear(), baseDate.getMonth() - monthsBefore, 1);
    const end = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthsAhead + 1, 0);
    const cur = new Date(start);
    while (cur <= end) {
        days.push(new Date(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return days;
}

interface DateScrollPickerProps {
    selectedDate: string;         // "2026-05-15"
    onSelectDate: (date: string) => void;
    /** কোন dates এ task আছে — dot দেখানোর জন্য (optional) */
    activeDates?: string[];
}

export function DateScrollPicker({
    selectedDate,
    onSelectDate,
    activeDates = [],
}: DateScrollPickerProps) {
    const scrollRef = useRef<ScrollView>(null);
    const locale = useIntlLocale();

    const today = useMemo(() => new Date(), []);
    const selDate = useMemo(() => {
        return selectedDate
            ? new Date(selectedDate + 'T00:00:00')
            : today;
    }, [selectedDate, today]);

    // Continuous date range: from 1 month before current month up to 12 months ahead
    const dates = useMemo(() => {
        return getRangeDates(today, 1, 12);
    }, [today]);

    // selected date এর index
    const selectedIndex = dates.findIndex(
        (d) => toISO(d) === selectedDate
    );

    const monthTitle = useMemo(() => {
        const str = selDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
        return str.charAt(0).toUpperCase() + str.slice(1);
    }, [selDate, locale]);

    const handlePrevMonth = () => {
        const d = new Date(selDate.getFullYear(), selDate.getMonth() - 1, 1);
        onSelectDate(toISO(d));
    };

    const handleNextMonth = () => {
        const d = new Date(selDate.getFullYear(), selDate.getMonth() + 1, 1);
        onSelectDate(toISO(d));
    };

    // mount or selected date changes -> scroll to selected date
    useEffect(() => {
        if (selectedIndex >= 0 && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    x: Math.max(0, selectedIndex * (CHIP_WIDTH + GAP) - wp(20)),
                    animated: true,
                });
            }, 100);
        }
    }, [selectedIndex]);

    return (
        <View style={styles.container}>
            <View style={styles.monthHeader}>
                <Pressable
                    style={styles.navBtn}
                    onPress={handlePrevMonth}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Previous month"
                >
                    <LeftAngleIcon size={16} color={Colors.PRIMARY_TEXT} />
                </Pressable>
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.monthTitle}>
                    {monthTitle}
                </Body4>
                <Pressable
                    style={styles.navBtn}
                    onPress={handleNextMonth}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Next month"
                >
                    <RightAngleIcon size={16} color={Colors.PRIMARY_TEXT} />
                </Pressable>
            </View>

            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >
                {dates.map((date) => {
                    const iso = toISO(date);
                    const isSelected = iso === selectedDate;
                    const hasTask = activeDates.includes(iso);

                    return (
                        <Pressable
                            key={iso}
                            style={[styles.chip, isSelected && styles.chipActive]}
                            onPress={() => onSelectDate(iso)}
                        >
                            {/* Day name */}
                            <Caption4
                                color={isSelected ? Colors.TEXT_WHITE : Colors.TEXT_COLOR}
                            >
                                {date.toLocaleDateString(locale, { weekday: 'short' })}
                            </Caption4>

                            {/* Day number */}
                            <Caption3
                                color={isSelected ? Colors.TEXT_WHITE : Colors.PRIMARY_TEXT}
                                style={styles.dayNum}
                            >
                                {date.getDate()}
                            </Caption3>

                            {/* Month name */}
                            <Caption4
                                color={isSelected ? Colors.TEXT_WHITE : Colors.TEXT_COLOR}
                            >
                                {date.toLocaleDateString(locale, { month: 'short' })}
                            </Caption4>

                            {/* Task dot */}
                            {hasTask && (
                                <View
                                    style={[
                                        styles.dot,
                                        { backgroundColor: isSelected ? Colors.TEXT_WHITE : Colors.BRAND_PRIMARY },
                                    ]}
                                />
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const CHIP_WIDTH = wp(58);
const GAP = wp(8);

const styles = StyleSheet.create({
    container: {
        marginBottom: hp(6),
    },
    monthHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(6),
        paddingBottom: hp(10),
    },
    monthTitle: {
        fontFamily: 'Poppins_600SemiBold',
    },
    navBtn: {
        width: wp(32),
        height: wp(32),
        borderRadius: wp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: {
        gap: GAP,
        paddingBottom: hp(14),
        paddingHorizontal: wp(2),
    },
    chip: {
        width: CHIP_WIDTH,
        height: hp(88),          // ← fixed height — কখনো বাড়বে না
        borderRadius: wp(14),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        gap: hp(2),
    },
    chipActive: {
        backgroundColor: Colors.PRIMARY_TEXT,
        borderColor: Colors.PRIMARY_TEXT,
    },
    dayNum: {
        fontFamily: 'Poppins_700Bold',
        lineHeight: hp(22),
    },
    dot: {
        width: wp(5),
        height: wp(5),
        borderRadius: wp(3),
        marginTop: hp(2),
    },
});