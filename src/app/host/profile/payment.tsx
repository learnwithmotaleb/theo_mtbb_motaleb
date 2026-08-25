import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

import { RightAngleIcon } from '@/assets/icons/common_icon/RightAngleIcon';
import { CreditCardIcon } from '@/assets/icons/host_icon/CreditCardIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body1, Body6, Caption3, Caption5 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';


// ── Fake data ─────────────────────────────────────────────────────────────────
const BANK_CARDS = [
    {
        id: '1',
        icon: (
            <Image
                source={IMAGE_COMPONENTS.visaCard}
                style={{ width: wp(48), height: hp(30) }}
                resizeMode="contain"
            />
        ),
        name: 'Visa **** 4242',
        expiry: 'Expires 12/26',
        isDefault: true,
    },
    {
        id: '2',
        icon: (
            <Image
                source={IMAGE_COMPONENTS.masterCard}
                style={{ width: wp(40), height: hp(30) }}
                resizeMode="contain"
            />
        ),
        name: 'MasterCard **** 4242',
        expiry: 'Expires 12/26',
        isDefault: false,
    },
    {
        id: '3',
        icon: (
            <Image
                source={IMAGE_COMPONENTS.americanEx}
                style={{ width: wp(48), height: hp(30) }}
                resizeMode="contain"
            />
        ),
        name: 'American Express **** 4242',
        expiry: 'Expires 12/26',
        isDefault: false,
    },
];

const OTHER_METHODS = [
    {
        id: '1',
        icon: (
            <Image
                source={IMAGE_COMPONENTS.applePay}
                style={{ width: wp(48), height: hp(30) }}
                resizeMode="contain"
            />
        ),
        name: 'Apple Pay',
        description: 'Fast and secure payment with Apple Pay',
    },
    {
        id: '2',
        icon: (
            <Image
                source={IMAGE_COMPONENTS.googlePay}
                style={{ width: wp(48), height: hp(30) }}
                resizeMode="contain"
            />
        ),
        name: 'Google Pay',
        description: 'Fast and secure payment with Google Pay',
    },
];

// ── Card row ──────────────────────────────────────────────────────────────────
function CardRow({
    icon,
    name,
    expiry,
    isDefault,
    showDivider,
    onPress,
}: {
    icon: React.ReactNode;
    name: string;
    expiry: string;
    isDefault: boolean;
    showDivider: boolean;
    onPress: () => void;
}) {
    return (
        <>
            <Pressable style={styles.row} onPress={onPress}>
                <View style={styles.cardLogo}>{icon}</View>
                <View style={styles.rowInfo}>
                    <View style={styles.nameRow}>
                        <Body6 color={Colors.PRIMARY_TEXT}>{name}</Body6>
                        {isDefault && (
                            <View style={styles.defaultBadge}>
                                <Caption5 color={Colors.TEXT_COLOR}>Default</Caption5>
                            </View>
                        )}
                    </View>
                    <Caption3 color={Colors.TEXT_COLOR}>{expiry}</Caption3>
                </View>
                <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
            </Pressable>
            {/* {showDivider && <View style={styles.divider} />} */}
        </>
    );
}

// ── Other method row ──────────────────────────────────────────────────────────
function OtherRow({
    icon,
    name,
    description,
    showDivider,
    onPress,
}: {
    icon: React.ReactNode;
    name: string;
    description: string;
    showDivider: boolean;
    onPress: () => void;
}) {
    return (
        <>
            <Pressable style={styles.row} onPress={onPress}>
                <View style={styles.cardLogo}>{icon}</View>
                <View style={styles.rowInfo}>
                    <Body6 color={Colors.PRIMARY_TEXT}>{name}</Body6>
                    <Caption5 color={Colors.TEXT_COLOR}>{description}</Caption5>
                </View>
                <RightAngleIcon size={28} color={Colors.TEXT_COLOR} />
            </Pressable>
            {/* {showDivider && <View style={styles.divider} />} */}
        </>
    );
}

// ── Screen ────────────────────────────────────────────────────────────────────
export default function PaymentMethodsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Payment Methods" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero icon */}
                <View style={styles.heroBox}>
                    <View style={styles.heroCircle}>
                        <CreditCardIcon size={32} color={Colors.STATUS_COLOR} />
                    </View>
                    <Caption3
                        color={Colors.TEXT_COLOR}
                        align="center"
                        style={styles.heroDesc}
                    >
                        Manage your bank cards and other payment methods save to your account.
                    </Caption3>
                </View>

                {/* BANK CARDS */}
                <Body1 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    BANK CARDS
                </Body1>
                <View style={styles.card}>
                    {BANK_CARDS.map((item, idx) => (
                        <CardRow
                            key={item.id}
                            icon={item.icon}
                            name={item.name}
                            expiry={item.expiry}
                            isDefault={item.isDefault}
                            showDivider={idx < BANK_CARDS.length - 1}
                            onPress={() => {}}
                        />
                    ))}
                </View>

                {/* OTHER PAYMENT METHODS */}
                <Body1 color={Colors.TEXT_COLOR} style={styles.sectionLabel}>
                    OTHER PAYMENT METHODS
                </Body1>
                <View style={styles.card}>
                    {OTHER_METHODS.map((item, idx) => (
                        <OtherRow
                            key={item.id}
                            icon={item.icon}
                            name={item.name}
                            description={item.description}
                            showDivider={idx < OTHER_METHODS.length - 1}
                            onPress={() => {}}
                        />
                    ))}
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
        paddingBottom: hp(40),
    },
    heroBox: {
        alignItems: 'center',
        marginBottom: hp(28),
        marginTop: hp(8),
    },
    heroCircle: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(40),
        backgroundColor: "#0088FF1A",
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(16),
    },
    heroDesc: {
        paddingHorizontal: wp(20),
        lineHeight: hp(22),
    },
    sectionLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(10),
    },
    card: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(24),
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
        gap: wp(14),
        marginBottom:hp(8)
    },
    cardLogo: {
        width: wp(56),
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    rowInfo: {
        flex: 1,
        gap: hp(3),
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        flexWrap: 'wrap',
    },
    defaultBadge: {
        borderWidth: 1,
        borderColor: "#0088FF33",
        borderRadius: wp(20),
        paddingHorizontal: wp(15),
        paddingVertical: hp(3),
        backgroundColor:"#0088FF33",
    },
    divider: {
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
        marginHorizontal: wp(16),
    },
});