import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { AppertmentIcon } from '@/assets/icons/cleaner_icon/AppartmentIcon';
import { BathRoomIcon } from '@/assets/icons/cleaner_icon/BathRoomIcon';
import { BedRoomIcon } from '@/assets/icons/cleaner_icon/BedRoomIcon';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { FloorIcon } from '@/assets/icons/cleaner_icon/FloorIcon';
import { KeyIconIcon } from '@/assets/icons/cleaner_icon/KeyIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { SurfaceIcon } from '@/assets/icons/cleaner_icon/SurfaceIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Body1, Body6, Caption2, Caption3, Caption4 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { accommodationLocation, accommodationPhoto, avatarSource, personName } from '@/lib/mappers';

import { useGetAccommodationForCleanerQuery } from '@/redux/services/accommodationApi';
import { useRespondToAssignmentMutation } from '@/redux/services/assignmentApi';
import { useStartConversationMutation } from '@/redux/services/chatApi';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function PropertyRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <View style={styles.propRow}>
            <View style={styles.iconGroup}>{icon}</View>
            <Caption2 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption2>
            <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
        </View>
    );
}

export default function TeamDetailScreen() {
    const t = useT();
    const { formatMoney } = useFormat();
    const router = useRouter();
    // The request card passes the assignment it came from plus the
    // accommodation it points at, so we can both read details and answer.
    const { requestId, accommodationId } = useLocalSearchParams<{
        requestId: string;
        accommodationId: string;
    }>();

    const { data, isLoading } = useGetAccommodationForCleanerQuery(accommodationId, {
        skip: !accommodationId,
    });

    const [respond, { isLoading: isResponding }] = useRespondToAssignmentMutation();
    const [startConversation] = useStartConversationMutation();

    const host = (data?.host ?? {}) as any;
    const myAssignment = (data?.myAssignment ?? {}) as any;
    // Falls back to the id the card handed us when the payload predates it.
    const assignmentId = myAssignment?.assignmentId ?? requestId;
    const status: string = myAssignment?.status ?? 'pending';

    const request = useMemo(
        () => ({
            apartmentName: data?.name ?? 'Accommodation',
            location: accommodationLocation(data),
            image: accommodationPhoto(data),
            frequency: data?.frequency || t("On demand"),
            type: data?.accommodationType ?? '-',
            surface: data?.surface != null ? String(data.surface) + ' m2' : '-',
            floor: data?.floor || '-',
            rooms: data?.numberOfRooms != null ? String(data.numberOfRooms) : '-',
            elevator: data?.hasElevator ? 'Yes' : 'No',
            access: data?.keys || t("See instructions"),
            cleaningRate: formatMoney(
                myAssignment?.pricePerCleaning ?? data?.cleaningRate ?? 0,
            ),
            keyBox: data?.keys || '-',
            keyBoxCode: data?.accessCode || data?.doorCode || '-',
            specificInstruction: data?.instructions || t("No specific instruction."),
            client: {
                image: avatarSource(host?.profileImage),
                name: personName(host, 'Host'),
                phone: host?.phone || '',
            },
        }),
        [data, host, myAssignment, t],
    );

    const openConversation = async () => {
        if (!host?._id) return;
        try {
            const conversation = await startConversation({ receiverId: host._id }).unwrap();
            router.push({
                pathname: '/cleaner/message/chat' as any,
                params: { conversationId: conversation._id },
            });
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not open the conversation.")), 'error');
        }
    };

    const handleRespond = async (action: 'accept' | 'refuse') => {
        if (!assignmentId || isResponding) return;
        try {
            await respond({ assignmentId, action }).unwrap();
            showToast(
                action === 'accept' ? 'Request accepted' : 'Request refused',
                'success',
            );
            router.back();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send your answer.")), 'error');
        }
    };

    if (isLoading && !data) {
        return (
            <SafeAreaView style={[styles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Team - {name}", { name: request.apartmentName })} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Apartment card */}
                <View style={styles.apartmentCard}>
                    <AppImage source={request.image} style={styles.thumb} contentFit="cover" />
                    <View style={styles.apartmentInfo}>
                        <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={1}>
                            {request.apartmentName}
                        </Caption2>
                        {/* Where this request stands right now */}
                        <View style={styles.activeBadge}>
                            <Caption4 color={Colors.COLOR_ACTIVE}>
                                {status === 'accepted'
                                    ? 'Active'
                                    : status === 'refused'
                                      ? 'Refused'
                                      : 'Pending'}
                            </Caption4>
                        </View>
                        <View style={styles.row}>
                            <LocationIcon size={15} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{request.location}</Caption3>
                        </View>
                        <View style={styles.row}>
                            <CalendarIcon size={15} color={Colors.TEXT_COLOR} />
                            <Caption3 color={Colors.TEXT_COLOR}>{request.frequency}</Caption3>
                        </View>
                        {/* <Pressable style={styles.arrowBtn} onPress={() => {}}>
                            <RightAngleIcon size={16} color={Colors.TEXT_COLOR} />
                        </Pressable> */}
                    </View>
                </View>

                {/* Property information */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        {t("PROPERTY INFORMATION")}
                    </Caption2>
                    <PropertyRow icon={<AppertmentIcon />} label={t("Type")} value={request.type} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<SurfaceIcon />} label={t("Surface")} value={request.surface} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<FloorIcon />} label={t("Floor")} value={request.floor} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<BedRoomIcon />} label={t("Rooms")} value={request.rooms} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<BathRoomIcon />} label={t("Elevator")} value={request.elevator} />
                    {/* <View style={styles.divider} /> */}
                    <PropertyRow icon={<KeyIconIcon />} label={t("Access")} value={request.access} />
                </View>

                {/* Cleaning rate */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        {t("CLEANING RATE")}
                    </Caption2>
                    <View style={styles.rateRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>{t("Cleaning Service")}</Caption3>
                        <Caption3 color={Colors.PRIMARY_TEXT}>{request.cleaningRate}</Caption3>
                    </View>
                </View>

                {/* Practical information */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        {t("PRACTICAL INFORMATION")}
                    </Caption2>
                    <View style={styles.keyRow}>
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>{t("Key Box")}</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{request.keyBox}</Body6>
                        </View>
                        <View style={styles.keyDivider} />
                        <View style={styles.keyBox}>
                            <Caption4 color={Colors.TEXT_COLOR}>{t("Key Box Code")}</Caption4>
                            <Body6 color={Colors.PRIMARY_TEXT}>{request.keyBoxCode}</Body6>
                        </View>
                    </View>
                    <View style={styles.instructionBox}>
                        <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                            {t("Specific Instruction")}
                        </Caption4>
                        <Caption3 color={Colors.TEXT_COLOR}>{request.specificInstruction}</Caption3>
                    </View>
                </View>

                {/* Contact with client */}
                <View style={styles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                        {t("CONTACT WITH CLIENT")}
                    </Caption2>
                    <View style={styles.clientRow}>
                        <AppImage
                            source={request.client.image}
                            style={styles.clientAvatar}
                            contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                            <Body1 color="#4B4B4B">{request.client.name}</Body1>
                            <Caption3 color={Colors.TEXT_COLOR}>{request.client.phone}</Caption3>
                        </View>
                        <Pressable style={styles.messageBtn} onPress={openConversation}>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Message")}</Caption3>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>

            {/* Footer - only a pending request can still be answered */}
            <View style={[styles.footer, status !== 'pending' && { display: 'none' }]}>
                {/* <Pressable style={styles.refuseBtn} onPress={() => router.back()}>
                    <Caption3 color={Colors.COLOR_DANGER}>{t("Refuse")}</Caption3>
                </Pressable>
                <Pressable
                    style={styles.acceptBtn}
                    onPress={() => {
                        router.back();
                    }}
                >
                    <Caption3 color="#fff">{t("Accept")}</Caption3>
                </Pressable> */}

                <CustomButton
                    title={t("Refuse")}
                    color='#FF383C'
                    onPress={() => handleRespond('refuse')}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={Colors.APP_BACKGROUND}
                    width="49%"
                />
                <CustomButton
                    title={t("Accept")}
                    color='#FFFFFF'
                    onPress={() => handleRespond('accept')}
                    borderRadius={wp(5)}
                    borderColor='#FF383C1A'
                    backgroundColor={"#000000"}
                    width="49%"
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1, backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(20) },

    // Apartment card
    apartmentCard: {
        flexDirection: 'row',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(12),
        marginBottom: hp(16),
        marginTop: hp(8),
    },
    thumb: { width: wp(100), height: hp(110), borderRadius: wp(8) },
    apartmentInfo: { flex: 1, gap: hp(4) },
    activeBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E8F8F0',
        borderRadius: wp(20),
        paddingHorizontal: wp(10),
        paddingVertical: hp(3),
        // borderWidth: 1,
        // borderColor: Colors.COLOR_ACTIVE,
    },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },
    arrowBtn: { alignSelf: 'flex-end', marginTop: 'auto' },

    // Sections
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
        marginBottom: hp(12),
    },
    sectionLabel: { letterSpacing: 0.6, marginBottom: hp(10) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR, marginVertical: hp(2) },

    // Property rows
    propRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(10),
        gap: wp(10),
    },
    iconGroup: {
        width: wp(32),
        height: wp(32),
        borderRadius: wp(16),
        backgroundColor: '#8F8F8F1A',
        alignItems: 'center',
        justifyContent: 'center',
    },
    rateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(8),
    },

    // Key boxes
    keyRow: {
        flexDirection: 'row',
        backgroundColor: '#F9F9F9',
        borderRadius: wp(10),
        marginBottom: hp(10),
    },
    keyDivider: { width: 1, backgroundColor: Colors.BORDER_COLOR },
    keyBox: { flex: 1, padding: wp(12), gap: hp(4) },
    instructionBox: {
        backgroundColor: '#F9F9F9',
        borderRadius: wp(10),
        padding: wp(12),
    },

    // Client
    clientRow: { flexDirection: 'row', alignItems: 'center', gap: wp(10) },
    clientAvatar: { width: wp(48), height: wp(48), borderRadius: wp(24) },
    messageBtn: {
        paddingHorizontal: wp(14),
        paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: '#74748014',
    },

    // Footer
    footer: {
        flexDirection: 'row',
        // paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        gap: wp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
    refuseBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.COLOR_DANGER,
    },
    acceptBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(14),
        borderRadius: wp(12),
        backgroundColor: Colors.PRIMARY_TEXT,
    },
});