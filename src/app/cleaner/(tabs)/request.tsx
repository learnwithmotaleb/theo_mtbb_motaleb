import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption2, Caption3, Caption4, Caption5, H3 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { Colors } from '@/constants/theme';
import { useRefresh } from '@/hooks/useRefresh';
import { getApiErrorMessage } from '@/lib/apiError';
import { toCleanerRequest } from '@/lib/mappers';
import {
    useGetMyRequestsQuery,
    useRespondToAssignmentMutation,
} from '@/redux/services/assignmentApi';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

/** A pending assignment, as the cleaning-request card renders it. */
type CleaningRequest = ReturnType<typeof toCleanerRequest>;

/** One host, aggregated from the pending requests they sent. */
type ConnectionRequest = {
    id: string;
    name: string;
    image: any;
    propertiesCount: number;
};
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Cleaning Request Card ─────────────────────────────────────────────────────
function CleaningRequestCard({
    item,
    onAccept,
    onRefuse,
    onPress,
}: {
    item: CleaningRequest;
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
                    <Caption5 color={Colors.TEXT_COLOR}>{item.description}</Caption5>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.actionRow}>
                {/* <Pressable style={styles.refuseBtn} onPress={onRefuse}>
                    <Caption3 color={Colors.COLOR_DANGER}>{t("Refuse")}</Caption3>
                </Pressable>
                <Pressable style={styles.acceptBtn} onPress={onAccept}>
                    <Caption3 color="#fff">{t("Accept")}</Caption3>
                </Pressable> */}
                <CustomButton
                    title={t("Refuse")}
                    color='#FF383C'
                    onPress={onRefuse}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title={t("Accept")}
                    color='#FFFFFF'
                    onPress={onAccept}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
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

    // Only requests still awaiting an answer from this cleaner belong here.
    const { data, isLoading, refetch } = useGetMyRequestsQuery({
        status: 'pending',
        page: 1,
        limit: 50,
    });
    const { refreshing, onRefresh } = useRefresh([refetch]);
    const [respond, { isLoading: isResponding }] = useRespondToAssignmentMutation();

    const requests = useMemo(
        () => (data?.data ?? []).map(toCleanerRequest),
        [data],
    );

    // The same host may have requested several properties; the connection list
    // shows each host once, with how many they are asking about.
    const connections = useMemo<ConnectionRequest[]>(() => {
        const byHost = new Map<string, ConnectionRequest>();
        requests.forEach((request) => {
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
                // Falls back to the number of requests when the backend did not
                // annotate the host with a total property count.
                propertiesCount: request.hostProperties || 1,
            });
        });
        return Array.from(byHost.values());
    }, [requests]);

    const handleRespond = async (
        assignmentId: string,
        action: 'accept' | 'refuse',
    ) => {
        if (isResponding) return;
        try {
            await respond({ assignmentId, action }).unwrap();
            showToast(
                action === 'accept' ? 'Request accepted' : 'Request refused',
                'success',
            );
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send your answer.")), 'error');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Header */}
            <View style={{ marginTop: hp(20),paddingHorizontal:wp(20) }}>
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


                {/* Cleaning Requests */}
                <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("Cleaning Requests")}
                </Body4>
                {isLoading ? (
                    <SkeletonList count={2} />
                ) : requests.length === 0 ? (
                    <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(16) }}>
                        {t("No cleaning requests right now.")}
                    </Caption3>
                ) : (
                    requests.map((item) => (
                        <CleaningRequestCard
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
                            onAccept={() => handleRespond(item.id, 'accept')}
                            onRefuse={() => handleRespond(item.id, 'refuse')}
                        />
                    ))
                )}

                {/* Connection Requests */}
                <Body4 color={Colors.TEXT_COLOR} style={styles.sectionTitle}>
                    {t("Connection Requests")}
                </Body4>
                <View style={styles.connectionList}>
                    {connections.length === 0 ? (
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {t("No connection requests right now.")}
                        </Caption3>
                    ) : (
                        connections.map((item) => (
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
                        ))
                    )}
                </View>
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
    actionRow: {
        flexDirection: 'row',
        // borderTopWidth: 1,
        // borderTopColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(8),
        paddingVertical: hp(10),
        gap: wp(5)
    },
    refuseBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRightWidth: 1,
        borderRightColor: Colors.BORDER_COLOR,
    },
    acceptBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        backgroundColor: Colors.PRIMARY_TEXT,
    },

    // Connection list
    connectionList: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
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
        backgroundColor: "#74748014",
    },
    // divider: { height: 1, backgroundColor: Colors.BORDER_COLOR, marginHorizontal: wp(14) },
});