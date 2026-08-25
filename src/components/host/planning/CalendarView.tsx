import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { RightarrowAngleIcon } from '@/assets/icons/common_icon/RightArrowAngleIcon';
import { AirBnbIcon } from '@/assets/icons/host_icon/AirBnbIcon';
import { BookingIcon } from '@/assets/icons/host_icon/BookingIcon';
import { LinkIcon } from '@/assets/icons/host_icon/LinkIcon';
import { PlusIcon } from '@/assets/icons/host_icon/PlusIcon';
import { CancelScheduleModal } from '@/components/host/planning/CancelScheduleModal';
import { CustomButton } from '@/components/shared/CustomButton';
import { Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import {
    CALENDAR_EVENTS,
    CalendarEvent
} from '@/data/planningfakedata';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
}

function PlatformIcon({ platform }: { platform: string }) {
    if (platform === 'airbnb') return <AirBnbIcon size={18} />;
    if (platform === 'booking') return <BookingIcon size={18} />;
    return <Caption4 color={Colors.TEXT_COLOR}>{platform[0].toUpperCase()}</Caption4>;
}

type PopupData = {
    platform: string;
    date: string;
    checkOut: string;
    checkIn: string;
} | null;

type Props = {
    onConnectCalendar: () => void;
    hasData: boolean;
};

