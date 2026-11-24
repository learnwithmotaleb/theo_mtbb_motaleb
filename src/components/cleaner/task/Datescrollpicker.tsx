import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { Body4, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useIntlLocale, useT } from '@/i18n';
import { formatDayKey } from '@/lib/datetime';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
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
    /** Dates that have at least one mission — shown with a dot. */
    activeDates?: string[];
    /** "YYYY-MM" of the dates currently on screen (changes while scrolling). */
    onVisibleMonthChange?: (month: string) => void;
}

export function DateScrollPicker({
    selectedDate,
    onSelectDate,
    activeDates = [],
    onVisibleMonthChange,
}: DateScrollPickerProps) {
    const t = useT();
    const scrollRef = useRef<ScrollView>(null);
    const locale = useIntlLocale();

    const today = useMemo(() => new Date(), []);
    const todayISO = toISO(today);

    // Continuous date range: from 1 month before current month up to 12 months ahead
    const dates = useMemo(() => getRangeDates(today, 1, 12), [today]);
    const isoDates = useMemo(() => dates.map(toISO), [dates]);

    const selectedIndex = isoDates.indexOf(selectedDate);

    // The header follows what is on screen, not only the tapped day: scrolling
    // into December shows "Décembre 2026" without touching the arrows.
    const [visibleMonth, setVisibleMonth] = useState(
        (selectedDate || todayISO).slice(0, 7),
    );

    const visibleMonthRef = useRef(visibleMonth);
    const updateVisibleMonth = useCallback(
        (month: string) => {
            if (visibleMonthRef.current === month) return;
            visibleMonthRef.current = month;
            setVisibleMonth(month);
            onVisibleMonthChange?.(month);
        },
        [onVisibleMonthChange],
    );

    const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        // The month of the day at the left edge (first fully visible chip).
        const index = Math.min(
            isoDates.length - 1,
            Math.max(0, Math.round(e.nativeEvent.contentOffset.x / (CHIP_WIDTH + GAP))),
        );
        updateVisibleMonth(isoDates[index].slice(0, 7));
    };

    const monthTitle = useMemo(() => {
        const str = formatDayKey(`${visibleMonth}-01`, { month: 'long', year: 'numeric' }, locale);
        return str.charAt(0).toUpperCase() + str.slice(1);
    }, [visibleMonth, locale]);

    // Arrows move from the month on screen; never outside the strip's range.
    const jumpMonth = (delta: number) => {
        const [y, m] = visibleMonth.split('-').map(Number);
        const target = toISO(new Date(y, m - 1 + delta, 1));
        const first = isoDates[0];
        const last = isoDates[isoDates.length - 1];
        if (target > last) return;
        onSelectDate(target < first ? first : target);
    };

    // mount or selected date changes -> scroll to selected date
    useEffect(() => {
        if (selectedIndex >= 0 && scrollRef.current) {
            const timer = setTimeout(() => {
                scrollRef.current?.scrollTo({
                    x: Math.max(0, selectedIndex * (CHIP_WIDTH + GAP) - wp(20)),
                    animated: true,
                });
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [selectedIndex]);

    return (
        <View style={styles.container}>
            <View style={styles.monthHeader}>
                <Pressable
                    style={styles.navBtn}
                    onPress={() => jumpMonth(-1)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel={t("Previous month")}
                >
                    <LeftAngleIcon size={16} color={Colors.PRIMARY_TEXT} />
                </Pressable>
                <Body4 color={Colors.PRIMARY_TEXT} style={styles.monthTitle}>
                    {monthTitle}
                </Body4>
                <Pressable
                    style={styles.navBtn}
                    onPress={() => jumpMonth(1)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel={t("Next month")}
                >
                    <RightAngleIcon size={16} color={Colors.PRIMARY_TEXT} />
                </Pressable>
            </View>

            <ScrollView
                ref={scrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                onScroll={handleScroll}
                scrollEventThrottle={32}
            >
                {dates.map((date, index) => {
                    const iso = isoDates[index];
                    const isSelected = iso === selectedDate;
                    const isToday = iso === todayISO;
                    // Past days stay tappable (mission history) but read as past.
                    const isPast = iso < todayISO;
                    const hasTask = activeDates.includes(iso);

                    const mutedText = isPast ? Colors.PLACEHOLDER_TEXT : Colors.TEXT_COLOR;
                    const mainText = isPast ? Colors.PLACEHOLDER_TEXT : Colors.PRIMARY_TEXT;

                    return (
                        <Pressable
                            key={iso}
                            style={[
                                styles.chip,
                                isPast && styles.chipPast,
                                isToday && styles.chipToday,
                                isSelected && styles.chipActive,
                            ]}
                            onPress={() => onSelectDate(iso)}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isSelected }}
                        >
                            {/* Day name — "Auj." on today */}
                            <Caption4
                                color={
                                    isSelected
                                        ? Colors.TEXT_WHITE
                                        : isToday
                                            ? Colors.COLOR_ACTIVE
                                            : mutedText
                                }
                            >
                                {isToday
                                    ? t("Today (short)")
                                    : formatDayKey(iso, { weekday: 'short' }, locale)}
                            </Caption4>

                            {/* Day number */}
                            <Caption3
                                color={
                                    isSelected
                                        ? Colors.TEXT_WHITE
                                        : isToday
                                            ? Colors.COLOR_ACTIVE
                                            : mainText
                                }
                                style={styles.dayNum}
                            >
                                {date.getDate()}
                            </Caption3>

                            {/* Month name */}
                            <Caption4 color={isSelected ? Colors.TEXT_WHITE : mutedText}>
                                {formatDayKey(iso, { month: 'short' }, locale)}
                            </Caption4>

                            {/* Task dot */}
                            {hasTask && (
                                <View
                                    style={[
                                        styles.dot,
                                        {
                                            backgroundColor: isSelected
                                                ? Colors.TEXT_WHITE
                                                : isPast
                                                    ? Colors.PLACEHOLDER_TEXT
                                                    : Colors.BRAND_PRIMARY,
                                        },
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
    // Past days: greyed out, so upcoming ones stand out.
    chipPast: {
        backgroundColor: '#F1F1F1',
        borderColor: 'transparent',
        opacity: 0.7,
    },
    // Today: green outline.
    chipToday: {
        borderColor: Colors.COLOR_ACTIVE,
        borderWidth: 2,
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