import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { AcceptedInvitationScreen } from '@/components/host/task_status/AcceptedInvitationScreen';
import { AlertScreen } from '@/components/host/task_status/AlertScreen';
import { ChecklistScreen } from '@/components/host/task_status/ChecklistScreen';
import { CleanerDenyScreen } from '@/components/host/task_status/CleanerDenyScreen';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { TaskStatus } from '@/types/hostTypes';
import { getApiErrorMessage } from '@/lib/apiError';
import { resolveAssetUrl } from '@/lib/config';
import { formatClock } from '@/lib/datetime';
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
import { wp } from '../../../../utils/responsiveDevice';

const TITLE_MAP: Record<TaskStatus, string> = {
    refused: 'Cleaner Deny',
    completed: 'Checklist Header',
    report_problem: 'Alert',
    pending_accept: 'Accepted invitation',
    scheduled: 'Scheduled',
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

    const timeSlot = `${formatClock(schedule?.checkInTime)} – ${formatClock(schedule?.checkOutTime)}`;

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
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {t("This mission is on track — nothing to do right now.")}
                    </Caption3>
                );
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={TITLE_MAP[status]} />
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
});
