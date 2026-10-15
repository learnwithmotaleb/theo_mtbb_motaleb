import { useT } from '@/i18n';
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { RightarrowAngleIcon } from '@/assets/icons/common_icon/RightArrowAngleIcon';
import { AirBnbIcon } from '@/assets/icons/host_icon/AirBnbIcon';
import { BookingIcon } from '@/assets/icons/host_icon/BookingIcon';
import { PlusIcon } from '@/assets/icons/host_icon/PlusIcon';
import { CancelScheduleModal } from '@/components/host/planning/CancelScheduleModal';
import { Caption3, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CalendarEvent } from '@/types/planningTypes';
import { AppImage } from '@/components/shared/AppImage';
import { showToast } from '@/components/shared/Toast';
import { getApiErrorMessage } from '@/lib/apiError';
import { avatarSource } from '@/lib/mappers';
import { useDeleteScheduleMutation } from '@/redux/services/scheduleApi';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

const DAYS_FR = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];
const MONTH_NAMES_FR = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday=0, Sunday=6
}

function PlatformIcon({ platform }: { platform: string }) {
    if (platform === 'airbnb') return <AirBnbIcon size={18} />;
    if (platform === 'booking') return <BookingIcon size={18} />;
    return <Caption4 color={Colors.TEXT_COLOR}>{platform ? platform[0].toUpperCase() : '•'}</Caption4>;
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
    events?: CalendarEvent[];
    monthData?: any;
    currentYear?: number;
    currentMonth?: number;
    onMonthChange?: (year: number, month: number) => void;
    accommodationId?: string;
};

