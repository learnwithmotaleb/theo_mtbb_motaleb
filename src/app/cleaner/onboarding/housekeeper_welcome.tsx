import { ShieldCheckIcon } from '@/assets/icons/cleaner_icon/ShieldCheckIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { InfoCard } from '@/components/shared/InfoCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body6, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function HousekeeperWelcomeScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        setIsLoading(false);
        router.push('/cleaner/onboarding/professional_status');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Gestlio" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginVertical: hp(30) }}>
                    <StepIndicator
                    totalSteps={5}
                    currentStep={1}
                    activeColor={Colors.COLOR_ACTIVE}
                />
                </View>

                <View style={styles.illustrationBox}>
                    <Image
                        source={IMAGE_COMPONENTS.cleanerWelcomeImage}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                <H1 align="center" color={Colors.COLOR_ACTIVE} style={styles.title}>
                    Welcome to Gestlio
                </H1>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Lest create your account together so you can recieve assignments
                    that suit you
                </Body6>

                <View style={styles.cards}>
                    <InfoCard
                        icon={<ShieldCheckIcon size={20} color={Colors.COLOR_ACTIVE} />}
                        title="Verified Assignment"
                        description="Secured payment and trusted client"
                    />
                    <InfoCard
                        icon={<ShieldCheckIcon size={20} color={Colors.COLOR_ACTIVE} />}
                        title="More Flexibility"
                        description="Choose the assignment that interest you."
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onPress={handleContinue}
                    backgroundColor={Colors.BG_BLACK}
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
        backgroundColor: "#FAFAFA",
        paddingHorizontal: wp(20),
    },
    scroll: {
        paddingBottom: hp(20),
    },
    illustrationBox: {
        alignItems: 'center',
        marginBottom: hp(20),
    },
    illustration: {
        width: wp(200),
        height: hp(160),
    },
    title: { marginBottom: hp(10) },
    subtitle: { marginBottom: hp(28) },
    cards: { gap: hp(10) },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});