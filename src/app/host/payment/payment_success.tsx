import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { HousingIcon } from '@/assets/icons/cleaner_icon/HousingIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Body7, Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANING_DETAIL } from '@/data/hostFakeData';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function PaymentSuccessScreen() {
    const router = useRouter();
    const data = CLEANING_DETAIL;
    const total = data.cleaningService + data.serviceFee;

    return (
        <SafeAreaView style={successStyles.safe}>
            <SectionTitle title="" showBackButton />
            <ScrollView contentContainerStyle={successStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Success icon */}
                <View style={successStyles.iconCircle}>
                    <Body7 color="#fff" style={{ fontSize: 28 }}>✓</Body7>
                </View>
                <Body4 color={Colors.PRIMARY_TEXT} align="center" style={{ marginTop: hp(12) }}>
                    Payment successful
                </Body4>
                <Caption3 color={"#727272"} align="center" style={successStyles.successDesc}>
                    Your payment is then held in escrow,{'\n'}
                    once the cleaner completes the task, the{'\n'}
                    payment is released to the cleaner?
                </Caption3>

                {/* Pending acceptance */}
                <Body4 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(6) }}>
                    Pending acceptance
                </Body4>
                <Caption3 color={"#727272"} style={{ marginBottom: hp(16) }}>
                    Your cleaning is scheduled and awaiting confirmation from {data.housekeeper}.
                </Caption3>

                {/* Summary */}
                <View style={successStyles.section}>
                    <Caption2 color={"#8E8E93"} style={successStyles.label}>SUMMARY</Caption2>
                    {[
                        { icon: <HousingIcon size={16} color={"#8E8E93"} />, label: 'Accommodation', value: data.addressOneLine },
                        { icon: <CalendarIcon size={18} color={"#8E8E93"} />, label: 'Date', value: data.date },
                        { icon: <ClockIcon size={14} color={"#8E8E93"} />, label: 'Check-out / Check-in', value: `${data.checkOut}  →  ${data.checkIn}` },
                        { icon: <UserIcon size={14} color={"#8E8E93"} />, label: 'Housekeeper', value: data.housekeeper },
                    ].map((row, idx, arr) => (
                        <React.Fragment key={row.label}>
                            <View style={successStyles.infoRow}>
                                <View style={successStyles.infoLeft}>
                                    {row.icon}
                                    <Caption2 color={"#8E8E93"}>{row.label}</Caption2>
                                </View>
                                <Caption3 color={Colors.PRIMARY_TEXT} style={{ flex: 1, textAlign: 'right' }}>
                                    {row.value}
                                </Caption3>
                            </View>
                            {/* {idx < arr.length - 1 && <View style={successStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

                {/* Price */}
                <View style={successStyles.section}>
                    <Caption2 color={"#8E8E93"} style={successStyles.label}>PRICE DETAILS</Caption2>
                    <View style={successStyles.infoRow}>
                        <Caption2 color={"#8E8E93"}>Cleaning Service</Caption2>
                        <Caption3 color={Colors.TEXT_COLOR}>{data.cleaningService},00 €</Caption3>
                    </View>
                    {/* <View style={successStyles.divider} /> */}
                    <View style={successStyles.infoRow}>
                        <Caption2 color={"#8E8E93"}>Service Fee</Caption2>
                        <Caption3 color={Colors.TEXT_COLOR}>{data.serviceFee},00 €</Caption3>
                    </View>
                    {/* <View style={successStyles.divider} /> */}
                    <View style={successStyles.infoRow}>
                        <Body7 color={Colors.PRIMARY_TEXT}>Total</Body7>
                        <Body7 color={Colors.PRIMARY_TEXT}>{total},00 €</Body7>
                    </View>
                </View>

                {/* Secure payment note */}
                <Body7 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(6) }}>
                    Secure payment
                </Body7>
                <Caption3 color={"#4B4B4B"}>
                    Payment has been successfully processed. You will only be charged once the cleaning has been accepted and completed.
                </Caption3>
            </ScrollView>

            {/* Footer */}
            <View style={successStyles.footer}>
                <CustomButton
                    title="Return to homepage"
                    onPress={() => router.replace('/host/(tabs)' as any)}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const successStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)
    },
    scroll: {
        paddingBottom: hp(100)
    },
    iconCircle: {
        alignSelf: 'center',
        width: wp(72), height: wp(72),
        borderRadius: wp(36),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
        marginTop: hp(8),
    },
    successDesc: { marginTop: hp(8), marginBottom: hp(24), lineHeight: hp(22) },
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(12),
    },
    label: { marginBottom: hp(10), letterSpacing: 0.6 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingVertical: hp(8) },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: wp(8) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1, borderColor: Colors.BORDER_COLOR,
    },
});