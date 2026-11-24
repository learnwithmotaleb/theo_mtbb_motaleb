import { useT } from '@/i18n';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body6, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { AppImage } from '@/components/shared/AppImage';
import { useGoToRoleHome } from '@/hooks/useSession';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';

export default function WelcomeScreen() {
    const t = useT();
    const router = useRouter();

    // Adding the first accommodation is the whole point of the wizard, but a
    // host who would rather do it later can go straight to their space.
    const goToRoleHome = useGoToRoleHome();
    const handleGoToSpace = () => {
        goToRoleHome('/host/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safe}>
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

            {/* Scrolls on small phones, so the content can never slide under the buttons. */}
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.welcomeImageWrapper}>
                    <AppImage
                        source={IMAGE_COMPONENTS.welcomeImage}
                        style={styles.welcomeImage}
                        contentFit="contain"
                    />
                </View>

                <H1 color={Colors.PRIMARY_TEXT} align="center" style={styles.title}>
                    {t("Welcome to Gestlio!")}
                </H1>
                <Body6 color={Colors.TEXT_COLOR} align="center" style={styles.description}>
                    {t("Your space is now ready. You can start managing your consultations with peace of mind.")}
                </Body6>
            </ScrollView>

            {/* Fixed footer, separate from the content — same buttons as the other onboarding screens. */}
            <View style={styles.footer}>
                <CustomButton
                    title={t("Add my first accommodation")}
                    onPress={() => router.push('/host/onboarding/welcome_host')}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                />
                <CustomButton
                    title={t("Skip for now")}
                    onPress={handleGoToSpace}
                    color={Colors.PRIMARY_TEXT}
                    backgroundColor={Colors.INPUT_BACKGROUND}
                    borderColor={Colors.BORDER_COLOR}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
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
    topRow: {
        marginTop: hp(8),
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
    // flexGrow + center: the image and text sit in the middle of the free space.
    scroll: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(16),
    },
    welcomeImageWrapper: {
        width: wp(240),
        height: wp(240),
        marginBottom: hp(24),
    },
    welcomeImage: {
        width: '100%',
        height: '100%',
    },
    title: {
        marginBottom: hp(8),
    },
    description: {
        paddingHorizontal: wp(8),
    },
    // CustomButton already adds marginTop: hp(10), which spaces the two buttons.
    footer: {
        width: '100%',
        paddingBottom: hp(12),
    },
});
