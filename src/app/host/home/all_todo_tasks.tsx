import { ToDoCard } from '@/components/host/home/ToDoCard';
import { ConnectionTrackCard, ScheduleTrackCard } from '@/components/host/tracking/TrackingCards';
import SectionTitle from '@/components/shared/SectionTitle';
import { SkeletonList } from '@/components/shared/Skeleton';
import { showToast } from '@/components/shared/Toast';
import { Caption1, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { useT } from '@/i18n';
import { getApiErrorMessage } from '@/lib/apiError';
import { toDateKey } from '@/lib/datetime';
import { ApiTodoEvent, toTodoTask } from '@/lib/mappers';
import { useDeleteTodoItemMutation, useGetHostDashboardQuery } from '@/redux/services/accommodationApi';
import { useGetHostAssignmentsQuery } from '@/redux/services/assignmentApi';
import {
    useGetHostScheduleSummaryQuery,
    useGetHostSchedulesQuery,
} from '@/redux/services/scheduleApi';
import type { CleanerAssignment, CleaningSchedule } from '@/redux/types';
import { Task } from '@/types/hostTypes';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

/**
 * « Suivi » — one page to follow everything the host started:
 *  - Actions: what needs the host now (proof, payment, refusal, problem)
 *  - Today / Upcoming: cleanings by cleaning date, soonest first
 *  - Requests: every cleaning request, its status and progress
 *  - Cleaners: connection requests (pending / accepted / refused / left)
 * Lists refresh on open, when the app returns, every minute, and live
 * through the socket (useScheduleLiveUpdates in the host tabs).
 */
export type TrackingTab = 'actions' | 'today' | 'upcoming' | 'requests' | 'connections';

const TABS: { key: TrackingTab; label: string }[] = [
    { key: 'actions', label: 'Actions' },
    { key: 'today', label: 'Today' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'requests', label: 'Cleaning requests' },
    { key: 'connections', label: 'Cleaners' },
];

const LIVE = { pollingInterval: 60_000, refetchOnFocus: true, refetchOnMountOrArgChange: true } as const;

const dayKey = (s: CleaningSchedule) => toDateKey(s.date);

export default function TrackingScreen() {
    const t = useT();
    const router = useRouter();
    const params = useLocalSearchParams<{ tab?: TrackingTab }>();
    const [tab, setTab] = useState<TrackingTab>(
        TABS.some((x) => x.key === params.tab) ? (params.tab as TrackingTab) : 'actions',
    );
    const today = toDateKey(new Date());

    const { data: summary, refetch: refetchSummary } = useGetHostScheduleSummaryQuery(undefined, LIVE);

    // Only the open tab's lists are loaded.
    const dashboard = useGetHostDashboardQuery({ page: 1, limit: 100 }, { ...LIVE, skip: tab !== 'actions' });
    const toPay = useGetHostSchedulesQuery({ view: 'pay_now', limit: 50 }, { ...LIVE, skip: tab !== 'actions' });
    const todayQ = useGetHostSchedulesQuery({ when: 'today', limit: 50 }, { ...LIVE, skip: tab !== 'today' });
    const upcomingQ = useGetHostSchedulesQuery(
        { when: 'upcoming', order: 'asc', limit: 50 },
        { ...LIVE, skip: tab !== 'upcoming' },
    );
    const requestsQ = useGetHostSchedulesQuery({ limit: 50 }, { ...LIVE, skip: tab !== 'requests' });
    const connectionsQ = useGetHostAssignmentsQuery({ limit: 50 }, { ...LIVE, skip: tab !== 'connections' });

    const active = {
        actions: dashboard,
        today: todayQ,
        upcoming: upcomingQ,
        requests: requestsQ,
        connections: connectionsQ,
    }[tab];
    const { refreshing, onRefresh } = useRefresh([active.refetch, refetchSummary, ...(tab === 'actions' ? [toPay.refetch] : [])]);

    // Actions: the backend's card feed (one card per cleaning / request,
    // following its current status). "In progress" needs nothing from the host.
    const events = useMemo(
        () =>
            ((dashboard.data?.to_do?.data ?? []) as ApiTodoEvent[]).filter(
                (event) => event.status !== 'in_progress',
            ),
        [dashboard.data],
    );
    const actionTasks = useMemo(() => events.map(toTodoTask), [events]);

    // The date filters are also applied here, so the lists stay right even
    // before the server understands `when` (and sorted soonest first).
    const todayRows = useMemo(
        () => (todayQ.data?.data ?? []).filter((s) => dayKey(s) === today),
        [todayQ.data, today],
    );
    const upcomingRows = useMemo(
        () =>
            (upcomingQ.data?.data ?? [])
                .filter((s) => dayKey(s) > today)
                .sort((a, b) => dayKey(a).localeCompare(dayKey(b))),
        [upcomingQ.data, today],
    );

    const [deleteTodoItem] = useDeleteTodoItemMutation();

    const openSchedule = (schedule: CleaningSchedule) =>
        router.push({
            pathname: '/host/home/task_status',
            params: { taskId: schedule._id, kind: 'schedule', eventStatus: schedule.status },
        } as any);

    const openConnection = (assignment: CleanerAssignment) => {
        const cleanerId = (assignment.cleaner as any)?._id;
        if (!cleanerId) return;
        router.push({
            pathname: '/host/housing/housekeeper_detail',
            params: { cleanerId },
        } as any);
    };

    const openTask = (item: Task) => {
        const source = events.find((e) => (e.scheduleId ?? e.assignmentId) === item.id);
        router.push({
            pathname: '/host/home/task_status',
            params: {
                taskId: item.id,
                kind: source?.kind ?? 'schedule',
                status: item.status,
                eventStatus: source?.status,
            },
        } as any);
    };

    const deleteTask = async (task: Task) => {
        const source = events.find((e) => (e.scheduleId ?? e.assignmentId) === task.id);
        const kind = source?.kind ?? task.kind ?? 'schedule';
        const id = source?.scheduleId ?? source?.assignmentId ?? task.recordId ?? task.id;
        try {
            await deleteTodoItem({ kind, id }).unwrap();
            showToast(t('Notification removed'), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t('Could not remove notification.')), 'error');
        }
    };

    const counts: Partial<Record<TrackingTab, number>> = {
        actions: summary
            ? summary.toPay + summary.proofToValidate + summary.problems + summary.notDone
            : undefined,
        today: summary?.today,
        upcoming: summary?.upcoming,
        requests: summary?.awaitingResponse,
        connections: summary?.pendingConnections,
    };

    const empty = (text: string) => (
        <Caption3 color={Colors.TEXT_COLOR} style={styles.empty}>
            {text}
        </Caption3>
    );

    const renderTab = () => {
        if (active.isLoading) return <SkeletonList count={3} />;
        if (active.isError) {
            return (
                <View style={styles.errorBox}>
                    <Caption1 color={Colors.PRIMARY_TEXT}>{t('Could not load this list.')}</Caption1>
                    <Pressable onPress={() => active.refetch()} hitSlop={8} style={{ marginTop: hp(8) }}>
                        <Caption1 color={Colors.BRAND_PRIMARY}>{t('Try again')}</Caption1>
                    </Pressable>
                </View>
            );
        }

        switch (tab) {
            case 'actions': {
                const payRows = toPay.data?.data ?? [];
                if (!actionTasks.length && !payRows.length) return empty(t('Nothing to do right now.'));
                return (
                    <>
                        {payRows.length > 0 && (
                            <>
                                <Caption2 color={Colors.TEXT_COLOR} style={styles.groupTitle}>
                                    {t('TO PAY')}
                                </Caption2>
                                {payRows.map((s) => (
                                    <ScheduleTrackCard key={`pay-${s._id}`} schedule={s} onPress={openSchedule} />
                                ))}
                            </>
                        )}
                        {actionTasks.length > 0 && (
                            <>
                                <Caption2 color={Colors.TEXT_COLOR} style={styles.groupTitle}>
                                    {t('LATEST UPDATES')}
                                </Caption2>
                                {actionTasks.map((task) => (
                                    <View key={task.id} style={{ marginBottom: hp(12) }}>
                                        <ToDoCard item={task} onPress={openTask} onDelete={deleteTask} />
                                    </View>
                                ))}
                            </>
                        )}
                    </>
                );
            }
            case 'today':
                return todayRows.length
                    ? todayRows.map((s) => <ScheduleTrackCard key={s._id} schedule={s} onPress={openSchedule} />)
                    : empty(t('No cleaning planned today.'));
            case 'upcoming':
                return upcomingRows.length
                    ? upcomingRows.map((s) => <ScheduleTrackCard key={s._id} schedule={s} onPress={openSchedule} />)
                    : empty(t('No upcoming cleaning.'));
            case 'requests': {
                const rows = requestsQ.data?.data ?? [];
                return rows.length
                    ? rows.map((s) => <ScheduleTrackCard key={s._id} schedule={s} onPress={openSchedule} />)
                    : empty(t('You have not sent any cleaning request yet.'));
            }
            case 'connections': {
                const rows = connectionsQ.data?.data ?? [];
                return rows.length
                    ? rows.map((a) => <ConnectionTrackCard key={a._id} assignment={a} onPress={openConnection} />)
                    : empty(t('No cleaner request yet.'));
            }
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t('Tracking')} />

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabs}
                style={styles.tabsWrap}
            >
                {TABS.map(({ key, label }) => {
                    const selected = key === tab;
                    const count = counts[key];
                    return (
                        <Pressable
                            key={key}
                            onPress={() => setTab(key)}
                            style={[styles.tab, selected && styles.tabSelected]}
                            accessibilityRole="tab"
                            accessibilityState={{ selected }}
                        >
                            <Caption1 color={selected ? Colors.TEXT_WHITE : Colors.PRIMARY_TEXT}>
                                {t(label)}
                            </Caption1>
                            {!!count && (
                                <View style={[styles.badge, selected && styles.badgeSelected]}>
                                    <Caption3 color={selected ? Colors.PRIMARY_TEXT : Colors.TEXT_WHITE}>
                                        {count}
                                    </Caption3>
                                </View>
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {renderTab()}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    tabsWrap: { flexGrow: 0, marginBottom: hp(12) },
    tabs: { gap: wp(8), paddingVertical: hp(4) },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        paddingHorizontal: wp(14),
        paddingVertical: hp(8),
        borderRadius: wp(20),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    tabSelected: { backgroundColor: Colors.PRIMARY_TEXT, borderColor: Colors.PRIMARY_TEXT },
    badge: {
        minWidth: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        paddingHorizontal: wp(5),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.BRAND_PRIMARY,
    },
    badgeSelected: { backgroundColor: Colors.TEXT_WHITE },
    scroll: { paddingBottom: hp(40) },
    groupTitle: { letterSpacing: 0.6, marginTop: hp(4), marginBottom: hp(10) },
    empty: { marginTop: hp(30), textAlign: 'center' },
    errorBox: {
        padding: wp(14),
        borderRadius: wp(12),
        backgroundColor: '#FF383C14',
        borderWidth: 1,
        borderColor: '#FF383C40',
    },
});
