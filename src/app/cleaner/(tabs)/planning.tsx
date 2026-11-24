import { SkeletonList } from '@/components/shared/Skeleton';
import { useIntlLocale, useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { DateScrollPicker } from '@/components/cleaner/task/Datescrollpicker';
import { Body4, Body5, Caption2, Caption3, Caption4, H6 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { accommodationLocation, accommodationPhoto } from '@/lib/mappers';
import { cleaningEstimate, formatCleaningWindow, formatDayKey } from '@/lib/datetime';
import { useGetCleanerPlanningQuery } from '@/redux/services/scheduleApi';
import { AppImage } from '@/components/shared/AppImage';
import { CleaningStatusBadge } from '@/components/cleaner/CleaningStatusBadge';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

/** One mission row inside a day group. */
type PlanningTask = {
    id: string;
    apartmentName: string;
    address: string;
    estimation: string;
    time: string;
    image: any;
    status: string;
};

function toISO(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}



function TaskCard({
    item,
    onPress,
}: {
    item: PlanningTask;
    onPress: () => void;
}) {
    const t = useT();
    return (
        <Pressable style={styles.taskCard} onPress={onPress}>
            <AppImage source={item.image} style={styles.taskThumb} contentFit="cover" />
            <View style={styles.taskInfo}>
                <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                    {item.apartmentName}
                </Caption2>
                <View style={styles.row}>
                    <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                    <Caption4
                        color={Colors.TEXT_COLOR}
                        numberOfLines={1}
                        style={{ flex: 1 }}
                    >
                        {item.address}
                    </Caption4>
                </View>
                <View style={styles.estimationBadge}>
                    <Caption4 color={Colors.TEXT_COLOR}>
                        {t("Estimation: {value}", { value: item.estimation })}
                    </Caption4>
                </View>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.time}</Body4>
                <CleaningStatusBadge status={item.status} />
            </View>
            <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
        </Pressable>
    );
}

export default function PlanningScreen() {
    const t = useT();
    const locale = useIntlLocale();
    const router = useRouter();

    const todayISO = toISO(new Date());
    const [selectedDate, setSelectedDate] = useState(todayISO);

    // Fetch the whole month the selected day belongs to, so moving across the
    // date strip inside that month never refetches.
    const month = selectedDate.slice(0, 7); // "YYYY-MM"
    const { data, isLoading, refetch } = useGetCleanerPlanningQuery(
        { month },
        // Host-side changes (validation, rejected proof…) show up without a
        // manual refresh: on screen focus and every minute while open.
        { refetchOnFocus: true, pollingInterval: 60_000 },
    );
    // The month on screen while scrolling the strip (may differ from the
    // selected day's month): fetched too, so its days get their dots.
    const [visibleMonth, setVisibleMonth] = useState(month);
    const { data: visibleData, refetch: refetchVisible } = useGetCleanerPlanningQuery(
        { month: visibleMonth },
        { skip: visibleMonth === month, refetchOnFocus: true },
    );
    const { refreshing, onRefresh } = useRefresh(
        visibleMonth === month ? [refetch] : [refetch, refetchVisible],
    );

    // Days with at least one mission get a dot on the strip.
    const activeDates = useMemo(() => {
        const days = [...(data?.days ?? []), ...(visibleData?.days ?? [])];
        return days.filter((d) => d.count > 0).map((d) => d.date);
    }, [data, visibleData]);

    const isToday = selectedDate === todayISO;
    const isPastDay = selectedDate < todayISO;

    // The backend already grouped missions by day in this device's timezone.
    const tasks = useMemo<PlanningTask[]>(() => {
        const group = (data?.groups ?? []).find((g) => g.date === selectedDate);
        return (group?.missions ?? []).map((mission) => {
            const accommodation = mission.accommodation as any;
            return {
                id: mission._id,
                apartmentName: accommodation?.name ?? 'Accommodation',
                address: accommodationLocation(accommodation),
                // The host's cleaning duration, never the arrival–departure window.
                estimation: cleaningEstimate(accommodation, mission),
                time: formatCleaningWindow(mission.checkInTime, mission.checkOutTime),
                image: accommodationPhoto(accommodation),
                status: mission.status,
            };
        });
    }, [data, selectedDate]);

    const missionLabel =
        tasks.length === 1 ? t('1 mission') : t('{n} missions', { n: tasks.length });

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Page title */}
                <View style={styles.titleRow}>
                    <H6 color={Colors.PRIMARY_TEXT}>{t("Planning")}</H6>
                    <Caption3 color={Colors.TEXT_COLOR}>{t("Your upcoming mission")}</Caption3>
                </View>

                {/* Date scroll */}
                <DateScrollPicker
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    activeDates={activeDates}
                    onVisibleMonthChange={setVisibleMonth}
                />

                
                <View style={styles.sectionHeader}>
                    <View style={styles.dayTitle}>
                        <Body5 color={isPastDay ? Colors.TEXT_COLOR : Colors.PRIMARY_TEXT}>
                            {formatDayKey(selectedDate, undefined, locale)}
                        </Body5>
                        {(isToday || isPastDay) && (
                            <View style={[styles.dayTag, isToday ? styles.dayTagToday : styles.dayTagPast]}>
                                <Caption4 color={isToday ? Colors.COLOR_ACTIVE : Colors.TEXT_COLOR}>
                                    {isToday ? t("Today") : t("Past day")}
                                </Caption4>
                            </View>
                        )}
                    </View>
                    {tasks.length > 0 && (
                        <View style={styles.missionBadge}>
                            <Caption3 color={Colors.TEXT_COLOR}>{missionLabel}</Caption3>
                        </View>
                    )}
                </View>

                {/* Task list */}
                {isLoading ? (
                    <SkeletonList count={3} />
                ) : tasks.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {t("No missions for this day")}
                        </Caption3>
                    </View>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            item={task}
                            onPress={() =>
                                router.push({
                                    pathname: '/cleaner/task/task_detail' as any,
                                    params: { taskId: task.id },
                                })
                            }
                        />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: {
        paddingBottom: hp(100),
    },
    titleRow: {
        marginVertical: hp(20),
        gap: hp(2),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(15),      // ← date picker এর ঠিক নিচে
        marginBottom: hp(12),
    },
    missionBadge: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(20),
        paddingHorizontal: wp(12),
        paddingVertical: hp(5),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    dayTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        flexShrink: 1,
    },
    dayTag: {
        paddingHorizontal: wp(8),
        paddingVertical: hp(2),
        borderRadius: wp(10),
    },
    dayTagToday: { backgroundColor: '#E2F6E8' },
    dayTagPast: { backgroundColor: '#EDEDED' },
    taskCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(12),
        overflow: 'hidden',
        gap: wp(12),
        padding: wp(8),
    },
    taskThumb: {
        width: wp(110),
        height: hp(120),
        flexShrink: 0,
        borderRadius:wp(8),
        padding:6
    },
    taskInfo: {
        flex: 1,
        gap: hp(5),
        paddingVertical: hp(12),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
    },
    estimationBadge: {
        alignSelf: 'flex-start',
        backgroundColor: "#EEEEEE",
        borderRadius: wp(6),
        paddingHorizontal: wp(8),
        paddingVertical: hp(3),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    emptyBox: {
        alignItems: 'center',
        paddingVertical: hp(40),
    },
});