export function CalendarView({
    onConnectCalendar,
    hasData,
    events = [],
    monthData,
    currentYear,
    currentMonth,
    onMonthChange,
    accommodationId,
}: Props) {
    const t = useT();
    const router = useRouter();
    const now = new Date();

    const [year, setYear] = useState(currentYear ?? now.getFullYear());
    const [month, setMonth] = useState(currentMonth ?? now.getMonth());
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [cancelVisible, setCancelVisible] = useState(false);
    const [popup, setPopup] = useState<PopupData>(null);
    const [deleteSchedule, { isLoading: isCancelling }] = useDeleteScheduleMutation();

    const bookings: any[] = useMemo(() => monthData?.bookings ?? [], [monthData]);
    const schedules: any[] = useMemo(() => monthData?.schedules ?? [], [monthData]);

    const handleCancelConfirm = async () => {
        if (!selectedEvent?.scheduleId) return;
        try {
            await deleteSchedule(selectedEvent.scheduleId).unwrap();
            showToast(t('Schedule cancelled successfully.'), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t('Could not cancel the schedule.')), 'error');
        } finally {
            setCancelVisible(false);
            setSelectedEvent(null);
        }
    };

    const totalDays = getDaysInMonth(year, month);
    const firstDayIndex = getFirstDayOfMonth(year, month);

    const cells: (number | null)[] = [
        ...Array(firstDayIndex).fill(null),
        ...Array.from({ length: totalDays }, (_, i) => i + 1),
    ];
    while (cells.length % 7 !== 0) cells.push(null);

    const goToMonth = (nextYear: number, nextMonth: number) => {
        setYear(nextYear);
        setMonth(nextMonth);
        onMonthChange?.(nextYear, nextMonth);
    };

    const handlePrevMonth = () => {
        if (month === 0) goToMonth(year - 1, 11);
        else goToMonth(year, month - 1);
    };

    const handleNextMonth = () => {
        if (month === 11) goToMonth(year + 1, 0);
        else goToMonth(year, month + 1);
    };

    const getDayInfo = useCallback(
        (day: number) => {
            const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayStart = new Date(year, month, day, 0, 0, 0).getTime();

            // Find cleaning schedule on this day
            const schedule = schedules.find((s: any) => {
                if (!s?.date) return false;
                const sDate = new Date(s.date);
                const sYmd = `${sDate.getFullYear()}-${String(sDate.getMonth() + 1).padStart(2, '0')}-${String(sDate.getDate()).padStart(2, '0')}`;
                return sYmd === ymd;
            });

            // Find booking checkout on this day (recommended cleaning day)
            const checkoutBooking = bookings.find((b: any) => {
                if (!b?.endDate) return false;
                const bDate = new Date(b.endDate);
                const bYmd = `${bDate.getFullYear()}-${String(bDate.getMonth() + 1).padStart(2, '0')}-${String(bDate.getDate()).padStart(2, '0')}`;
                return bYmd === ymd;
            });

            // Find booking where guest is staying on this day (Occupied: start <= day < end)
            const occupiedBooking = bookings.find((b: any) => {
                if (!b?.startDate || !b?.endDate) return false;
                const bStart = new Date(b.startDate).setHours(0, 0, 0, 0);
                const bEnd = new Date(b.endDate).setHours(0, 0, 0, 0);
                return dayStart >= bStart && dayStart < bEnd;
            });

            if (checkoutBooking || schedule) {
                return {
                    type: 'departure' as const,
                    ymd,
                    label: t('DÉPART'),
                    booking: checkoutBooking,
                    schedule,
                    cleanerImage: avatarSource(schedule?.cleaner?.profileImage),
                };
            }

            if (occupiedBooking) {
                return {
                    type: 'occupied' as const,
                    ymd,
                    label: t('Occupé'),
                    booking: occupiedBooking,
                    schedule: null,
                    cleanerImage: null,
                };
            }

            return {
                type: 'available' as const,
                ymd,
                label: '',
                booking: null,
                schedule: null,
                cleanerImage: null,
            };
        },
        [year, month, bookings, schedules, t],
    );

    const handleDayPress = (day: number) => {
        const info = getDayInfo(day);

        if (info.type === 'departure') {
            if (info.schedule?._id) {
                // A cleaning is already scheduled → open cancel/manage modal
                setSelectedEvent({
                    id: String(info.schedule._id),
                    scheduleId: String(info.schedule._id),
                    date: day,
                    cleanerImage: info.cleanerImage,
                    checkIn: '',
                    checkOut: '',
                    platform: 'other',
                    cleaningTime: '',
                });
                setCancelVisible(true);
            } else {
                // Checkout day without scheduled cleaner → navigate to schedule
                router.push({
                    pathname: '/host/home/schedule_cleaning',
                    params: { accommodationId, date: info.ymd },
                } as any);
            }
            return;
        }

        if (info.type === 'occupied' && info.booking) {
            const startD = new Date(info.booking.startDate);
            const endD = new Date(info.booking.endDate);
            const formatStay = (d: Date) =>
                `${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            setPopup({
                platform: (info.booking.platform || 'other').toLowerCase(),
                date: `${day} ${MONTH_NAMES_FR[month]} ${year}`,
                checkIn: formatStay(startD),
                checkOut: formatStay(endD),
            });
            return;
        }

        // Available day → navigate to schedule cleaning
        router.push({
            pathname: '/host/home/schedule_cleaning',
            params: { accommodationId, date: info.ymd },
        } as any);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            {/* Month nav */}
            <View style={styles.monthNav}>
                <Pressable style={styles.navBtn} onPress={handlePrevMonth}>
                    <RightarrowAngleIcon />
                </Pressable>
                <Pressable style={styles.monthLabel}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={styles.monthText}>
                        {MONTH_NAMES_FR[month]} {year}
                    </Caption3>
                    <DownArrowIcon color="#4B5563" />
                </Pressable>
                <Pressable style={styles.navBtn} onPress={handleNextMonth}>
                    <RightAngleIcon size={22} />
                </Pressable>
            </View>

            {/* Day headers in French */}
            <View style={styles.dayHeaders}>
                {DAYS_FR.map((d) => (
                    <View key={d} style={styles.dayHeaderCell}>
                        <Caption5 color={Colors.TEXT_COLOR} style={styles.dayHeaderText}>
                            {d}
                        </Caption5>
                    </View>
                ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.grid}>
                {Array.from({ length: cells.length / 7 }).map((_, rowIdx) => {
                    const week = cells.slice(rowIdx * 7, rowIdx * 7 + 7);

                    return (
                        <View key={rowIdx} style={styles.weekRow}>
                            {week.map((day, colIdx) => {
                                if (day === null) {
                                    return <View key={colIdx} style={styles.emptyDayCell} />;
                                }

                                const info = getDayInfo(day);

                                return (
                                    <Pressable
                                        key={colIdx}
                                        style={[
                                            styles.dayCard,
                                            info.type === 'departure' && styles.dayCardDeparture,
                                            info.type === 'occupied' && styles.dayCardOccupied,
                                            info.type === 'available' && styles.dayCardAvailable,
                                        ]}
                                        onPress={() => handleDayPress(day)}
                                    >
                                        {/* Day number at top */}
                                        <Caption4
                                            color={Colors.PRIMARY_TEXT}
                                            style={styles.dayNumber}
                                        >
                                            {day}
                                        </Caption4>

                                        {/* Center icon / status */}
                                        <View style={styles.centerIconWrap}>
                                            {info.type === 'departure' ? (
                                                info.cleanerImage ? (
                                                    <AppImage
                                                        source={info.cleanerImage}
                                                        style={styles.cleanerAvatar}
                                                        contentFit="cover"
                                                    />
                                                ) : (
                                                    <View style={styles.orangeCircle}>
                                                        <PlusIcon color="#FFFFFF" size={12} />
                                                    </View>
                                                )
                                            ) : info.type === 'occupied' ? (
                                                <View style={styles.greyCircle}>
                                                    <PlusIcon color="#8E8E93" size={10} />
                                                </View>
                                            ) : (
                                                <View style={styles.greenCircle}>
                                                    <PlusIcon color="#34C759" size={10} />
                                                </View>
                                            )}
                                        </View>

                                        {/* Bottom label */}
                                        {info.type === 'departure' ? (
                                            <Caption5 style={styles.departureText}>
                                                {info.label}
                                            </Caption5>
                                        ) : info.type === 'occupied' ? (
                                            <Caption5 style={styles.occupiedText}>
                                                {info.label}
                                            </Caption5>
                                        ) : (
                                            <View style={styles.emptyLabelSpacer} />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>
                    );
                })}
            </View>

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
                                    {popup.platform === 'airbnb' ? 'Airbnb' : popup.platform === 'booking' ? 'Booking.com' : 'Réservation'}
                                </Caption3>
                            </View>
                            <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(10) }}>
                                {popup.date}
                            </Caption4>
                            <View style={styles.popupTimes}>
                                <View style={styles.popupTimeItem}>
                                    <Caption5 color={Colors.TEXT_COLOR}>{t("CHECK-IN")}</Caption5>
                                    <Caption4 color={Colors.PRIMARY_TEXT}>{popup.checkIn}</Caption4>
                                </View>
                                <Caption3 color={Colors.TEXT_COLOR} style={styles.popupArrow}>→</Caption3>
                                <View style={styles.popupTimeItem}>
                                    <Caption5 color={Colors.TEXT_COLOR}>{t("CHECK-OUT")}</Caption5>
                                    <Caption4 color={Colors.PRIMARY_TEXT}>{popup.checkOut}</Caption4>
                                </View>
                            </View>
                        </View>
                    </Pressable>
                </Modal>
            )}

            {/* Cancel Schedule Modal */}
            <CancelScheduleModal
                visible={cancelVisible}
                onClose={() => {
                    setCancelVisible(false);
                    setSelectedEvent(null);
                }}
                onConfirm={handleCancelConfirm}
                isLoading={isCancelling}
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
        width: wp(36),
        height: wp(36),
        borderRadius: wp(8),
        backgroundColor: Colors.INPUT_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthLabel: { flexDirection: 'row', alignItems: 'center', gap: wp(6) },
    monthText: { fontFamily: 'Poppins_600SemiBold', fontSize: 16 },
    dayHeaders: {
        flexDirection: 'row',
        marginBottom: hp(6),
        paddingHorizontal: wp(2),
    },
    dayHeaderCell: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(4),
    },
    dayHeaderText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 11,
    },
    grid: {
        paddingBottom: hp(16),
    },
    weekRow: {
        flexDirection: 'row',
        marginBottom: hp(6),
    },
    emptyDayCell: {
        flex: 1,
        height: hp(68),
        marginHorizontal: wp(2),
    },
    dayCard: {
        flex: 1,
        height: hp(68),
        marginHorizontal: wp(2),
        borderRadius: wp(8),
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(5),
        borderWidth: 1,
    },
    dayCardDeparture: {
        backgroundColor: '#FFF4E6',
        borderColor: '#FFE2C2',
    },
    dayCardOccupied: {
        backgroundColor: '#F2F2F5',
        borderColor: '#E5E5EA',
    },
    dayCardAvailable: {
        backgroundColor: '#FFFFFF',
        borderColor: '#EFEFEF',
    },
    dayNumber: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 11,
    },
    centerIconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    orangeCircle: {
        width: wp(24),
        height: wp(24),
        borderRadius: wp(12),
        backgroundColor: '#FF8D28',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cleanerAvatar: {
        width: wp(24),
        height: wp(24),
        borderRadius: wp(12),
    },
    greyCircle: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        backgroundColor: '#E5E5EA',
        alignItems: 'center',
        justifyContent: 'center',
    },
    greenCircle: {
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
        borderWidth: 1.5,
        borderColor: '#34C759',
        alignItems: 'center',
        justifyContent: 'center',
    },
    departureText: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 8,
        color: '#FF7700',
        textTransform: 'uppercase',
    },
    occupiedText: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 8,
        color: '#8E8E93',
    },
    emptyLabelSpacer: {
        height: 10,
    },
    popupOverlay: {
        flex: 1,
        backgroundColor: '#00000040',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(40),
    },
    popup: {
        backgroundColor: '#fff',
        borderRadius: wp(14),
        padding: wp(16),
        width: wp(240),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    popupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        marginBottom: hp(4),
    },
    popupTimes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: wp(6),
        backgroundColor: Colors.INPUT_BACKGROUND,
        padding: wp(8),
        borderRadius: wp(8),
    },
    popupTimeItem: { flex: 1, gap: hp(2) },
    popupArrow: { paddingHorizontal: wp(2) },
});