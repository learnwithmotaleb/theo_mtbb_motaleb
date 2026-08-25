import { CentralizedIcon } from '@/assets/icons/host_icon/CentralizedIcon';
import { HousekeeperIcon } from '@/assets/icons/host_icon/HousekeeperIcon';
import { SendIcon } from '@/assets/icons/host_icon/SendIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, ButtonText, H2 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';


// SVG icons — swap with your icon components if needed


const FEATURES = [
    {
        icon: <HousekeeperIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Find a trusted housekeeper',
        desc: 'Select, communicate, and work with total peace of mind.',
    },
    {
        icon: <SendIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Send your requests in just a few clicks',
        desc: 'Schedule your cleanings quickly and track their status.',
    },
    {
        icon: <CentralizedIcon size={22} color={Colors.STATUS_COLOR} />,
        title: 'Everything is centralized',
        desc: 'Manage your properties, your communications, and your history all in one place.',
    },
];

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            {/* Back button */}
            <SectionTitle/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Illustration */}
                <Image
                    source={IMAGE_COMPONENTS.hostWelcomeImage}
                    style={styles.illustration}
                    resizeMode="contain"
                />

                {/* Title */}
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    Welcome to Gestlio!
                </H2>

                {/* Description */}
                <Body6
                    align="center"
                    color={Colors.TEXT_COLOR}
                    style={styles.description}
                >
                    Create your first property to organize your cleaning more easily and
                    save time.
                </Body6>

                {/* Feature list */}
                <View style={styles.featureList}>
                    {FEATURES.map((f, i) => (
                        <View key={i} style={styles.featureCard}>
                            <View style={styles.iconBox}>{f.icon}</View>
                            <View style={styles.featureText}>
                                <Body5 color={Colors.TEXT_COLOR}>{f.title}</Body5>
                                <Body6
                                    color={Colors.TEXT_COLOR}
                                    style={styles.featureDesc}
                                >
                                    {f.desc}
                                </Body6>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* CTA */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.btn}
                    activeOpacity={0.85}
                    onPress={() => router.push('/host/onboarding/accommodation')}
                >
                    <ButtonText color={Colors.TEXT_WHITE}>Next</ButtonText>
                </TouchableOpacity>
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
   
    scroll: {
       
        paddingBottom: hp(20),
    },
    illustration: {
        width: wp(220),
        height: hp(180),
        alignSelf: 'center',
        marginTop: hp(8),
        marginBottom: hp(20),
    },
    title: {
        marginBottom: hp(10),
    },
    description: {
        // paddingHorizontal: wp(10),
        marginBottom: hp(28),
    },
    featureList: {
        gap: hp(0),
    },
    featureCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        padding: wp(16),
        marginBottom: hp(12),
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
    featureText: {
        flex: 1,
        gap: hp(3),
    },
    featureDesc: {
        marginTop: hp(2),
    },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
    btn: {
        height: hp(54),
        backgroundColor: Colors.BG_BLACK,
        borderRadius: wp(14),
        alignItems: 'center',
        justifyContent: 'center',
    },
});