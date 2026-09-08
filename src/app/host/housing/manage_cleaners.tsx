import { SkeletonList } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { ThreeDotsIcon } from '@/assets/icons/host_icon/ThreeDots';
import { CleanerOptionsModal } from '@/components/host/housing/CleanerOptionsModal';
import SectionTitle from '@/components/shared/SectionTitle';
import {
    Body2,
    Body4,
    Caption1,
    Caption2,
    Caption3,
    Caption4,
    Caption5,
} from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { accommodationPhoto, avatarSource, personName } from '@/lib/mappers';
import { useGetAccommodationByIdQuery } from '@/redux/services/accommodationApi';
import {
    useChangeAssignmentRoleMutation,
    useGetAccommodationCleanersQuery,
    useRemoveAssignmentMutation,
} from '@/redux/services/assignmentApi';
import { useStartConversationMutation } from '@/redux/services/chatApi';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type CleanerItem = {
    /** The assignment id — what the role / remove endpoints act on. */
    id: string;
    /** The cleaner's own user id — used for the profile and for chat. */
    cleanerId: string;
    name: string;
    image: any;
    cleaningsCompleted: number;
    isPrimary?: boolean;
};

// ── CleanerRow ────────────────────────────────────────────────────────────────
function CleanerRow({
    item,
    onMessage,
    onOptions,
}: {
    item: CleanerItem;
    onMessage: () => void;
    onOptions: () => void;
}) {
    const t = useT();
    const router = useRouter();

    return (
        <View style={mcStyles.cleanerRow}>
            {/* Avatar → housekeeper detail */}
            <Pressable
                onPress={() =>
                    router.push({
                        pathname: '/host/housing/housekeeper_detail',
                        params: { cleanerId: item.cleanerId },
                    } as any)
                }
            >
                <AppImage
                    source={item.image}
                    style={mcStyles.avatar}
                    contentFit="cover"
                />
            </Pressable>

            {/* Name + cleanings */}
            <View style={{ flex: 1 }}>
                <Body4 color={Colors.PRIMARY_TEXT}>{item.name}</Body4>
                <Caption4 color={Colors.TEXT_COLOR}>
                    {item.cleaningsCompleted} Cleaning completed
                </Caption4>
            </View>

            
            <Pressable style={mcStyles.messageBtn} onPress={onMessage}>
                <Caption5 color={Colors.TEXT_COLOR}>{t("Message")}</Caption5>
            </Pressable>

            {/* Options */}
            <Pressable style={mcStyles.dotsBtn} onPress={onOptions}>
                <Caption3 color={Colors.TEXT_COLOR}>
                    <ThreeDotsIcon />
                </Caption3>
            </Pressable>
        </View>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ManageCleanersScreen() {
    const t = useT();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: accommodation } = useGetAccommodationByIdQuery(id, { skip: !id });
    const { data: assignments, isLoading } = useGetAccommodationCleanersQuery(id, {
        skip: !id,
    });

    const [changeRole] = useChangeAssignmentRoleMutation();
    const [removeAssignment] = useRemoveAssignmentMutation();
    const [startConversation] = useStartConversationMutation();

    const [selectedCleaner, setSelectedCleaner] = useState<CleanerItem | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const toItem = (assignment: any): CleanerItem => {
        const cleaner = assignment.cleaner ?? {};
        return {
            id: assignment._id,
            cleanerId: cleaner._id ?? '',
            name: personName(cleaner, 'Cleaner'),
            image: avatarSource(cleaner.profileImage),
            cleaningsCompleted: cleaner.cleaningsCompleted ?? 0,
            isPrimary: assignment.role === 'primary',
        };
    };

    const primaryCleaner = useMemo(() => {
        const row = (assignments ?? []).find((a) => a.role === 'primary');
        return row ? toItem(row) : null;
    }, [assignments]);

    const substitutes = useMemo(
        () => (assignments ?? []).filter((a) => a.role !== 'primary').map(toItem),
        [assignments],
    );

    const data = useMemo(
        () => ({
            accommodation: {
                name: accommodation?.name ?? '',
                address: [accommodation?.address, accommodation?.zipCode, accommodation?.city]
                    .filter(Boolean)
                    .join(', '),
                image: accommodationPhoto(accommodation),
            },
        }),
        [accommodation],
    );

    const handleOptions = (cleaner: CleanerItem) => {
        setSelectedCleaner(cleaner);
        setModalVisible(true);
    };

    // Opening (or reusing) the thread with this cleaner gives us the id the
    // chat screen needs.
    const handleMessage = async (cleanerId: string) => {
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

    const handleRoleChange = async (role: 'primary' | 'substitute') => {
        if (!selectedCleaner) return;
        setModalVisible(false);
        try {
            await changeRole({ assignmentId: selectedCleaner.id, role }).unwrap();
            showToast(
                role === 'primary' ? 'Set as primary cleaner' : 'Moved to substitutes',
                'success',
            );
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not update the role.")), 'error');
        }
    };

    const handleRemove = async () => {
        if (!selectedCleaner) return;
        setModalVisible(false);
        try {
            await removeAssignment(selectedCleaner.id).unwrap();
            showToast(t("Cleaner removed"), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not remove the cleaner.")), 'error');
        }
    };

    return (
        <SafeAreaView style={mcStyles.safe}>
            <SectionTitle title={t("Cleaners")} />

            <ScrollView
                contentContainerStyle={mcStyles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Accommodation card */}
                <View style={mcStyles.accomCard}>
                    <AppImage
                        source={data.accommodation.image}
                        style={mcStyles.accomThumb}
                        contentFit="cover"
                    />
                    <View style={{ flex: 1 }}>
                        <Caption2
                            color={"#8E8E93"}
                            style={{ letterSpacing: 0.6 }}
                        >
                            {t("ACCOMMODATION")}
                        </Caption2>
                        <Caption1
                            color={Colors.PRIMARY_TEXT}
                            numberOfLines={2}
                        >
                            {data.accommodation.name}
                        </Caption1>
                        <View style={mcStyles.addressRow}>
                            <View style={{ marginTop: hp(5) }}>
                                <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                            </View>
                            <Caption5
                                color={Colors.TEXT_COLOR}
                                numberOfLines={2}
                            >
                                {data.accommodation.address}
                            </Caption5>
                        </View>
                    </View>
                </View>

                {/* Primary cleaner */}
                <Body2 color={Colors.PRIMARY_TEXT} style={mcStyles.sectionTitle}>
                    {t("Primary cleaner")}
                </Body2>
                <View style={mcStyles.card}>
                    {isLoading ? (
                        <SkeletonList count={3} variant="row" />
                    ) : primaryCleaner ? (
                        <CleanerRow
                            item={primaryCleaner}
                            onMessage={() => handleMessage(primaryCleaner.cleanerId)}
                            onOptions={() => handleOptions(primaryCleaner)}
                        />
                    ) : (
                        <Caption4 color={Colors.TEXT_COLOR}>
                            {t("No primary cleaner assigned yet.")}
                        </Caption4>
                    )}
                </View>

                {/* Substitutes */}
                <Body2 color={Colors.PRIMARY_TEXT} style={mcStyles.sectionTitle}>
                    {t("Substitutes")}
                </Body2>
                <View style={mcStyles.card}>
                    {substitutes.length === 0 ? (
                        <Caption4 color={Colors.TEXT_COLOR}>{t("No substitutes yet.")}</Caption4>
                    ) : (
                        substitutes.map((cleaner) => (
                            <React.Fragment key={cleaner.id}>
                                <CleanerRow
                                    item={cleaner}
                                    onMessage={() => handleMessage(cleaner.cleanerId)}
                                    onOptions={() => handleOptions(cleaner)}
                                />
                            </React.Fragment>
                        ))
                    )}
                </View>
            </ScrollView>

            <CleanerOptionsModal
                visible={modalVisible}
                isPrimary={selectedCleaner?.isPrimary ?? false}
                onClose={() => setModalVisible(false)}
                onRemove={handleRemove}
                onMakePrimary={() => handleRoleChange('primary')}
                onMakeSubstitute={() => handleRoleChange('substitute')}
            />
        </SafeAreaView>
    );
}

const mcStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(40) },
    accomCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        paddingVertical: hp(16),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8),
        marginBottom: hp(20),
    },
    accomThumb: {
        width: wp(120),
        height: hp(120),
        borderRadius: wp(10),
        marginLeft: 8,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(4),
        marginTop: hp(4),
    },
    sectionTitle: { marginBottom: hp(12) },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        paddingHorizontal: wp(16),
        marginBottom: hp(20),
    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingVertical: hp(14),
    },
    avatar: { width: wp(48), height: wp(48), borderRadius: wp(24) },
    messageBtn: {
        paddingHorizontal: wp(8),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: Colors.APP_BACKGROUND,
    },
    dotsBtn: {
        paddingHorizontal: wp(6),
        paddingVertical: hp(4),
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});