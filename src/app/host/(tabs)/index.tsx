import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { Body2, Body6, Caption1, Caption3, Caption4, Caption5, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';

import { QuickAccess } from '@/components/host/home/QuickAccess';
import { RecommendedScheduleCard } from '@/components/host/home/RecommendedScheduleCard';
import { ToDoCard } from '@/components/host/home/ToDoCard';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Task } from '@/types/hostTypes';
import { useRefresh } from '@/hooks/useRefresh';
import {
    ApiRecommendation,
    ApiTodoEvent,
    toRecommendedSchedule,
    toTodoTask,
} from '@/lib/mappers';
import { showToast } from '@/components/shared/Toast';
import { getApiErrorMessage } from '@/lib/apiError';
import { useDeleteTodoItemMutation, useGetHostDashboardQuery } from '@/redux/services/accommodationApi';
import { useGetHostScheduleSummaryQuery } from '@/redux/services/scheduleApi';
import { TONE_COLORS, type Tone } from '@/lib/hostTracking';
import type { TrackingTab } from '@/app/host/home/all_todo_tasks';
import { AppImage } from '@/components/shared/AppImage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { FlatList, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Tracking counters ─────────────────────────────────────────────────────────
function CounterTile({
    value,
    label,
    tone,
    onPress,
}: {
    value: number;
    label: string;
    tone: Tone;
    onPress: () => void;
}) {
    const c = TONE_COLORS[tone];
    return (
        <Pressable
            style={[styles.counter, value > 0 && { backgroundColor: c.bg, borderColor: 'transparent' }]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={`${value} ${label}`}
        >
            <Body2 color={value > 0 ? c.fg : Colors.TEXT_COLOR}>{value}</Body2>
            <Caption4 color={Colors.PRIMARY_TEXT} numberOfLines={2}>{label}</Caption4>
        </Pressable>
    );
}

// ── Empty states ──────────────────────────────────────────────────────────────
function EmptySchedule() {
    const t = useT();
    return (
        <View style={styles.emptyBox}>
            <AppImage
                source={IMAGE_COMPONENTS.recomendedEmpty}
                style={styles.emptyImage}
                contentFit="contain"
            />
            <View>
                <Caption1 color={"#727272"}>{t("No Recommended cleaning")}</Caption1>
                <Caption4 color={"#000000"}>{t("You are up to date! All your upcomming")}</Caption4>
                <Caption5 color={"#727272"}>{t("Cleanings are scheduled")}</Caption5>
            </View>
        </View>
    );
}

function EmptyToDo() {
    const t = useT();
    return (
        <View style={styles.emptyBox}>
            <AppImage
                source={IMAGE_COMPONENTS.emptyToDo}
                style={styles.emptyImage}
                contentFit="contain"
            />
            <View>
                <Caption1 color={"#727272"}>{t("No task to do")}</Caption1>
                <Caption4 color={"#000000"}>{t("You have no pending task")}</Caption4>
                <Caption5 color={"#727272"}>{t("Enjoy your time")}</Caption5>
            </View>
        </View>
    );
}

function ViewAllButton({ onPress }: { onPress: () => void }) {
    const t = useT();
    return (
        <Pressable style={styles.viewAllBtn} onPress={onPress}>
            <Caption3 style={{ textAlign: "center" }} color={Colors.TEXT_COLOR}>{t("View All")}</Caption3>
        </Pressable>
    );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HostHomeScreen() {
    const t = useT();
    const router = useRouter();

    // One request feeds both sections: the recommended turnovers derived from
    // the connected iCal feeds, and the activity the cleaners generated.
    const { data, isLoading, refetch } = useGetHostDashboardQuery(
        { page: 1, limit: 20 },
        { refetchOnFocus: true },
    );
    // Counters for the tracking tiles; live via the socket, else every minute.
    const { data: summary, refetch: refetchSummary } = useGetHostScheduleSummaryQuery(undefined, {
        pollingInterval: 60_000,
        refetchOnFocus: true,
    });
    const { refreshing, onRefresh } = useRefresh([refetch, refetchSummary]);
    const [deleteTodoItem] = useDeleteTodoItemMutation();

    const openTracking = (tab: TrackingTab) =>
        router.push({ pathname: '/host/home/all_todo_tasks', params: { tab } } as any);

    // Cleaners answer from their own phone: refresh the to-do feed whenever
    // the host comes back to this tab.
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const recommendations = useMemo(
        () => (data?.recommended_schedule ?? []) as ApiRecommendation[],
        [data],
    );
    const topRecommendation = recommendations[0];

    // Filter out in_progress tasks that don't need host action
    const todoEvents = useMemo(
        () =>
            ((data?.to_do?.data ?? []) as ApiTodoEvent[]).filter(
                (event) =>
                    event.status !== 'in_progress' &&
                    !/progress|en\s*cours/i.test(event.label || ''),
            ),
        [data],
    );
    const todoTasks = useMemo(() => todoEvents.map(toTodoTask), [todoEvents]);
    const visibleTasks = todoTasks.slice(0, 2);

    const handleTaskPress = (item: Task) => {
        const source = todoEvents.find(
            (event) => (event.scheduleId ?? event.assignmentId) === item.id,
        );
        router.push({
            pathname: '/host/home/task_status',
            params: {
                taskId: item.id,
                kind: source?.kind ?? 'schedule',
                status: item.status,
                // Backend status ("left", "expired"…) for the exact wording.
                eventStatus: source?.status,
            },
        } as any);
    };

    const handleDeleteTask = async (task: Task) => {
        const source = todoEvents.find(
            (event) => (event.scheduleId ?? event.assignmentId) === task.id,
        );
        const kind = source?.kind ?? task.kind ?? 'schedule';
        const id = source?.scheduleId ?? source?.assignmentId ?? task.recordId ?? task.id;
        try {
            await deleteTodoItem({ kind, id }).unwrap();
            showToast(t("Notification removed"), 'success');
            refetch();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not remove notification.")), 'error');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <H2 color={Colors.PRIMARY_TEXT} style={styles.pageTitle}>{t("Home")}</H2>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* ── Recommended Schedule ── */}
                <Body2 color={Colors.PRIMARY_TEXT}>{t("Recommended Schedule")}</Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.sectionSub}>
                    {t("Check the details and validate to launch the mission.")}
                </Caption3>

                {isLoading ? (
                    <SkeletonList count={2} />
                ) : topRecommendation ? (
                    <RecommendedScheduleCard
                        data={toRecommendedSchedule(topRecommendation)}
                        onPress={() =>
                            router.push({
                                pathname: '/host/home/recommended_cleaning',
                                params: {
                                    accommodationId: topRecommendation.accommodation._id,
                                    date: topRecommendation.recommendedDate,
                                    checkInTime: topRecommendation.checkInTime ?? '',
                                    checkOutTime: topRecommendation.checkOutTime ?? '',
                                    cleanerId: topRecommendation.cleaner?._id ?? '',
                                },
                            } as any)
                        }
                    />
                ) : (
                    <EmptySchedule />
                )}

                {/* "View All" only once there is more than the one shown here */}
                {(data?.recommended_total ?? 0) > 1 && (
                    <ViewAllButton
                        onPress={() =>
                            router.push('/host/home/all_recommended_schedules' as any)
                        }
                    />
                )}

                {/* ── To do ── */}
                <Body2 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("To do")}
                </Body2>
                <Body6 color={Colors.TEXT_COLOR} style={styles.sectionSub}>
                    {t("Find your current tasks and requests here")}
                </Body6>

                {summary && (
                    <View style={styles.counters}>
                        <CounterTile value={summary.awaitingResponse} label={t('Awaiting response')} tone="waiting" onPress={() => openTracking('requests')} />
                        <CounterTile value={summary.toPay} label={t('To pay')} tone="action" onPress={() => openTracking('actions')} />
                        <CounterTile value={summary.proofToValidate} label={t('Proof to validate')} tone="action" onPress={() => openTracking('actions')} />
                        <CounterTile value={summary.today} label={t('Today')} tone="success" onPress={() => openTracking('today')} />
                        <CounterTile value={summary.upcoming} label={t('Upcoming')} tone="success" onPress={() => openTracking('upcoming')} />
                        <CounterTile value={summary.pendingConnections} label={t('Cleaner requests')} tone="waiting" onPress={() => openTracking('connections')} />
                    </View>
                )}

                {isLoading ? (
                    <SkeletonList count={2} />
                ) : todoTasks.length === 0 ? (
                    <EmptyToDo />
                ) : (
                    <FlatList
                        data={visibleTasks}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <ToDoCard
                                item={item}
                                onPress={handleTaskPress}
                                onDelete={handleDeleteTask}
                            />
                        )}
                        scrollEnabled={false}
                        contentContainerStyle={styles.todoList}
                    />
                )}

                {/* Always reachable: the full tracking page (requests, today,
                    upcoming, cleaners), not only when there are many cards. */}
                <ViewAllButton onPress={() => openTracking('actions')} />

                {/* ── Quick access ── */}
                <Body2 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("Quick access")}
                </Body2>
                <QuickAccess
                    onSchedule={() => router.push('/host/home/schedule_cleaning' as any)}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
        paddingTop: hp(30)
    },
    scroll: {
        paddingBottom: hp(80)
    },
    pageTitle: {
        marginBottom: hp(16)
    },
    sectionTitle: { marginTop: hp(24), marginBottom: hp(4) },
    sectionSub: { marginBottom: hp(12) },
    todoList: { gap: hp(12) },
    counters: { flexDirection: 'row', flexWrap: 'wrap', gap: wp(8), marginBottom: hp(14) },
    counter: {
        width: '31.5%',
        minHeight: hp(68),
        padding: wp(10),
        borderRadius: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        justifyContent: 'space-between',
    },
    loader: { paddingVertical: hp(30) },
    emptyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        paddingVertical: hp(20),
    },
    viewAllBtn: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        marginTop: hp(10),
        borderRadius: wp(8),
        padding: hp(12)
    },
    emptyImage: { width: wp(80), height: wp(80) },
});
