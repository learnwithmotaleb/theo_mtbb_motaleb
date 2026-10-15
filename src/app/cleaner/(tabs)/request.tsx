import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption2, Caption3, Caption4, Caption5, H3 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { getApiErrorMessage } from '@/lib/apiError';
import { accommodationLocation, accommodationPhoto, personName, toCleanerRequest } from '@/lib/mappers';
import { cleaningHours, extractCleaningDuration, formatCleaningWindow, formatDayKey } from '@/lib/datetime';
import { useFormat } from '@/lib/useFormat';
import {
    useGetMyRequestsQuery,
    useRespondToAssignmentMutation,
} from '@/redux/services/assignmentApi';
import {
    useGetCleanerSchedulesQuery,
    useRespondToScheduleMutation,
} from '@/redux/services/scheduleApi';
import { useStartConversationMutation } from '@/redux/services/chatApi';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

/** A pending assignment, as the add-request card renders it. */
type AddRequestItem = ReturnType<typeof toCleanerRequest>;

/** One host, aggregated from the pending requests they sent. */
type ConnectionRequest = {
    id: string;
    name: string;
    image: any;
    propertiesCount: number;
};

// ── 1. Cleaning Request Card (Scheduled Missions) ────────────────────────────
function ScheduledCleaningRequestCard({
    item,
    onAccept,
    onRefuse,
    onPress,
}: {
    item: {
        id: string;
        apartmentName: string;
        address: string;
        image: any;
        date: string;
        time: string;
        estimation: string;
        price: string;
    };
    onAccept: () => void;
    onRefuse: () => void;
    onPress: () => void;
}) {
    const t = useT();
    return (
        <Pressable style={styles.cleaningCard} onPress={onPress}>
            <View style={styles.cardTop}>
                <AppImage source={item.image} style={styles.cardThumb} contentFit="cover" />
                <View style={styles.cardInfo}>
                    <Caption2 color={Colors.TEXT_COLOR} numberOfLines={2}>
                        {item.apartmentName}
                    </Caption2>
                    <View style={styles.row}>
                        <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                        <Caption4 color={Colors.TEXT_COLOR} numberOfLines={1} style={{ flex: 1 }}>
                            {item.address}
                        </Caption4>
                    </View>
                    <View style={styles.row}>
                        <ClockIcon size={13} color={Colors.TEXT_COLOR} />
                        <Caption4 color={Colors.TEXT_COLOR}>
                            {item.date} • {item.time}
                        </Caption4>
                    </View>
                    <View style={styles.scheduleBadgeRow}>
                        <View style={styles.estimationBadge}>
                            <Caption4 color={Colors.TEXT_COLOR}>
                                {t("Estimation: {value}", { value: item.estimation })}
                            </Caption4>
                        </View>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{item.price}</Caption3>
                    </View>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.actionRow}>
                <CustomButton
                    title={t("Refuse")}
                    color="#FF383C"
                    onPress={onRefuse}
                    borderRadius={wp(5)}
                    borderColor="#FF383C1A"
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title={t("Accept")}
                    color="#FFFFFF"
                    onPress={onAccept}
                    borderRadius={wp(5)}
                    borderColor="#FF383C1A"
                    backgroundColor={"#000000"}
                    width="49%"
                />
            </View>
        </Pressable>
    );
}

// ── 2. Add Request Card (Requests to be added to a new property) ──────────────
function AddRequestCard({
    item,
    onAccept,
    onRefuse,
    onPress,
}: {
    item: AddRequestItem;
    onAccept: () => void;
    onRefuse: () => void;
    onPress: () => void;
}) {
    const t = useT();
    return (
        <Pressable style={styles.cleaningCard} onPress={onPress}>
            <View style={styles.cardTop}>
                <AppImage source={item.image} style={styles.cardThumb} contentFit="cover" />
                <View style={styles.cardInfo}>
                    <Caption2 color={Colors.TEXT_COLOR} numberOfLines={2}>
                        {item.apartmentName}
                    </Caption2>
                    <View style={styles.row}>
                        <LocationIcon size={13} color={Colors.TEXT_COLOR} />
                        <Caption4 color={Colors.TEXT_COLOR}>{item.address}</Caption4>
                    </View>
                    <View style={styles.priceBadge}>
                        <Caption4 color={Colors.TEXT_COLOR}>{t("Price per cleaning")}</Caption4>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{item.pricePerCleaning}</Caption3>
                    </View>
                    {item.description ? (
                        <Caption5 color={Colors.TEXT_COLOR}>{item.description}</Caption5>
                    ) : null}
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.actionRow}>
                <CustomButton
                    title={t("Refuse")}
                    color="#FF383C"
                    onPress={onRefuse}
                    borderRadius={wp(5)}
                    borderColor="#FF383C1A"
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title={t("Accept")}
                    color="#FFFFFF"
                    onPress={onAccept}
                    borderRadius={wp(5)}
                    borderColor="#FF383C1A"
                    backgroundColor={"#000000"}
                    width="49%"
                />
            </View>
        </Pressable>
    );
}

