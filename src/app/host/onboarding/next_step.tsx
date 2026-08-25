import { HeadPhoneIcon } from '@/assets/icons/host_icon/HeadPhoneIcon';
import { HousekeeperIcon } from '@/assets/icons/host_icon/HousekeeperIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';


const NEXT_STEPS = [
    {
        icon: <HousekeeperIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Send a cleaning request',
        desc: 'Choose the date, time, and cleaning details.',
    },
    {
        icon: <HousekeeperIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Discover my dashboard',
        desc: 'Manage your properties, your cleanings, and your invoices.',
    },
    {
        icon: <HeadPhoneIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Need help?',
        desc: 'Check our help center or contact our support.',
    },
];

export default function AndNextScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/host/(tabs)');
        }, 800);
    };

    return (
        <SafeAreaView style={styles.safe}>
          <SectionTitle/>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    And next?
                </H2>
                <Body6 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Send your first cleaning request in just a few clicks.
                </Body6>

                <View style={styles.cardList}>
                    {NEXT_STEPS.map((step, i) => (
                        <View key={i} style={styles.card}>
                            <View style={styles.iconBox}>{step.icon}</View>
                            <View style={styles.cardText}>
                                <Body5 color={Colors.TEXT_COLOR}>{step.title}</Body5>
                                <Body6 color={Colors.TEXT_COLOR} style={styles.cardDesc}>
                                    {step.desc}
                                </Body6>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    onPress={handleContinue}
                    title="Confirm and continue"
                    backgroundColor={Colors.BRAND_PRIMARY}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                    isLoading={isLoading}
                    disabled={isLoading}
                />
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
    backBtn: {
        marginTop: hp(12),
        marginLeft: wp(20),
        width: wp(32),
    },
    scroll: {
        paddingBottom: hp(20),
    },
    title: {
        marginBottom: hp(8),
    },
    subtitle: {
        marginBottom: hp(32),
    },
    cardList: {
        gap: hp(16),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        gap: wp(14),
    },
    iconBox: {
        width: wp(44),
        height: wp(44),
        borderRadius: wp(12),
        backgroundColor: Colors.STATUS_COLOR_OPACITY,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    cardText: {
        flex: 1,
        gap: hp(3),
    },
    cardDesc: {
        marginTop: hp(2),
    },
    footer: {
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});