import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption1, Caption2, Caption3, Caption4, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { accommodationPhoto, avatarSource, personName } from '@/lib/mappers';

import {
    useDeleteAccommodationMutation,
    useGetAccommodationByIdQuery,
} from '@/redux/services/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/redux/services/assignmentApi';
import { elevatorText, hasFloorAndElevator, keysText, roomsText } from '@/constants/accommodation';
import { AppImage } from '@/components/shared/AppImage';
import { showToast } from '@/components/shared/Toast';
import { getApiErrorMessage } from '@/lib/apiError';
import { ThreeDotsIcon } from '@/assets/icons/host_icon/ThreeDots';
import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import { TrashIcon } from '@/assets/icons/common_icon/TrashIcon';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>{label}</Caption3>
            <Caption3 color={Colors.PRIMARY_TEXT}>{value}</Caption3>
        </View>
    );
}

export default function AccommodationDetailsViewScreen() {
    const t = useT();
    const { formatMoney } = useFormat();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(id, {
        skip: !id,
    });
    // Assignments carry who is primary and whether they accepted, which the
    // accommodation payload alone does not always spell out.
    const { data: assignments } = useGetAccommodationCleanersQuery(id, { skip: !id });
    const [deleteAccommodation, { isLoading: isDeleting }] = useDeleteAccommodationMutation();
    const [menuVisible, setMenuVisible] = useState(false);

    const goToEdit = () => {
        setMenuVisible(false);
        router.push({
            pathname: '/host/housing/edit_accommodation',
            params: { id },
        } as any);
    };

    // Same confirmation as « Se déconnecter »: a native alert with a
    // destructive action, so a property is never deleted by accident.
    const confirmDelete = () => {
        setMenuVisible(false);
        Alert.alert(t('Delete property'), t('Are you sure you want to delete this property?'), [
            { text: t('Cancel'), style: 'cancel' },
            {
                text: t('Delete'),
                style: 'destructive',
                onPress: async () => {
                    if (isDeleting) return;
                    try {
                        await deleteAccommodation(id).unwrap();
                        showToast(t('Property deleted'), 'success');
                        router.dismissTo('/host/(tabs)/housing' as any);
                    } catch (err) {
                        showToast(
                            getApiErrorMessage(err, t('Could not delete the property.')),
                            'error',
                        );
                    }
                },
            },
        ]);
    };

    // Adding a cleaner: the first one becomes primary, later ones substitutes.
    const goToAddCleaner = (role: 'primary' | 'substitute') =>
        router.push({
            pathname: '/host/home/add_houskeeper',
            params: { accommodationId: id, role },
        } as any);

    // The primary cleaner heads the card; a substitute stands in when there is
    // no primary yet.
    const primary = useMemo(() => {
        const rows = assignments ?? [];
        return (
            rows.find((a) => a.role === 'primary' && a.status === 'accepted') ??
            rows.find((a) => a.status === 'accepted') ??
            null
        );
    }, [assignments]);

    // An invitation the cleaner has not answered yet. Shown as such, so the
    // host does not mistake it for an active cleaner who can take requests.
    const pendingInvite = useMemo(
        () => (assignments ?? []).find((a) => a.status === 'pending' && a.cleaner) ?? null,
        [assignments],
    );

    const data = useMemo(() => {
        const cleanerUser = primary?.cleaner as any;
        return {
            id: accommodation?._id ?? '',
            name: accommodation?.name ?? '',
            address: [accommodation?.address, accommodation?.zipCode, accommodation?.city]
                .filter(Boolean)
                .join(', '),
            image: accommodationPhoto(accommodation),
            accommodationType: accommodation?.accommodationType
                ? t(accommodation.accommodationType)
                : '—',
            showFloor: hasFloorAndElevator(accommodation?.accommodationType),
            bedrooms: roomsText(accommodation?.numberOfRooms, t) || '—',
            surface: accommodation?.surface ? `${accommodation.surface} m²` : '—',
            floor: accommodation?.floor ? String(accommodation.floor) : '—',
            elevator: elevatorText(accommodation?.hasElevator, t),
            cleaningRate: formatMoney(accommodation?.cleaningRate ?? 0),
            cleaner: cleanerUser
                ? {
                      id: cleanerUser._id as string,
                      name: personName(cleanerUser, t('Housekeeper')),
                      image: avatarSource(cleanerUser.profileImage),
                      cleaningsCompleted: cleanerUser.cleaningsCompleted ?? 0,
                  }
                : null,
            pendingCleaner: pendingInvite
                ? {
                      name: personName(pendingInvite.cleaner as any, t('Housekeeper')),
                      image: avatarSource((pendingInvite.cleaner as any)?.profileImage),
                  }
                : null,
            practical: {
                keyBox: keysText(accommodation?.keys, t) || '—',
                keyBoxCode: accommodation?.accessCode ?? accommodation?.doorCode ?? '—',
                specificInstruction:
                    accommodation?.instructions ?? accommodation?.notes ?? '—',
            },
        };
    }, [accommodation, primary, pendingInvite, t, formatMoney]);

    const showCleaner = !!data.cleaner;

    if (isLoading && !accommodation) {
        return (
            <SafeAreaView style={[styles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle
                title={t("Accommodation Details")}
                rightSlot={
                    <Pressable
                        onPress={() => setMenuVisible(true)}
                        hitSlop={12}
                        style={styles.dotsBtn}
                        accessibilityRole="button"
                        accessibilityLabel={t('Options')}
                    >
                        <ThreeDotsIcon color={Colors.PRIMARY_TEXT} />
                    </Pressable>
                }
            />

            {/* « ⋮ » menu: edit or delete the property */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable style={styles.menuOverlay} onPress={() => setMenuVisible(false)}>
                    <View style={styles.menu}>
                        <Pressable style={styles.menuItem} onPress={goToEdit}>
                            <EditPenIcon color={Colors.PRIMARY_TEXT} />
                            <Caption1 color={Colors.PRIMARY_TEXT}>{t('Edit property')}</Caption1>
                        </Pressable>
                        <View style={styles.menuDivider} />
                        <Pressable style={styles.menuItem} onPress={confirmDelete}>
                            <TrashIcon />
                            <Caption1 color={Colors.COLOR_DANGER}>{t('Delete property')}</Caption1>
                        </Pressable>
                    </View>
                </Pressable>
            </Modal>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero image */}
                <AppImage
                    source={data.image}
                    style={styles.heroImage}
                    contentFit="cover"
                />

                {/* Name + address */}
                <View style={styles.card}>
                    <Body5 color={Colors.TEXT_COLOR}>{data.name}</Body5>
                    <View style={styles.addressRow}>
                        <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                        <Caption3 color={Colors.TEXT_COLOR}>{data.address}</Caption3>
                    </View>
                </View>

                {/* <View style={styles.divider} /> */}

                {/* Accommodation info */}
                <View style={styles.card}>
                    <InfoRow label={t("Accommodation Type")} value={data.accommodationType} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label={t("Bedrooms")} value={data.bedrooms} />
                    {/* <View style={styles.divider} /> */}
                    <InfoRow label={t("Surface")} value={data.surface} />
                    {/* <View style={styles.divider} /> */}
                    {data.showFloor && (
                        <>
                            <InfoRow label={t("Floor")} value={data.floor} />
                            <InfoRow label={t("Elevator")} value={data.elevator} />
                        </>
                    )}
                </View>
                {/* <View style={styles.divider} /> */}

                {/* ── Cleaner section: accepted cleaner, pending invitation, or none ── */}
                <View style={{marginVertical:hp(10)}}>
                    {showCleaner ? (
                        <>
                            <View style={styles.cleanerSection}>
                                <View style={styles.cleanerRow}>
                                    <AppImage
                                        source={data.cleaner!.image}
                                        style={styles.cleanerAvatar}
                                        contentFit="cover"
                                    />
                                    <View style={{ flex: 1 }}>
                                        <Caption5
                                            color={Colors.TEXT_COLOR}
                                        >
                                            {t("CLEANER")}
                                        </Caption5>
                                        <Caption1 color={Colors.PRIMARY_TEXT}>
                                            {data.cleaner!.name}
                                        </Caption1>
                                        <Caption5 color={Colors.TEXT_COLOR}>
                                            {t("{n} cleanings completed", { n: data.cleaner!.cleaningsCompleted })}
                                        </Caption5>
                                    </View>
                                    <Pressable
                                        style={styles.manageBtn}
                                        onPress={() =>
                                            router.push({
                                                pathname: '/host/housing/manage_cleaners',
                                                params: { id: data.id },
                                            } as any)
                                        }
                                    >
                                        <Caption3 color={Colors.TEXT_WHITE}>{t("Manage")}</Caption3>
                                    </Pressable>
                                </View>
                            </View>
                            {/* <View style={styles.divider} /> */}
                        </>
                    ) : data.pendingCleaner ? (
                        <View style={styles.cleanerSection}>
                            <View style={styles.cleanerRow}>
                                <AppImage
                                    source={data.pendingCleaner.image}
                                    style={styles.cleanerAvatar}
                                    contentFit="cover"
                                />
                                <View style={{ flex: 1 }}>
                                    <Caption5 color={Colors.TEXT_COLOR}>{t("CLEANER")}</Caption5>
                                    <Caption1 color={Colors.PRIMARY_TEXT}>
                                        {data.pendingCleaner.name}
                                    </Caption1>
                                    <View style={styles.pendingBadge}>
                                        <Caption5 color={Colors.COLOR_ORANGE}>
                                            {t("Invitation sent – waiting for acceptance")}
                                        </Caption5>
                                    </View>
                                </View>
                                <Pressable
                                    style={styles.manageBtn}
                                    onPress={() =>
                                        router.push({
                                            pathname: '/host/housing/manage_cleaners',
                                            params: { id: data.id },
                                        } as any)
                                    }
                                >
                                    <Caption3 color={Colors.TEXT_WHITE}>{t("Manage")}</Caption3>
                                </Pressable>
                            </View>
                            <Caption5 color={Colors.TEXT_COLOR} style={{ marginTop: hp(8) }}>
                                {t("The cleaner is not active yet and cannot receive cleaning requests until she accepts.")}
                            </Caption5>
                        </View>
                    ) : (
                        // No cleaner yet: a clearly visible call-to-action,
                        // right where the cleaner will appear.
                        <View style={[styles.cleanerSection, styles.noCleanerCard]}>
                            <Caption3 color={Colors.COLOR_DANGER} style={{ marginBottom: hp(10) }}>
                                {t("No Cleaner Assigned")}
                            </Caption3>
                            <CustomButton
                                title={t("Assign a cleaner")}
                                onPress={() => goToAddCleaner('primary')}
                                width="100%"
                                backgroundColor={Colors.COLOR_DANGER}
                                color={Colors.TEXT_WHITE}
                                borderRadius={wp(8)}
                                height={hp(46)}
                            />
                        </View>
                    )}

                    {/* Once a cleaner is there, more can still be added —
                        from the same place, but as a discreet link. */}
                    {(showCleaner || data.pendingCleaner) && (
                        <Pressable
                            style={styles.addMoreBtn}
                            onPress={() => goToAddCleaner('substitute')}
                            accessibilityRole="button"
                        >
                            <Caption3 color={Colors.PRIMARY_TEXT}>+ {t("Add a cleaner")}</Caption3>
                        </Pressable>
                    )}
                </View>

                {/* Cleaning rate */}
                <View style={styles.card}>
                    <Caption2
                        color={Colors.TEXT_COLOR}
                        style={[styles.sectionLabel, { marginTop: hp(8) }]}
                    >
                        {t("CLEANING RATE")}
                    </Caption2>
                    <InfoRow label={t("Cleaning Service")} value={data.cleaningRate} />

                </View>

                {/* Practical information */}
                <View style={styles.card}>
                    <Caption2
                    color={Colors.TEXT_COLOR}
                    style={[styles.sectionLabel, { marginTop: hp(16) }]}
                >
                    {t("PRACTICAL INFORMATION")}
                </Caption2>

                {/* Key box row */}
                <View style={styles.keyRow}>
                    <View style={styles.keyBox}>
                        <Caption4 color={Colors.TEXT_COLOR}>{t("Keys")}</Caption4>
                        <Body6 color={Colors.PRIMARY_TEXT}>{data.practical.keyBox}</Body6>
                    </View>
                    <View style={styles.keyBox}>
                        <Caption4 color={Colors.TEXT_COLOR}>{t("Access code")}</Caption4>
                        <Body6 color={Colors.PRIMARY_TEXT}>{data.practical.keyBoxCode}</Body6>
                    </View>
                </View>

                {/* Specific instruction */}
                <View style={styles.instructionBox}>
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                        {t("Specific Instruction")}
                    </Caption4>
                    <Caption3 color={Colors.TEXT_COLOR}>
                        {data.practical.specificInstruction}
                    </Caption3>
                </View>
                </View>

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
        paddingBottom: hp(20),
    },
    heroImage: {
        width: '100%',
        height: hp(200),
        borderRadius: wp(14),
        marginVertical: hp(20),
    },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(15),
        paddingVertical: hp(8),
        marginBottom: hp(10)

    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(4),
        marginTop: hp(4),
        marginBottom: hp(16),
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: hp(12),
    },

    sectionLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(12),
    },
    cleanerSection: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(15),
        paddingVertical: hp(8)

    },
    cleanerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
    },
    cleanerAvatar: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
    },
    pendingBadge: {
        alignSelf: 'flex-start',
        marginTop: hp(4),
        paddingHorizontal: wp(8),
        paddingVertical: hp(2),
        borderRadius: wp(6),
        backgroundColor: '#FF8D281A',
    },
    manageBtn: {
        paddingHorizontal: wp(20),
        paddingVertical: hp(10),
        borderRadius: wp(10),
        backgroundColor: Colors.PRIMARY_TEXT,
    },
    keyRow: {
        flexDirection: 'row',
        gap: wp(12),
        marginBottom: hp(12),
    },
    keyBox: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        gap: hp(4),
    },
    instructionBox: {
        backgroundColor:  Colors.APP_BACKGROUND,
        borderRadius: wp(10),
        padding: wp(12),
        marginBottom: hp(16),
    },
    noCleanerCard: {
        paddingVertical: hp(14),
        borderWidth: 1,
        borderColor: Colors.COLOR_DANGER,
        backgroundColor: '#FF383C0F',
    },
    addMoreBtn: {
        alignItems: 'center',
        marginTop: hp(8),
        paddingVertical: hp(10),
        borderRadius: wp(8),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
    dotsBtn: {
        width: wp(32),
        height: wp(32),
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.15)',
        alignItems: 'flex-end',
        paddingTop: hp(95),
        paddingRight: wp(20),
    },
    menu: {
        minWidth: wp(200),
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(12),
        paddingVertical: hp(4),
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(12),
    },
    menuDivider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(12),
    },
});