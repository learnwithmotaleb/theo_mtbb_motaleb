import { Translate, useT } from '@/i18n';
import { ActionIcon } from '@/assets/icons/common_icon/ActionIcon';
import { InfoIcon } from '@/assets/icons/common_icon/InfoIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { ProfileIcon } from '@/assets/icons/common_icon/ProfileIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body6, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { AppImage } from '@/components/shared/AppImage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

// Takes `t` so the labels follow the selected language.
const nextSteps = (t: Translate) => [
    { IconComponent: ProfileIcon, label: t("Complete your profile.") },
    { IconComponent: InfoIcon, label: t("Add your information.") },
    { IconComponent: ActionIcon, label: t("Start your first action.") },
];

export default function WelcomeScreen() {
    const t = useT();
    const router = useRouter();

    // Adding the first accommodation is the whole point of the wizard, but a
    // host who would rather do it later can go straight to their space.
    const handleGoToSpace = () => {
        router.replace('/host/(tabs)' as any);
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
                    <AppImage
                        source={IMAGE_COMPONENTS.welcomeImage}
                        style={styles.welcomeImage}
                        contentFit="contain"
                    />
                </View>

                {/* Title & description */}
                <H1 color={Colors.PRIMARY_TEXT} align="center" style={styles.title}>
                    {t("Welcome to Gestlio!")}
                </H1>
                <Body6 color={Colors.TEXT_COLOR} align="center" style={styles.description}>
                    {t("Your space is now ready. You can start managing your consultations with peace of mind.")}
                </Body6>

                {/* What's next card */}
                <View style={styles.nextCard}>
                    <Body6 color={Colors.PRIMARY_TEXT} style={styles.nextTitle}>
                        {t("What's next?")}
                    </Body6>

                    {nextSteps(t).map(({ IconComponent, label }, index) => (
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
                    title={t("Add my first accommodation")}
                    onPress={() => router.push('/host/onboarding/welcome_host')}
                    width="100%"
                    height={hp(56)}
                    borderRadius={14}
                />
                <CustomButton
                    title={t("Skip for now")}
                    onPress={handleGoToSpace}
                    color={Colors.TEXT_COLOR}
                    backgroundColor={Colors.APP_BACKGROUND}
                    borderColor={Colors.BORDER_COLOR}
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
        gap: hp(12),
        // paddingBottom: hp(32),
    },
});