export function CalendarView({ onConnectCalendar, hasData }: Props) {
    const router = useRouter();
    const now = new Date();
    const [year, setYear] = useState(now.getFullYear());
    const [month, setMonth] = useState(now.getMonth());
    const [cancelVisible, setCancelVisible] = useState(false);
    const [popup, setPopup] = useState<PopupData>(null);

    const totalDays = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const cells: (number | null)[] = [
        ...Array(firstDayIndex).fill(null),
        ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const getEventForDay = (day: number | null): CalendarEvent | null => {
        if (!day) return null;
        return CALENDAR_EVENTS.find((e) => e.date === day) ?? null;
    };

    const handlePrevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
    };
    const handleNextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
    };

    // FIX 1: cleaner assign আছে এমন date এ bar দেখাবে না
    // শুধু empty date গুলোতে bar দেখাবে
    function getEmptyRanges(week: (number | null)[]) {
        const ranges: { start: number; end: number; color: string; isEmpty: boolean }[] = [];
        let i = 0;
        while (i < week.length) {
            const day = week[i];
            if (day === null) { i++; continue; }
            const event = getEventForDay(day);

            if (!event) {
                // empty date — bar দেখাবে
                const start = i;
                while (i < week.length) {
                    const d = week[i];
                    if (d !== null && !getEventForDay(d)) i++;
                    else break;
                }
                ranges.push({ start, end: i - 1, color: '#E5E7EB', isEmpty: true });
            } else {
                // cleaner assigned — bar দেখাবে না (transparent)
                ranges.push({
                    start: i,
                    end: i,
                    color: 'transparent',   // ← FIX 1: cleaner আছে → bar নেই
                    isEmpty: false,
                });
                i++;
            }
        }
        return ranges;
    }

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {/* Month nav */}
            <View style={styles.monthNav}>
                <Pressable style={styles.navBtn} onPress={handlePrevMonth}>
                    <RightarrowAngleIcon />
                </Pressable>
                <Pressable style={styles.monthLabel}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={styles.monthText}>
                        {MONTH_NAMES[month]} {year}
                    </Caption3>
                    <DownArrowIcon color="#4B5563" />
                </Pressable>
                <Pressable style={styles.navBtn} onPress={handleNextMonth}>
                    <RightAngleIcon size={22} />
                </Pressable>
            </View>

            {/* Day headers */}
            <View style={styles.dayHeaders}>
                {DAYS.map((d) => (
                    <View key={d} style={styles.dayHeaderCell}>
                        <Caption4 color={Colors.TEXT_COLOR}>{d}</Caption4>
                    </View>
                ))}
            </View>

            {!hasData ? (
                <View style={styles.emptyState}>
                    <Caption3
                        color={Colors.PRIMARY_TEXT}
                        align="center"
                        style={{ fontFamily: 'Poppins_600SemiBold', marginBottom: hp(8) }}
                    >
                        No Calendars Connected
                    </Caption3>
                    <Caption3
                        color={Colors.TEXT_COLOR}
                        align="center"
                        style={{ marginBottom: hp(20) }}
                    >
                        Connect your booking calendar (Airbnb, Booking.com etc.) to automatically display your reservations
                    </Caption3>
                    <CustomButton
                        title='Connect my calendar'
                        onPress={onConnectCalendar}
                        borderRadius={wp(8)}
                        height={hp(50)}
                        width={"70%"}
                        icon={<LinkIcon />}
                    />
                </View>
            ) : (
                <View style={styles.grid}>
                    {Array.from({ length: cells.length / 7 }).map((_, rowIdx) => {
                        const week = cells.slice(rowIdx * 7, rowIdx * 7 + 7);
                        const ranges = getEmptyRanges(week);

                        return (
                            <View key={rowIdx} style={styles.weekRow}>
                                {/* Day cells */}
                                {week.map((day, colIdx) => {
                                    const event = getEventForDay(day as number | null);
                                    return (
                                        <View key={colIdx} style={styles.dayCell}>
                                            {day !== null && (
                                                <Caption4 color={Colors.PRIMARY_TEXT}>{day}</Caption4>
                                            )}
                                            {event?.hasManualCleaning ? (
                                                <Pressable
                                                    style={styles.plusIcon}
                                                    onPress={() =>
                                                        router.push('/host/housing/manage_cleaners' as any)
                                                    }
                                                >
                                                    <PlusIcon color={Colors.COLOR_ACTIVE} />
                                                </Pressable>
                                            ) : event ? (
                                                <Pressable onPress={() => setCancelVisible(true)}>
                                                    <Image
                                                        source={event.cleanerImage}
                                                        style={styles.cleanerAvatar}
                                                        contentFit="cover"
                                                    />
                                                </Pressable>
                                            ) : null}
                                        </View>
                                    );
                                })}

                                {/* Bars — FIX 2: empty bar click করলে popup দেখাবে */}
                                <View style={styles.barRowAbsolute} pointerEvents="box-none">
                                    {ranges.map((range, ri) => {
                                        const flexVal = range.end - range.start + 1;
                                        const rangeDay = week[range.start];

                                        // FIX 2: empty bar only — cleaner bar transparent তাই non-pressable
                                        if (!range.isEmpty) {
                                            return (
                                                <View
                                                    key={ri}
                                                    style={[
                                                        styles.barSegment,
                                                        { flex: flexVal, backgroundColor: 'transparent' },
                                                    ]}
                                                />
                                            );
                                        }

                                        return (
                                            <Pressable
                                                key={ri}
                                                style={[
                                                    styles.barSegment,
                                                    { flex: flexVal, backgroundColor: range.color },
                                                ]}
                                                onPress={() => {
                                                    // FIX 2: empty bar click → popup
                                                    if (rangeDay) {
                                                        setPopup({
                                                            platform: 'airbnb',
                                                            date: `${rangeDay} ${MONTH_NAMES[month]} ${year}`,
                                                            checkOut: '10:00 AM',
                                                            checkIn: '01:00 PM',
                                                        });
                                                    }
                                                }}
                                            />
                                        );
                                    })}
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}

            {/* Booking detail popup */}
            {popup && (
                <Modal transparent animationType="fade" onRequestClose={() => setPopup(null)}>
                    <Pressable style={styles.popupOverlay} onPress={() => setPopup(null)}>
                        <View style={styles.popup}>
                            <View style={styles.popupHeader}>
                                <PlatformIcon platform={popup.platform} />
                                <Caption3
                                    color={Colors.PRIMARY_TEXT}
                                    style={{ fontFamily: 'Poppins_600SemiBold' }}
                                >
                                    {popup.platform === 'airbnb' ? 'Airbnb' : 'Booking.com'}
                                </Caption3>
                            </View>
                            <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(10) }}>
                                {popup.date}
                            </Caption4>
                            <View style={styles.popupTimes}>
                                <View style={styles.popupTimeItem}>
                                    <Caption4 color={Colors.TEXT_COLOR}>CHECK-OUT</Caption4>
                                    <Caption3 color={Colors.PRIMARY_TEXT}>{popup.checkOut}</Caption3>
                                </View>
                                <Caption3 color={Colors.TEXT_COLOR} style={styles.popupArrow}>→</Caption3>
                                <View style={styles.popupTimeItem}>
                                    <Caption4 color={Colors.TEXT_COLOR}>CHECK-IN</Caption4>
                                    <Caption3 color={Colors.PRIMARY_TEXT}>{popup.checkIn}</Caption3>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}

            <CancelScheduleModal
                visible={cancelVisible}
                onClose={() => setCancelVisible(false)}
                onConfirm={() => setCancelVisible(false)}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(12),
    },
    navBtn: {
        width: wp(36), height: wp(36),
        borderRadius: wp(8),
        backgroundColor: Colors.INPUT_BACKGROUND,
        alignItems: 'center', justifyContent: 'center',
    },
    monthLabel: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    monthText: { fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
    dayHeaders: { flexDirection: 'row', marginBottom: hp(4) },
    dayHeaderCell: { flex: 1, alignItems: 'center', paddingVertical: hp(4) },
    grid: {},
    weekRow: {
        flexDirection: 'row',
        position: 'relative',
        marginBottom: hp(8),
        minHeight: hp(48),
    },
    dayCell: {
        flex: 1,
        alignItems: 'center',
        paddingTop: hp(2),
        gap: hp(2),
        zIndex: 1,
    },
    cleanerAvatar: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
    },
    plusIcon: {
        width: wp(24), height: wp(24),
        borderRadius: wp(12),
        borderWidth: 2,
        borderColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
        marginTop:hp(5)
    },
    barRowAbsolute: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        flexDirection: 'row',
        height: hp(10),
        zIndex: 0,
    },
    barSegment: {
        marginHorizontal: wp(1),
        borderRadius: wp(4),
        height: hp(10),
    },
    emptyState: {
        alignItems: 'center',
        paddingHorizontal: wp(20),
        paddingTop: hp(40),
    },
    popupOverlay: {
        flex: 1,
        backgroundColor: '#00000030',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(40),
    },
    popup: {
        backgroundColor: '#fff',
        borderRadius: wp(14),
        padding: wp(16),
        width: wp(200),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    popupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        marginBottom: hp(4),
    },
    popupTimes: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
    },
    popupTimeItem: { flex: 1, gap: hp(2) },
    popupArrow: { paddingHorizontal: wp(2) },
});