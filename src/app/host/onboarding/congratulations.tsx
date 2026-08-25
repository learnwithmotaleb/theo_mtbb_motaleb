import { ChatIcon } from '@/assets/icons/host_icon/ChatIcon';
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


const FEATURES = [
    {
        icon: <HousekeeperIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Send a cleaning request',
        desc: 'Choose the date and send a request to your housekeeper.',
    },
    {
        icon: <HousekeeperIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Track your requests',
        desc: 'Check the status of your requests in real time.',
    },
    {
        icon: <ChatIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Communicate easily',
        desc: 'Chat with your housekeeper directly from the chat.',
    },
];

export default function CongratulationsScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // router.push('/(tabs)/home');
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
                    Congratulations!
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Your property is ready.
                </Body6>

                {FEATURES.map((f, i) => (
                    <View key={i} style={styles.card}>
                        <View style={styles.iconBox}>{f.icon}</View>
                        <View style={styles.cardText}>
                            <Body5 color={Colors.TEXT_COLOR}>{f.title}</Body5>
                            <Body6 color={Colors.TEXT_COLOR} style={styles.cardDesc}>
                                {f.desc}
                            </Body6>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    // onPress={handleContinue}
                    onPress={() => router.push('/host/onboarding/next_step')}
                    title="Confirm and continue"
                    backgroundColor={Colors.BG_BLACK}
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
        marginTop: hp(8),
        marginBottom: hp(6),
    },
    subtitle: {
        marginBottom: hp(32),
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(16),
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