// ── Connection Request Row ────────────────────────────────────────────────────
function ConnectionRequestRow({
    item,
    onView,
}: {
    item: ConnectionRequest;
    onView: () => void;
}) {
    const t = useT();
    return (
        <View style={styles.connectionRow}>
            <AppImage source={item.image} style={styles.connectionAvatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.name}</Body4>
                <Caption3 color={Colors.TEXT_COLOR}>{item.propertiesCount} Properties</Caption3>
            </View>
            <Pressable style={styles.viewBtn} onPress={onView}>
                <Caption3 color={Colors.TEXT_COLOR}>{t("View")}</Caption3>
            </Pressable>
        </View>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function RequestsScreen() {
    const t = useT();
    const router = useRouter();
    const { formatMoney, formatDate } = useFormat();

    // 1. Cleaning Requests: Scheduled cleaning missions waiting for cleaner's answer
    const {
        data: scheduleData,
        isLoading: isScheduleLoading,
        refetch: refetchSchedule,
    } = useGetCleanerSchedulesQuery({ status: 'scheduled', page: 1, limit: 50 });

    // 2. Add Requests: Requests from hosts to add this cleaner to a new property
    const {
        data: assignmentData,
        isLoading: isAssignmentLoading,
        refetch: refetchAssignment,
    } = useGetMyRequestsQuery({ status: 'pending', page: 1, limit: 50 });

    const { refreshing, onRefresh } = useRefresh([refetchSchedule, refetchAssignment]);

    const [respondAssignment, { isLoading: isRespondingAssignment }] = useRespondToAssignmentMutation();
    const [respondSchedule, { isLoading: isRespondingSchedule }] = useRespondToScheduleMutation();
    const [startConversation] = useStartConversationMutation();

    // Cleaning missions waiting for response
    const cleaningRequests = useMemo(() => {
        return (scheduleData?.data ?? []).map((mission) => {
            const accommodation = (mission.accommodation ?? {}) as any;
            return {
                id: mission._id,
                accommodationId: accommodation?._id ?? '',
                apartmentName: accommodation?.name ?? t('Accommodation'),
                address: accommodationLocation(accommodation),
                image: accommodationPhoto(accommodation),
                date: formatDayKey(mission.dayKey) || formatDate(mission.date, { weekday: 'short', day: 'numeric', month: 'short' }),
                time: formatCleaningWindow(mission.checkInTime, mission.checkOutTime),
                estimation: (() => {
                    const hostDuration = extractCleaningDuration(accommodation, mission);
                    if (hostDuration) return hostDuration;
                    const hours =
                        Math.abs(mission.estimationHours ?? 0) ||
                        cleaningHours(mission.checkInTime, mission.checkOutTime);
                    return hours ? `${hours}h` : '—';
                })(),
                price: formatMoney(mission.payAmount ?? accommodation?.cleaningRate ?? 0, mission.payCurrency),
            };
        });
    }, [scheduleData, formatMoney, formatDate, t]);

    // Requests to be added to a new property
    const addRequests = useMemo(
        () => (assignmentData?.data ?? []).map(toCleanerRequest),
        [assignmentData],
    );

    // Host connections aggregated from pending add requests
    const connections = useMemo<ConnectionRequest[]>(() => {
        const byHost = new Map<string, ConnectionRequest>();
        addRequests.forEach((request) => {
            if (!request.hostId) return;
            const existing = byHost.get(request.hostId);
            if (existing) {
                existing.propertiesCount += 1;
                return;
            }
            byHost.set(request.hostId, {
                id: request.hostId,
                name: request.hostName,
                image: request.hostImage,
                propertiesCount: request.hostProperties || 1,
            });
        });
        return Array.from(byHost.values());
    }, [addRequests]);

    // Handler for accepting/refusing scheduled cleanings
    const handleRespondSchedule = async (
        id: string,
        action: 'accept' | 'refuse',
    ) => {
        if (isRespondingSchedule) return;
        try {
            await respondSchedule({ id, action }).unwrap();
            showToast(
                action === 'accept' ? t('Mission accepted') : t('Mission refused'),
                'success',
            );
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send your answer.")), 'error');
        }
    };

    // Handler for accepting/refusing requests to be added to a property
    const handleRespondAssignment = async (
        item: AddRequestItem,
        action: 'accept' | 'refuse',
    ) => {
        if (isRespondingAssignment) return;
        try {
            await respondAssignment({ assignmentId: item.id, action }).unwrap();
            if (action === 'accept' && item.hostId) {
                // As soon as cleaner adds host, host profile automatically appears in Messages section
                await startConversation({ receiverId: item.hostId }).unwrap().catch(() => {});
            }
            showToast(
                action === 'accept' ? t('Request accepted') : t('Request refused'),
                'success',
            );
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send your answer.")), 'error');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={{ marginTop: hp(20), paddingHorizontal: wp(20) }}>
                <H3 color={Colors.PRIMARY_TEXT} style={styles.pageTitle}>
                    {t("Requests")}
                </H3>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.pageSubtitle}>
                    {t("Hosts want to add your for regular cleaning")}
                </Caption3>
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* 1. Cleaning Requests (Demandes de ménage) */}
                <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("Cleaning Requests")}
                </Body4>
                {isScheduleLoading ? (
                    <SkeletonList count={2} />
                ) : cleaningRequests.length === 0 ? (
                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(16) }}>
                        {t("No cleaning requests right now.")}
                    </Caption3>
                ) : (
                    cleaningRequests.map((item) => (
                        <ScheduledCleaningRequestCard
                            key={item.id}
                            item={item}
                            onPress={() =>
                                router.push({
                                    pathname: '/cleaner/task/details',
                                    params: { taskId: item.id },
                                } as any)
                            }
                            onAccept={() => handleRespondSchedule(item.id, 'accept')}
                            onRefuse={() => handleRespondSchedule(item.id, 'refuse')}
                        />
                    ))
                )}

                {/* 2. Add Requests (Demandes de mise en relation / Add Requests) */}
                <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("Add Requests")}
                </Body4>
                {isAssignmentLoading ? (
                    <SkeletonList count={2} />
                ) : addRequests.length === 0 && connections.length === 0 ? (
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {t("No add requests right now.")}
                    </Caption3>
                ) : (
                    <>
                        {addRequests.map((item) => (
                            <AddRequestCard
                                key={item.id}
                                item={item}
                                onPress={() =>
                                    router.push({
                                        pathname: '/cleaner/requests/team_detail',
                                        params: {
                                            requestId: item.id,
                                            accommodationId: item.accommodationId,
                                        },
                                    } as any)
                                }
                                onAccept={() => handleRespondAssignment(item, 'accept')}
                                onRefuse={() => handleRespondAssignment(item, 'refuse')}
                            />
                        ))}

                        {connections.length > 0 && (
                            <View style={styles.connectionList}>
                                {connections.map((item) => (
                                    <ConnectionRequestRow
                                        key={item.id}
                                        item={item}
                                        onView={() =>
                                            router.push({
                                                pathname: '/cleaner/requests/host_profile',
                                                params: { hostId: item.id },
                                            } as any)
                                        }
                                    />
                                ))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(100) },
    pageTitle: { marginTop: hp(8), marginBottom: hp(4) },
    pageSubtitle: { marginBottom: hp(20) },
    sectionTitle: { marginBottom: hp(12), marginTop: hp(8) },

    // Cleaning card
    cleaningCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(16),
        overflow: 'hidden',
    },
    cardTop: {
        flexDirection: 'row',
        gap: wp(12),
        padding: wp(12),
    },
    cardThumb: {
        width: wp(110),
        height: hp(120),
        borderRadius: wp(8),
    },
    cardInfo: { flex: 1, gap: hp(6) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    priceBadge: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(8),
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
        gap: hp(2),
    },
    scheduleBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(2),
    },
    estimationBadge: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(6),
        paddingHorizontal: wp(8),
        paddingVertical: hp(3),
    },
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: wp(8),
        paddingVertical: hp(10),
        gap: wp(5),
    },

    // Connection list
    connectionList: {
        borderRadius: wp(12),
        marginTop: hp(4),
    },
    connectionRow: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        marginBottom: hp(10),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        padding: wp(14),
    },
    connectionAvatar: {
        width: wp(60),
        height: wp(60),
        borderRadius: wp(30),
    },
    viewBtn: {
        paddingHorizontal: wp(16),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: '#74748014',
    },
});