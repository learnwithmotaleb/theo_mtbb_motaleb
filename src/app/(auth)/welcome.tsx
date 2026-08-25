import { ActionIcon } from '@/assets/icons/common_icon/ActionIcon';
import { InfoIcon } from '@/assets/icons/common_icon/InfoIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { ProfileIcon } from '@/assets/icons/common_icon/ProfileIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body6, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

const NEXT_STEPS = [
    { IconComponent: ProfileIcon, label: 'Complete your profile.' },
    { IconComponent: InfoIcon, label: 'Add your information.' },
    { IconComponent: ActionIcon, label: 'Start your first action.' },
];

export default function WelcomeScreen() {
    const router = useRouter();

    const handleGoToSpace = () => {
        // router.push('../host/onboarding/welcome_host');
        // router.push('/host/onboarding/welcome_host');
    };

    return (
        <View style={styles.root}>
            <View style={styles.topRow}>
                <Pressable
                    onPress={() => router.back()}
                    style={({ pressed }) => [
                        styles.backBtn,
                        { opacity: pressed ? 0.6 : 1 }
                    ]}
                    hitSlop={8}
                >
                    <LeftAngleIcon />
                </Pressable>
            </View>

            <View style={styles.content}>
                {/* Success illustration */}
                <View style={styles.welcomeImageWrapper}>
                    <Image
                        source={IMAGE_COMPONENTS.welcomeImage}
                        style={styles.welcomeImage}
                        contentFit="contain"
                    />
                </View>

                {/* Title & description */}
                <H1 color={Colors.PRIMARY_TEXT} align="center" style={styles.title}>
                    Welcome to Gestlio!
                </H1>
                <Body6 color={Colors.TEXT_COLOR} align="center" style={styles.description}>
                    Your space is now ready. You can start managing your consultations with peace of mind.
                </Body6>

                {/* What's next card */}
                <View style={styles.nextCard}>
                    <Body6 color={Colors.PRIMARY_TEXT} style={styles.nextTitle}>
                        What's next?
                    </Body6>

                    {NEXT_STEPS.map(({ IconComponent, label }, index) => (
                        <View key={index} style={styles.nextRow}>
                            <View style={styles.nextIconWrapper}>
                                <IconComponent />
                            </View>
                            <Body6 color={Colors.PRIMARY_TEXT}>{label}</Body6>
                        </View>
                    ))}
                </View>
            </View>

            {/* Bottom button */}
            <View style={styles.footer}>
                <CustomButton
                    title="Go to my space"
                    onPress={() => router.push('/host/onboarding/welcome_host')}
                    width="100%"
                    height={hp(56)}
                    borderRadius={14}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
        paddingTop: hp(30),
    },
    topRow: {
        marginBottom: hp(16),
    },
    backBtn: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    welcomeImageWrapper: {
        width: wp(250),
        height: wp(250),
        alignItems: 'center',
    },
    welcomeImage: {
        width: '100%',
        height: '100%',
    },
    title: {
        marginBottom: hp(8),
    },
    description: {
        marginBottom: hp(24),
        paddingHorizontal: wp(8),
    },
    nextCard: {
        width: '100%',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(20),
    },
    nextTitle: {
        marginBottom: hp(16),
    },
    nextRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(14),
    },
    nextIconWrapper: {
        marginRight: wp(12),
    },
    footer: {
        // paddingBottom: hp(32),
    },
});