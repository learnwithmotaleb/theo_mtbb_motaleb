import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { AcceptedInvitationScreen } from '@/components/host/task_status/AcceptedInvitationScreen';
import { AlertScreen } from '@/components/host/task_status/AlertScreen';
import { ChecklistScreen } from '@/components/host/task_status/ChecklistScreen';
import { CleanerDenyScreen } from '@/components/host/task_status/CleanerDenyScreen';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { AppImage } from '@/components/shared/AppImage';
import { showToast } from '@/components/shared/Toast';
import { Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { TaskStatus } from '@/types/hostTypes';
import { getApiErrorMessage } from '@/lib/apiError';
import { resolveAssetUrl } from '@/lib/config';
import { formatCleaningWindow } from '@/lib/datetime';
import {
    accommodationLocation,
    accommodationPhoto,
    avatarSource,
    personName,
} from '@/lib/mappers';
import {
    useAssignCleanerMutation,
    useFindHousekeepersQuery,
} from '@/redux/services/assignmentApi';
import { useStartConversationMutation } from '@/redux/services/chatApi';
import {
    useCompleteScheduleMutation,
    useGetScheduleByIdQuery,
    useInvalidateProofMutation,
} from '@/redux/services/scheduleApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const TITLE_MAP: Record<TaskStatus, string> = {
    refused: 'Demande refusée',
    completed: 'Preuve de ménage à valider',
    report_problem: 'Problème signalé',
    pending_accept: 'Demande acceptée',
    scheduled: 'Ménage planifié',
};

