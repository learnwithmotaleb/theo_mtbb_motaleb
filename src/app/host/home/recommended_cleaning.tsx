import { useFormat } from '@/lib/useFormat';
import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { HousingIcon } from '@/assets/icons/cleaner_icon/HousingIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Body5, Body6, Body7, Caption2, Caption3, Caption5 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { formatClock, toDateKey } from '@/lib/datetime';

import { accommodationPhoto, avatarSource, personName } from '@/lib/mappers';
import { computeSchedulePrice } from '@/lib/pricing';

import { useGetAccommodationByIdQuery } from '@/redux/services/accommodationApi';
import { useGetAccommodationCleanersQuery } from '@/redux/services/assignmentApi';
import { usePlatformFeePercent } from '@/redux/services/miscApi';
import { useCreateScheduleMutation } from '@/redux/services/scheduleApi';
import { AppImage } from '@/components/shared/AppImage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

// ── Summary row ───────────────────────────────────────────────────────────────
function SummaryRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <View style={cleanStyles.summaryRow}>
            <View style={cleanStyles.summaryLeft}>
                {icon}
                <Caption3 color={Colors.TEXT_COLOR}>{label}</Caption3>
            </View>
            <Body6 color={Colors.PRIMARY_TEXT} style={cleanStyles.summaryValue}>
                {value}
            </Body6>
        </View>
    );
}

