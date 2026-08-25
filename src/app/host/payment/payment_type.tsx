import { CalendarIcon } from '@/assets/icons/cleaner_icon/CalendarIcon';
import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, Body7, Caption2, Caption3 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { CLEANING_DETAIL } from '@/data/hostFakeData';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type PaymentMethod = 'card' | 'apple_pay' | 'google_pay';

function RadioButton({ selected }: { selected: boolean }) {
    return (
        <View style={[payStyles.radio, selected && payStyles.radioSelected]}>
            {selected && <View style={payStyles.radioDot} />}
        </View>
    );
}

function PaymentOption({
    method,
    label,
    icon,
    rightIcons,
    selected,
    onPress,
}: {
    method: PaymentMethod;
    label: string;
    icon?: React.ReactNode;
    rightIcons?: React.ReactNode;
    selected: boolean;
    onPress: () => void;
}) {
    return (
        <Pressable style={payStyles.payOption} onPress={onPress}>
            <RadioButton selected={selected} />
            {icon}
            <Body6 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>{label}</Body6>
            {rightIcons}
        </Pressable>
    );
}

export default function PaymentScreen() {
    const router = useRouter();
    const data = CLEANING_DETAIL;
    const [selected, setSelected] = useState<PaymentMethod>('card');

    const total = data.cleaningService + data.serviceFee;

    return (
        <SafeAreaView style={payStyles.safe}>
            <SectionTitle title="Payment" />
            <ScrollView contentContainerStyle={payStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Accommodation card */}
                <View style={payStyles.section}>
                    <View style={payStyles.accomRow}>
                        <Image source={data.apartmentImage} style={payStyles.thumb} contentFit="cover" />
                        <View style={{ flex: 1 }}>
                            <Caption2 color="#8E8E93" style={payStyles.label}>ACCOMMODATION</Caption2>
                            <Caption2 color={Colors.PRIMARY_TEXT}>{data.apartmentName}</Caption2>
                            <View style={payStyles.addressRow}>
                                <View style={{ marginTop: hp(5) }}>
                                    <LocationIcon size={20} color={"#727272"} />
                                </View>
                                <Caption3 color={"#727272"}>{data.address}</Caption3>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking info */}
                <View style={payStyles.section}>
                    {[
                        { icon: <CalendarIcon size={18} color={"#8E8E93"} />, label: 'Date', value: data.date },
                        { icon: <ClockIcon size={14} color={"#8E8E93"} />, label: 'Check-out / Check-in', value: `${data.checkOut} ➔ ${data.checkIn}` },
                        { icon: <UserIcon size={14} color={"#8E8E93"} />, label: 'Housekeeper', value: data.housekeeper },
                    ].map((row, idx, arr) => (
                        <React.Fragment key={row.label}>
                            <View style={payStyles.infoRow}>
                                <View style={payStyles.infoLeft}>
                                    {row.icon}
                                    <Caption3 color={"#8E8E93"}>{row.label}</Caption3>
                                </View>
                                <Caption3 color={Colors.PRIMARY_TEXT}>{row.value}</Caption3>
                            </View>
                            {/* {idx < arr.length - 1 && <View style={payStyles.divider} />} */}
                        </React.Fragment>
                    ))}
                </View>

                {/* Price details */}
                <View style={payStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={payStyles.label}>PRICE DETAILS</Caption2>
                    <View style={payStyles.infoRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>Cleaning Service</Caption3>
                        <Caption3 color={Colors.TEXT_COLOR}>{data.cleaningService},00 €</Caption3>
                    </View>
                    {/* <View style={payStyles.divider} /> */}
                    <View style={payStyles.infoRow}>
                        <Caption3 color={Colors.TEXT_COLOR}>Service Fee</Caption3>
                        <Caption3 color={Colors.TEXT_COLOR}>{data.serviceFee},00 €</Caption3>
                    </View>
                    {/* <View style={payStyles.divider} /> */}
                    <View style={payStyles.infoRow}>
                        <Body7 color={Colors.PRIMARY_TEXT}>Total to Pay</Body7>
                        <Body7 color={Colors.PRIMARY_TEXT}>{total},00 €</Body7>
                    </View>
                </View>

                {/* Payment method */}
                <View style={payStyles.section}>
                    <Caption2 color={Colors.TEXT_COLOR} style={payStyles.label}>PAYMENT METHOD</Caption2>

                    <PaymentOption
                        method="card"
                        label="Card"
                        selected={selected === 'card'}
                        onPress={() => setSelected('card')}
                        icon={<UserIcon size={18} color={Colors.TEXT_COLOR} />}
                        rightIcons={
                            <View style={{ flexDirection: 'row', gap: wp(4) }}>
                                <Image source={IMAGE_COMPONENTS.americanEx} style={payStyles.payIcon} contentFit="contain" />
                                <Image source={IMAGE_COMPONENTS.masterCard} style={payStyles.payIcon} contentFit="contain" />
                            </View>
                        }
                    />
                    {/* <View style={payStyles.divider} /> */}
                    <PaymentOption
                        method="apple_pay"
                        label="Apple Pay"
                        selected={selected === 'apple_pay'}
                        onPress={() => setSelected('apple_pay')}
                        icon={<Image source={IMAGE_COMPONENTS.applePay} style={payStyles.payMethodIcon} contentFit="contain" />}
                    />
                    {/* <View style={payStyles.divider} /> */}
                    <PaymentOption
                        method="google_pay"
                        label="Google Pay"
                        selected={selected === 'google_pay'}
                        onPress={() => setSelected('google_pay')}
                        icon={<Image source={IMAGE_COMPONENTS.googlePay} style={payStyles.payMethodIcon} contentFit="contain" />}
                    />
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={payStyles.footer}>
                <CustomButton
                    title="Confirm & Pay"
                    onPress={() => router.push('/host/payment/payment_success' as any)}
                    width="100%"
                    backgroundColor={"#0088FF"}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const payStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    scroll: { paddingBottom: hp(100) },
    section: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(12),
    },
    label: {
        letterSpacing: 0.8
    },
    accomRow: { flexDirection: 'row', alignItems: 'center', gap: wp(12) },
    thumb: {
        width: wp(100),
        height: wp(100),
        borderRadius: wp(10)
    },
    addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: wp(4), marginTop: hp(4) },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: hp(8) },
    infoLeft: { flexDirection: 'row', alignItems: 'center', gap: wp(8) },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
    payOption: { flexDirection: 'row', alignItems: 'center', gap: wp(12), paddingVertical: hp(14) },
    radio: {
        width: wp(20), height: wp(20), borderRadius: wp(10),
        borderWidth: 2, borderColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: Colors.COLOR_ACTIVE },
    radioDot: {
        width: wp(10), height: wp(10), borderRadius: wp(5),
        backgroundColor: Colors.COLOR_ACTIVE,
    },
    payIcon: { width: wp(36), height: hp(22) },
    payMethodIcon: { width: wp(44), height: hp(24) },
    footer: {
        // position: 'absolute', bottom: 0, left: 0, right: 0,
        // padding: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        //  borderColor: Colors.BORDER_COLOR,
    },
});