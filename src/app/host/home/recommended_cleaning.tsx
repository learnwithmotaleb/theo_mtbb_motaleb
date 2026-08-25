import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { HousingIcon } from '@/assets/icons/cleaner_icon/HousingIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Body5, Body6, Body7, Caption2, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANING_DETAIL } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    const router = useRouter();
    const data = CLEANING_DETAIL;

    // true = cleaner assigned, false = not assigned
    const [cleanerAssigned] = useState(true);

    return (
        <SafeAreaView style={cleanStyles.safe}>
            <SectionTitle title="Recommended Cleaning" />
            <ScrollView
                contentContainerStyle={cleanStyles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Accommodation ── */}
                <View style={cleanStyles.section}>

                    <Pressable style={cleanStyles.accommodationRow} onPress={() => { }}>
                        <Image
                            source={data.apartmentImage}
                            style={cleanStyles.thumb}
                            contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                            <Caption2 color={"#8E8E93"} style={cleanStyles.sectionLabel}>
                                ACCOMMODATION
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
                            <Caption2 color={Colors.TEXT_COLOR}>CLEANING DATE</Caption2>
                            <Body4 color={Colors.PRIMARY_TEXT}>{data.date}</Body4>
                        </View>
                    </View>
                </View>

                {/* ── Cleaning Time ── */}
                <View style={cleanStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={cleanStyles.sectionLabel}>
                        CLEANING TIME
                    </Caption2>
                    <View style={cleanStyles.timeRow}>
                        <View style={{ flex: 1 }}>
                            <Caption3 color={Colors.TEXT_COLOR}>Check-out</Caption3>
                            <Body5 color={Colors.PRIMARY_TEXT}>{data.checkOut}</Body5>
                        </View>
                        <View style={cleanStyles.timeDivider} />
                        <View style={{ flex: 1 }}>
                            <Caption3 color={Colors.TEXT_COLOR}>Check-in</Caption3>
                            <Body5 color={Colors.PRIMARY_TEXT}>{data.checkIn}</Body5>
                        </View>
                    </View>
                    <Caption5 color={Colors.TEXT_COLOR} style={{ marginTop: hp(8) }}>
                        Times are automatically retrieved for the booking.
                    </Caption5>
                </View>

                {/* ── Cleaner section ── */}
                {cleanerAssigned ? (
                    <View style={cleanStyles.section}>
                        <View style={cleanStyles.cleanerCard}>
                            <Image
                                source={data.cleaner.image}
                                style={cleanStyles.cleanerAvatar}
                                contentFit="cover"
                            />
                            <View style={{ flex: 1 }}>
                                <Caption2 color={"#727272"}>CLEANER</Caption2>
                                <Body4 color={Colors.PRIMARY_TEXT}>{data.cleaner.name}</Body4>
                                <Caption2 color={Colors.TEXT_COLOR}>
                                    {data.cleaner.completedCleanings} Cleaning completed
                                </Caption2>
                            </View>
                            <Pressable style={cleanStyles.messageBtn} onPress={() => { }}>
                                <Body6 color={Colors.APP_BACKGROUND}>Manage</Body6>
                            </Pressable>
                        </View>
                    </View>
                ) : (
                    <CustomButton
                        title="Assign Cleaner"
                        onPress={() => { }}
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
                        SUMMARY
                    </Caption2>
                    <SummaryRow
                        icon={<HousingIcon size={18} color={Colors.TEXT_COLOR} />}
                        label="Accommodation"
                        value={data.addressOneLine}
                    />
                    {/* <View style={cleanStyles.divider} /> */}
                    <SummaryRow
                        icon={<CalendarIcon size={18} color={Colors.TEXT_COLOR} />}
                        label="Date"
                        value={data.date}
                    />
                    {/* <View style={cleanStyles.divider} /> */}
                    <SummaryRow
                        icon={<ClockIcon size={14} color={Colors.TEXT_COLOR} />}
                        label="Check-out / Check-in"
                        value={`${data.checkOut}  →  ${data.checkIn}`}
                    />
                    {/* <View style={cleanStyles.divider} /> */}
                    <SummaryRow
                        icon={<UserIcon size={14} color={Colors.TEXT_COLOR} />}
                        label="Housekeeper"
                        value={data.housekeeper}
                    />
                </View>

                {/* ── Price Details ── */}
                <View style={cleanStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={cleanStyles.sectionLabel}>
                        PRICE DETAILS
                    </Caption2>
                    <PriceRow label="Cleaning Service" value={`${data.cleaningService},00 €`} />
                    {/* <View style={cleanStyles.divider} /> */}
                    <PriceRow label="Service Fee" value={`${data.serviceFee},00 €`} />
                    {/* <View style={cleanStyles.divider} /> */}
                    <PriceRow
                        label="Total"
                        value={`${data.cleaningService + data.serviceFee},00 €`}
                        bold
                    />
                </View>
            </ScrollView>

            {/* Next button */}
            <View style={cleanStyles.footer}>
                <CustomButton
                    title="Next"
                    onPress={() => router.push('/host/payment/payment_type' as any)}
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