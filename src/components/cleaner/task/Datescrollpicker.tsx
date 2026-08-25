import { Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

const DAY_NAMES  = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ISO string: "2026-05-15"
function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

// পুরো মাসের date array তৈরি করা
function getMonthDates(year: number, month: number): Date[] {
    const days: Date[] = [];
    const totalDays = new Date(year, month + 1, 0).getDate();
    for (let d = 1; d <= totalDays; d++) {
        days.push(new Date(year, month, d));
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

    const today = new Date();
    const selDate = selectedDate
        ? new Date(selectedDate + 'T00:00:00')
        : today;

    const year  = selDate.getFullYear();
    const month = selDate.getMonth();
    const dates = getMonthDates(year, month);

    // selected date এর index
    const selectedIndex = dates.findIndex(
        (d) => toISO(d) === selectedDate
    );

    // mount হলে selected date এ scroll করা
    useEffect(() => {
        if (selectedIndex >= 0 && scrollRef.current) {
            setTimeout(() => {
                scrollRef.current?.scrollTo({
                    x: selectedIndex * (CHIP_WIDTH + GAP) - wp(20),
                    animated: true,
                });
            }, 150);
        }
    }, [selectedDate]);

    return (
        <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
        >
            {dates.map((date) => {
                const iso       = toISO(date);
                const isSelected = iso === selectedDate;
                const hasTask   = activeDates.includes(iso);

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
                            {DAY_NAMES[date.getDay()]}
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
                            {MONTH_NAMES[date.getMonth()]}
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
    );
}

const CHIP_WIDTH = wp(58);
const GAP        = wp(8);

const styles = StyleSheet.create({
    scroll: {
        gap: GAP,
        paddingBottom: hp(16),
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