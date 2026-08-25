import { BankIcon } from '@/assets/icons/cleaner_icon/BankIcon';
import { CopyIcon } from '@/assets/icons/cleaner_icon/CopyIcon';
import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import { StepIndecatorFillIcon } from '@/assets/icons/common_icon/StepIndecatorFillIcon';
import { InfoIcon } from '@/assets/icons/host_icon/InfoIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption2, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const RIB = {
    holder: 'Sophie Martin',
    iban: 'FR76 1234 5678 9012 3456 7890 123',
    bic: 'BNPAFRPRXXX',
};

function CopyField({ label, value }: { label: string; value: string }) {
    return (
        <View style={ribStyles.fieldBlock}>
            <Caption3 color={Colors.TEXT_COLOR}>{label}</Caption3>
            <View style={ribStyles.fieldRow}>
                <Body6 color={Colors.PRIMARY_TEXT} style={{ flex: 1 }}>{value}</Body6>
                <Pressable onPress={() => Clipboard.setStringAsync(value)} hitSlop={8}>
                    <CopyIcon size={18} color={Colors.TEXT_COLOR} />
                </Pressable>
            </View>
        </View>
    );
}

export default function CleanerPaymentScreen() {
    return (
        <SafeAreaView style={ribStyles.safe}>
            <SectionTitle title="Payment Methods" />
            <ScrollView contentContainerStyle={ribStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Hero */}
                <View style={ribStyles.heroRow}>
                    <View style={ribStyles.heroCircle}>
                        <BankIcon size={32} color={Colors.TEXT_COLOR} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body5 color={Colors.PRIMARY_TEXT}>
                            Receive your payment into your bank account
                        </Body5>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                            Add and manage your bank account securely
                        </Caption3>
                    </View>
                </View>

                {/* RIB Card */}
                <View style={ribStyles.card}>
                    {/* Primary badge */}
                    <View style={ribStyles.primaryBadge}>
                        <View style={ribStyles.badgeCheck}>
                            <StepIndecatorFillIcon color='#8E8E93'/>
                        </View>
                        <Caption3 color={Colors.TEXT_COLOR}>PRIMARY BANK ACCOUNT</Caption3>
                    </View>

                    <Caption2 color={Colors.PRIMARY_TEXT} style={{ marginTop: hp(12) }}>My RIB</Caption2>

                    <Caption5 color={Colors.TEXT_COLOR} style={{ marginTop: hp(8) }}>
                        Account holder:
                    </Caption5>
                    <Body5 color={Colors.TEXT_COLOR}>{RIB.holder}</Body5>

                    <CopyField label="IBAN" value={RIB.iban} />
                    <CopyField label="BIC"  value={RIB.bic} />

                    {/* Modify button */}
                    <Pressable style={ribStyles.modifyBtn}>
                        <EditPenIcon size={16} color={Colors.TEXT_COLOR} />
                        <Body6 color={Colors.TEXT_COLOR}>Modify my RIB</Body6>
                    </Pressable>
                </View>

                {/* Why add a RIB info card */}
                <View style={ribStyles.infoCard}>
                    <View style={ribStyles.infoIconWrapper}>
                        <InfoIcon size={18} color={Colors.TEXT_COLOR} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Caption2 color={Colors.PRIMARY_TEXT}>Why add a RIB?</Caption2>
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4) }}>
                            Your revenues and refunds will be sent directly to this bank account. We use bank-grade encryption to ensure your data stays private.
                        </Caption3>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const ribStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },

    // Hero
    heroRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(16),
        marginVertical: hp(20),
    },
    heroCircle: {
        width: wp(72),
         height: wp(72),
        borderRadius: wp(36),
        backgroundColor: "#b640401a",
        alignItems: 'center',
         justifyContent: 'center',
    },

    // RIB card
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(16),
    },
    primaryBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(6),
        alignSelf: 'flex-start',
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        borderRadius: wp(20),
        paddingHorizontal: wp(10),
        paddingVertical: hp(4),
        backgroundColor: "#8F8F8F1A"
    },
    badgeCheck: {
        width: wp(16), height: wp(16),
        borderRadius: wp(8),
        backgroundColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },

    // Fields
    fieldBlock: { marginTop: hp(16) },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(6),
        padding: wp(12),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },

    // Modify button
    modifyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: wp(8),
        marginTop: hp(16),
        padding: hp(14),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },

    // Info card
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        padding: wp(16),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
    infoIconWrapper: {
        width: wp(32), height: wp(32),
        borderRadius: wp(16),
        backgroundColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },
});