export default function TaskStatusScreen() {
    const t = useT();
    const { formatDate, formatDateTime } = useFormat();
    const router = useRouter();
    // The home feed passes the record's id plus which kind of record it is,
    // so we know whether to read a schedule or an assignment.
    const { taskId, kind, status: statusParam } = useLocalSearchParams<{
        taskId: string;
        kind?: 'schedule' | 'assignment';
        status?: TaskStatus;
    }>();

    const isSchedule = (kind ?? 'schedule') === 'schedule';

    const { data: schedule, isLoading } = useGetScheduleByIdQuery(taskId, {
        skip: !taskId || !isSchedule,
    });

    const [completeSchedule, { isLoading: isCompleting }] = useCompleteScheduleMutation();
    const [invalidateProof, { isLoading: isInvalidating }] = useInvalidateProofMutation();
    const [startConversation] = useStartConversationMutation();
    const [assignCleaner] = useAssignCleanerMutation();

    const accommodation = (schedule?.accommodation ?? {}) as any;
    const cleaner = (schedule?.cleaner ?? {}) as any;

    // Which variant to render: trust the live schedule status when we have it,
    // and fall back to what the feed told us (assignments have no schedule).
    const status: TaskStatus = useMemo(() => {
        if (!isSchedule) return statusParam ?? 'pending_accept';
        switch (schedule?.status) {
            case 'refused':
                return 'refused';
            case 'completed':
            case 'proof_submitted':
                return 'completed';
            case 'disputed':
                return 'report_problem';
            case undefined:
                return statusParam ?? 'scheduled';
            default:
                return 'scheduled';
        }
    }, [isSchedule, schedule, statusParam]);

    // The "refused" screen offers other nearby housekeepers to invite instead.
    const { data: nearby } = useFindHousekeepersQuery(
        { interventionZone: accommodation?.city || undefined, page: 1, limit: 3 },
        { skip: status !== 'refused' },
    );

    const contactCleaner = async () => {
        const cleanerId = cleaner?._id;
        if (!cleanerId) return;
        try {
            const conversation = await startConversation({ receiverId: cleanerId }).unwrap();
            router.push({
                pathname: '/host/message/chat' as any,
                params: { conversationId: conversation._id },
            });
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not open the conversation.")), 'error');
        }
    };

    // Validating releases the escrowed payment, so it is the one action here
    // that moves money.
    const handleValidate = async () => {
        if (!taskId) return false;
        try {
            await completeSchedule(taskId).unwrap();
            return true;
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not validate the cleaning.")), 'error');
            return false;
        }
    };

    const handleReject = async () => {
        if (!taskId) return;
        try {
            await invalidateProof({ id: taskId }).unwrap();
            showToast(t("Sent back to the cleaner"), 'success');
            router.back();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not reject the proof.")), 'error');
        }
    };

    const handleInvite = async (cleanerId: string) => {
        if (!accommodation?._id) return;
        try {
            await assignCleaner({
                accommodationId: accommodation._id,
                cleanerId,
                role: 'substitute',
            }).unwrap();
            showToast(t("Request sent"), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send the request.")), 'error');
        }
    };

    const timeSlot = formatCleaningWindow(schedule?.checkInTime, schedule?.checkOutTime);

    const renderContent = () => {
        switch (status) {
            case 'refused':
                return (
                    <CleanerDenyScreen
                        data={{
                            cleanerName: personName(cleaner, 'The cleaner'),
                            cleanerImage: avatarSource(cleaner?.profileImage),
                            cleanerLocation: cleaner?.interventionZone ?? '',
                            apartmentName: accommodation?.name ?? '',
                            apartmentImage: accommodationPhoto(accommodation),
                            location: accommodationLocation(accommodation),
                            idealSlot: timeSlot,
                            timeSlot,
                            noHousekeeperAvailable: (nearby?.data ?? []).length === 0,
                            nearestHousekeepers: (nearby?.data ?? []).map((hk) => ({
                                id: hk._id,
                                name: personName(hk, 'Housekeeper'),
                                location: hk.interventionZone || hk.workCity || '',
                                image: avatarSource(hk.profileImage),
                            })),
                        }}
                        onInvite={handleInvite}
                    />
                );

            case 'completed':
                return (
                    <ChecklistScreen
                        data={{
                            apartmentName: accommodation?.name ?? '',
                            apartmentImage: accommodationPhoto(accommodation),
                            date: formatDate(schedule?.date, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            }),
                            time: timeSlot,
                            cleanerName: personName(cleaner, 'The cleaner'),
                            cleanerImage: avatarSource(cleaner?.profileImage),
                            photos: (schedule?.proofPhotos ?? []).map((path) => ({
                                uri: resolveAssetUrl(path),
                            })),
                            notes: schedule?.proofNotes ?? t("No notes were left."),
                        }}
                        onValidate={handleValidate}
                        onReject={handleReject}
                        onContactCleaner={contactCleaner}
                        isBusy={isCompleting || isInvalidating}
                    />
                );

            case 'report_problem':
                return (
                    <AlertScreen
                        data={{
                            cleanerName: personName(cleaner, 'The cleaner'),
                            cleanerImage: avatarSource(cleaner?.profileImage),
                            cleanerLocation: cleaner?.interventionZone ?? '',
                            reportedAt: formatDateTime(schedule?.dispute?.raisedAt),
                            message: schedule?.dispute?.notes ?? schedule?.dispute?.reason ?? '',
                            photos: (schedule?.dispute?.photos ?? []).map((path) => ({
                                uri: resolveAssetUrl(path),
                            })),
                            ligament: accommodation?.name ?? '',
                            apartmentName: accommodation?.name ?? '',
                            dateAndHouse: `${formatDate(schedule?.date, {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                            })} • ${timeSlot}`,
                        }}
                        onContactCleaner={contactCleaner}
                    />
                );

            case 'pending_accept':
                return (
                    <AcceptedInvitationScreen
                        data={{
                            cleanerName: personName(cleaner, 'The cleaner'),
                            cleanerImage: avatarSource(cleaner?.profileImage),
                            apartmentName: accommodation?.name ?? '',
                            apartmentImage: accommodationPhoto(accommodation),
                            apartmentLocation: accommodation?.city ?? '',
                            apartmentCountry: accommodation?.country ?? '',
                        }}
                    />
                );

            default:
                return (
                    <View style={styles.scheduledCard}>
                        <View style={styles.accomHeader}>
                            <AppImage
                                source={accommodationPhoto(accommodation)}
                                style={styles.thumb}
                                contentFit="cover"
                            />
                            <View style={{ flex: 1, gap: 4 }}>
                                <Caption3 color={Colors.TEXT_COLOR}>{t("ACCOMMODATION")}</Caption3>
                                <Caption3 color={Colors.PRIMARY_TEXT} style={{ fontWeight: '600' }}>
                                    {accommodation?.name ?? ''}
                                </Caption3>
                                <Caption3 color={Colors.TEXT_COLOR}>
                                    {accommodationLocation(accommodation)}
                                </Caption3>
                            </View>
                        </View>

                        <View style={styles.detailDivider} />

                        <View style={styles.detailRow}>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Housekeeper")}</Caption3>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <AppImage
                                    source={avatarSource(cleaner?.profileImage)}
                                    style={styles.cleanerAvatar}
                                    contentFit="cover"
                                />
                                <Caption3 color={Colors.PRIMARY_TEXT}>
                                    {personName(cleaner, t('Not assigned'))}
                                </Caption3>
                            </View>
                        </View>

                        {schedule?.date ? (
                            <View style={styles.detailRow}>
                                <Caption3 color={Colors.TEXT_COLOR}>{t("Date")}</Caption3>
                                <Caption3 color={Colors.PRIMARY_TEXT}>
                                    {formatDate(schedule.date, { weekday: 'long', day: 'numeric', month: 'long' })}
                                </Caption3>
                            </View>
                        ) : null}

                        {timeSlot ? (
                            <View style={styles.detailRow}>
                                <Caption3 color={Colors.TEXT_COLOR}>{t("Time slot")}</Caption3>
                                <Caption3 color={Colors.PRIMARY_TEXT}>{timeSlot}</Caption3>
                            </View>
                        ) : null}

                        <View style={styles.statusNoteBox}>
                            <Caption3 color={Colors.COLOR_ACTIVE}>
                                {t("Ménage planifié – En attente de validation par l'agent d'entretien.")}
                            </Caption3>
                        </View>

                        {cleaner?._id ? (
                            <CustomButton
                                title={t("Contacter l'agent d'entretien")}
                                onPress={contactCleaner}
                                backgroundColor={Colors.BRAND_PRIMARY}
                                color="#fff"
                                width="100%"
                                height={hp(48)}
                                borderRadius={wp(8)}
                                style={{ marginTop: hp(16) }}
                            />
                        ) : null}

                        <CustomButton
                            title={t("Retour à l'accueil")}
                            onPress={() => router.back()}
                            backgroundColor={Colors.INPUT_BACKGROUND}
                            color={Colors.PRIMARY_TEXT}
                            width="100%"
                            height={hp(48)}
                            borderRadius={wp(8)}
                            style={{ marginTop: hp(10) }}
                        />
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t(TITLE_MAP[status])} />
            <View style={styles.content}>
                {isLoading && !schedule ? (
                    <SkeletonDetail />
                ) : (
                    renderContent()
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    content: { flex: 1 },
    scheduledCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(16),
        gap: wp(12),
        marginTop: wp(10),
    },
    accomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
    },
    thumb: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(10),
    },
    detailDivider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginVertical: wp(4),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: wp(4),
    },
    cleanerAvatar: {
        width: wp(24),
        height: wp(24),
        borderRadius: wp(12),
    },
    statusNoteBox: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(8),
        padding: wp(10),
        marginTop: wp(6),
        alignItems: 'center',
    },
});
