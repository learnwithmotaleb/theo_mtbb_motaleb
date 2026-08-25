
import { AroplainIcon } from '@/assets/icons/cleaner_icon/AroplainIcon';
import { BellIcon } from '@/assets/icons/cleaner_icon/BellIcon';
import { ShieldCheckIcon } from '@/assets/icons/cleaner_icon/ShieldCheckIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body3, Body5, Body6, Body7, Caption3, H2 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function YouAreReadyScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setIsLoading(false);
        router.push('/cleaner/(tabs)');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Gestlio" />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                {/* Big checkmark illustration */}
                <View style={{ alignItems: 'center', marginVertical: hp(20) }}>
                    <Image
                        source={IMAGE_COMPONENTS.successImage}
                        contentFit="contain"
                        style={{ width: wp(200), height: hp(200) }}
                    />
                </View>

                <H2 align="center" color={Colors.COLOR_ACTIVE} style={styles.title}>
                    You are ready!
                </H2>
                <Body3 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Your profile has been successfully created.
                    You will start receiving your first missions.
                </Body3>

                {/* Next step card — full width */}
                <View style={styles.nextStepCard}>
                    <View style={styles.nextStepIcon}>
                      <AroplainIcon/>
                    </View>
                    <View style={styles.nextStepText}>
                        <Body7 color={Colors.PRIMARY_TEXT}>Next step</Body7>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            Explore your personalized dashboard to complete your schedule and set your
                            availability for upcoming missions.
                        </Caption3>
                    </View>
                </View>

                {/* Two mini cards side by side */}
                <View style={styles.miniCardsRow}>
                    <View style={styles.miniCard}>
                       <BellIcon size={24}/>
                        <Body5 color={Colors.PRIMARY_TEXT} style={styles.miniCardTitle}>
                            Stay Alerts
                        </Body5>
                        <Body6 color={Colors.TEXT_COLOR}>Push active</Body6>
                    </View>
                    <View style={styles.miniCard}>
                        <ShieldCheckIcon size={26} color={Colors.COLOR_ACTIVE} />
                        <Body5 color={Colors.PRIMARY_TEXT} style={styles.miniCardTitle}>
                            Verified
                        </Body5>
                        <Body6 color={Colors.TEXT_COLOR}>KYC Level 1</Body6>
                    </View>
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
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)

    },
    scroll: {  paddingBottom: hp(20) },

    title: { marginBottom: hp(10) },
    subtitle: { marginBottom: hp(28) },
    nextStepCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#55D63514',
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.COLOR_ACTIVE,
        padding: wp(16),
        gap: wp(12),
        marginBottom: hp(16),
    },
    nextStepIcon: {
        width: wp(44),
        height: wp(44),
        borderRadius: wp(12),
        backgroundColor: '#3AA6001A',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    nextStepText: { flex: 1, gap: hp(4) },
    miniCardsRow: {
        flexDirection: 'row',
        gap: wp(12),
    },
    miniCard: {
        flex: 1,
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        alignItems: 'center',
        gap: hp(4),
    },
    miniCardTitle: { marginTop: hp(4) },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});