// ── Price row ─────────────────────────────────────────────────────────────────
function PriceRow({
    label,
    value,
    bold,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) {
    const Text = bold ? Body7 : Body6;
    const color = bold ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR;
    return (
        <View style={cleanStyles.priceRow}>
            <Text color={color}>{label}</Text>
            <Text color={bold ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR}>{value}</Text>
        </View>
    );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function RecommendedCleaningScreen() {
    const t = useT();
    const { formatDate, formatMoney } = useFormat();
    const router = useRouter();
    const params = useLocalSearchParams<{
        accommodationId?: string;
        cleanerId?: string;
        date?: string;
        checkInTime?: string;
        checkOutTime?: string;
    }>();

    const accommodationId = params.accommodationId ?? '';

    const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(
        accommodationId,
        { skip: !accommodationId },
    );
    const { data: assignments } = useGetAccommodationCleanersQuery(accommodationId, {
        skip: !accommodationId,
    });
    const [createSchedule, { isLoading: isCreating }] = useCreateScheduleMutation();
    const feePercent = usePlatformFeePercent();

    // The cleaner the host came in with, else the accepted primary on this
    // accommodation. Only an accepted assignment can be scheduled.
    const assignment = useMemo(() => {
        const rows = (assignments ?? []).filter((a) => a.status === 'accepted');
        const byParam = params.cleanerId
            ? rows.find((a) => {
                  const cleaner = a.cleaner as any;
                  return cleaner?._id === params.cleanerId || a._id === params.cleanerId;
              })
            : undefined;
        return byParam ?? rows.find((a) => a.role === 'primary') ?? rows[0] ?? null;
    }, [assignments, params.cleanerId]);

    const cleaner = (assignment?.cleaner ?? null) as any;
    const cleanerAssigned = Boolean(assignment);

    // Fall back to the times the host set on the accommodation when the
    // recommendation could not read them off the iCal booking.
    const checkOutTime =
        formatClock(params.checkOutTime) || formatClock(accommodation?.checkOutTime) || '10:00';
    const checkInTime =
        formatClock(params.checkInTime) || formatClock(accommodation?.checkInTime) || '14:00';

    // Sent to the backend as YYYY-MM-DD; it resolves the day in the device's
    // timezone (x-timezone).
    const dateKey = params.date ? toDateKey(params.date) : toDateKey(new Date());

    const price = useMemo(
        () =>
            computeSchedulePrice(
                assignment?.pricePerCleaning,
                accommodation?.cleaningRate,
                feePercent,
            ),
        [assignment, accommodation, feePercent],
    );

    const data = useMemo(
        () => ({
            apartmentName: accommodation?.name ?? '',
            apartmentImage: accommodationPhoto(accommodation),
            address: [accommodation?.address, accommodation?.zipCode, accommodation?.city]
                .filter(Boolean)
                .join('\n'),
            addressOneLine: [accommodation?.address, accommodation?.city]
                .filter(Boolean)
                .join(', '),
            date: formatDate(params.date ?? new Date(), {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            }),
            checkOut: checkOutTime,
            checkIn: checkInTime,
            housekeeper: personName(cleaner, 'Not assigned'),
            cleaner: {
                name: personName(cleaner, 'Not assigned'),
                completedCleanings: cleaner?.cleaningsCompleted ?? 0,
                image: avatarSource(cleaner?.profileImage),
            },
        }),
        [accommodation, params.date, checkOutTime, checkInTime, cleaner],
    );

    // Creates the schedule, then hands the payment screen its id. The cleaner
    // has to accept before the host can actually pay.
    const handleNext = async () => {
        if (!accommodationId) return;
        if (!assignment) {
            showToast(t("Assign a cleaner to this accommodation first."), 'error');
            return;
        }
        try {
            const schedule = await createSchedule({
                accommodationId,
                cleanerId: (cleaner?._id as string) ?? assignment._id,
                date: dateKey,
                checkInTime,
                checkOutTime,
            }).unwrap();

            router.push({
                pathname: '/host/payment/payment_type',
                params: { scheduleId: schedule._id, accommodationId },
            } as any);
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not create the schedule.")), 'error');
        }
    };

    if (isLoading && !accommodation) {
        return (
            <SafeAreaView style={[cleanStyles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={cleanStyles.safe}>
            <SectionTitle title={t("Recommended Cleaning")} />
            <ScrollView
                contentContainerStyle={cleanStyles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Accommodation ── */}
                <View style={cleanStyles.section}>

                    <Pressable
                        style={cleanStyles.accommodationRow}
                        onPress={() =>
                            router.push({
                                pathname: '/host/housing/accommodation_details_view',
                                params: { id: accommodationId },
                            } as any)
                        }
                    >
                        <AppImage
                            source={data.apartmentImage}
                            style={cleanStyles.thumb}
                            contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                            <Caption2 color={"#8E8E93"} style={cleanStyles.sectionLabel}>
                                {t("ACCOMMODATION")}
                            </Caption2>
                            <Caption2 color={Colors.PRIMARY_TEXT}>{data.apartmentName}</Caption2>
                            <View style={cleanStyles.addressRow}>
                               <View style={{marginTop:hp(5)}}>
                                 <LocationIcon size={24} color={"#727272"} />
                               </View>
                                <Caption3 color={Colors.TEXT_COLOR}>{data.address}</Caption3>
                            </View>
                        </View>
                        <RightAngleIcon size={22} color={Colors.TEXT_COLOR} />
                    </Pressable>
                </View>

                {/* ── Cleaning Date ── */}
                <View style={cleanStyles.section}>
                    <View style={cleanStyles.dateRow}>
                        <View style={cleanStyles.dateIcon}>
                            <CalendarIcon size={24} color={Colors.TEXT_COLOR} />
                        </View>
                        <View>
                            <Caption2 color={Colors.TEXT_COLOR}>{t("CLEANING DATE")}</Caption2>
                            <Body4 color={Colors.PRIMARY_TEXT}>{data.date}</Body4>
                        </View>
                    </View>
                </View>

                {/* ── Cleaning Time ── */}
                <View style={cleanStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={cleanStyles.sectionLabel}>
                        {t("CLEANING TIME")}
                    </Caption2>
                    <View style={cleanStyles.timeRow}>
                        <View style={{ flex: 1 }}>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Check-out")}</Caption3>
                            <Body5 color={Colors.PRIMARY_TEXT}>{data.checkOut}</Body5>
                        </View>
                        <View style={cleanStyles.timeDivider} />
                        <View style={{ flex: 1 }}>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Check-in")}</Caption3>
                            <Body5 color={Colors.PRIMARY_TEXT}>{data.checkIn}</Body5>
                        </View>
                    </View>
                    <Caption5 color={Colors.TEXT_COLOR} style={{ marginTop: hp(8) }}>
                        {t("Times are automatically retrieved for the booking.")}
                    </Caption5>
                </View>

                {/* ── Cleaner section ── */}
                {cleanerAssigned ? (
                    <View style={cleanStyles.section}>
                        <View style={cleanStyles.cleanerCard}>
                            <AppImage
                                source={data.cleaner.image}
                                style={cleanStyles.cleanerAvatar}
                                contentFit="cover"
                            />
                            <View style={{ flex: 1 }}>
                                <Caption2 color={"#727272"}>{t("CLEANER")}</Caption2>
                                <Body4 color={Colors.PRIMARY_TEXT}>{data.cleaner.name}</Body4>
                                <Caption2 color={Colors.TEXT_COLOR}>
                                    {data.cleaner.completedCleanings} Cleaning completed
                                </Caption2>
                            </View>
                            <Pressable
                                style={cleanStyles.messageBtn}
                                onPress={() =>
                                    router.push({
                                        pathname: '/host/housing/manage_cleaners',
                                        params: { id: accommodationId },
                                    } as any)
                                }
                            >
                                <Body6 color={Colors.APP_BACKGROUND}>{t("Manage")}</Body6>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <CustomButton
                        title={t("Assign Cleaner")}
                        onPress={() => router.push('/host/home/add_houskeeper' as any)}
                        backgroundColor={Colors.BORDER_COLOR}
                        color={Colors.PRIMARY_TEXT}
                        width="100%"
                        borderRadius={wp(14)}
                        style={{ marginBottom: hp(16) }}
                    />
                )}

                {/* ── Summary ── */}
                <View style={cleanStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={cleanStyles.sectionLabel}>
                        {t("SUMMARY")}
                    </Caption2>
                    <SummaryRow
                        icon={<HousingIcon size={18} color={Colors.TEXT_COLOR} />}
                        label={t("Accommodation")}
                        value={data.addressOneLine}
                    />
                    {/* <View style={cleanStyles.divider} /> */}
                    <SummaryRow
                        icon={<CalendarIcon size={18} color={Colors.TEXT_COLOR} />}
                        label={t("Date")}
                        value={data.date}
                    />
                    {/* <View style={cleanStyles.divider} /> */}
                    <SummaryRow
                        icon={<ClockIcon size={14} color={Colors.TEXT_COLOR} />}
                        label={t("Check-out / Check-in")}
                        value={`${data.checkOut}  →  ${data.checkIn}`}
                    />
                    {/* <View style={cleanStyles.divider} /> */}
                    <SummaryRow
                        icon={<UserIcon size={14} color={Colors.TEXT_COLOR} />}
                        label={t("Housekeeper")}
                        value={data.housekeeper}
                    />
                </View>

                {/* ── Price Details ── */}
                <View style={cleanStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={cleanStyles.sectionLabel}>
                        {t("PRICE DETAILS")}
                    </Caption2>
                    <PriceRow
                        label={t("Cleaning Service")}
                        value={formatMoney(price.cleaningService)}
                    />
                    <PriceRow
                        label={`Service Fee (${price.feePercent}%)`}
                        value={formatMoney(price.serviceFee)}
                    />
                    <PriceRow label={t("Total")} value={formatMoney(price.total)} bold />
                </View>
            </ScrollView>

            {/* Next button */}
            <View style={cleanStyles.footer}>
                <CustomButton
                    title={isCreating ? 'Scheduling...' : 'Next'}
                    onPress={handleNext}
                    disabled={!cleanerAssigned || isCreating}
                    width="100%"
                    backgroundColor={cleanerAssigned ? Colors.PRIMARY_TEXT : Colors.BORDER_COLOR}
                    color="#fff"
                    borderRadius={wp(14)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const cleanStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: {
        paddingTop: hp(10),
        paddingBottom: hp(100)
    },
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(12),
    },
    sectionLabel: { marginBottom: hp(10), letterSpacing: 0.6 },

    // Accommodation
    accommodationRow: { flexDirection: 'row', alignItems: 'center', gap: wp(12) },
    thumb: {
        width: wp(120),
        height: wp(120),
        borderRadius: wp(10)
    },
    addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(4), marginTop: hp(4) },

    // Date
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: wp(12) },
    dateIcon: {
        width: wp(36), height: wp(36), borderRadius: wp(18),
        backgroundColor: Colors.APP_BACKGROUND,
        borderWidth: 1, borderColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },

    // Time
    timeRow: { flexDirection: 'row', alignItems: 'center' },
    timeDivider: { width: 1, height: hp(40), backgroundColor: Colors.BORDER_COLOR, marginHorizontal: wp(16) },

    // Cleaner
    cleanerCard: { flexDirection: 'row', alignItems: 'center', gap: wp(12) },
    cleanerAvatar: { width: wp(70), height: wp(70), borderRadius: wp(35) },
    messageBtn: {
        paddingHorizontal: wp(14), paddingVertical: hp(8),
        borderRadius: wp(8),
        backgroundColor: "#000000",
        borderWidth: 1, borderColor: Colors.BORDER_COLOR,
    },

    // Summary
    summaryRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(10), paddingVertical: hp(8) },
    summaryLeft: { flexDirection: 'row', alignItems: 'center', gap: wp(8), width: wp(130) },
    summaryValue: { flex: 1, textAlign: 'right' },

    // Price
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: hp(8) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },

    // Footer
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1, borderColor: Colors.BORDER_COLOR,
        // marginBottom:hp(10)
    },
});