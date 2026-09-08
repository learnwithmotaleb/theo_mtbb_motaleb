
import { useT } from '@/i18n';
import { LocationPinIcon } from '@/assets/icons/cleaner_icon/LocationPinIcon';

import { CalenderIcon } from '@/assets/icons/cleaner_icon/CalenderIcon';
import { IdentificationIcon } from '@/assets/icons/cleaner_icon/IdentificationIcon';
import { IndecatorIcon } from '@/assets/icons/cleaner_icon/IndecatorIcon';
import { VerifyIcon } from '@/assets/icons/cleaner_icon/VerifyIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Body3, Body4, Body6, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function FinalReviewScreen() {
    const t = useT();
    const router = useRouter();
    const draft = useAppSelector((state) => state.cleanerOnboarding);
    const [isLoading] = useState(false);

    const AVAILABILITY_LABEL: Record<string, string> = {
        full_time: 'Full-time Ready',
        part_time: 'Part-time',
        flexible: 'Flexible',
    };

    const handleContinue = () => {
        router.push('/cleaner/onboarding/setup_profile');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Gestlio" />

            <View style={{ marginVertical: hp(30) }}>
                <StepIndicator
                    totalSteps={5}
                    currentStep={4}
                    activeColor={Colors.COLOR_ACTIVE}
                />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <H1 color={"#4B4B4B"} style={styles.title}>
                    {t("Final Review")}
                </H1>
                <Caption3 color={Colors.SECONDARY_TEXT} style={styles.subtitle}>
                    {t("Please confirm your profile details before completing the registration.")}
                </Caption3>

                {/* Professional Status card */}
                <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                        <VerifyIcon  size={20}/>
                    </View>
                    <View style={styles.infoText}>
                        <Body2 color={Colors.SECONDARY_TEXT}>{t("Professional Status")}</Body2>
                        <Body6 color={Colors.TEXT_COLOR}>{t("Verified professional")}</Body6>
                    </View>
                    <View style={styles.verifiedBadge}>
                        <IndecatorIcon />
                    </View>
                </View>

                {/* Work Location card */}
                <View style={styles.locationCard}>
                    <View style={styles.locationCardHeader}>
                        <Body4 color={"#4B4B4B"}>{t("Work Location")}</Body4>
                        <Pressable onPress={() => router.push('/cleaner/onboarding/work-location' as any)}>
                            <Body4 color={Colors.COLOR_ACTIVE}>{t("Modify")}</Body4>
                        </Pressable>
                    </View>
                    <Body2 color={"#4B4B4B"} style={styles.cityText}>
                        {draft.workCity || t("Not set yet")}
                    </Body2>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.bioText}>
                        {draft.biography ||
                            t("You can add a short biography on the next step.")}
                    </Caption3>
                    <View style={styles.serviceAreaRow}>
                        <View style={styles.serviceAreaIcon}>
                            <LocationPinIcon size={14} color={Colors.COLOR_ACTIVE} />
                        </View>
                        <View>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Service area")}</Caption3>
                            <Caption3 color={Colors.TEXT_COLOR}>
                                {draft.serviceRadius}km radius around{' '}
                                {draft.workCity || 'your city'}
                            </Caption3>
                        </View>
                    </View>
                </View>

                {/* Identification card */}
                <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                       <IdentificationIcon/>
                    </View>
                    <View style={styles.infoText}>
                        <Body6 color={"#4B4B4B"}>{t("Identification")}</Body6>
                        <Body3 color={Colors.TEXT_COLOR}>
                            {t("SIRET {value}", { value: draft.siretNumber || t("not provided") })}
                        </Body3>
                    </View>
                </View>

                {/* Availability card */}
                <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                      <CalenderIcon/>
                    </View>
                    <View style={styles.infoText}>
                        <Body6 color={Colors.PRIMARY_TEXT}>{t("Availability")}</Body6>
                        <Body3 color={Colors.TEXT_COLOR}>
                            {AVAILABILITY_LABEL[draft.availability]}
                        </Body3>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title={t("Continue")}
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
    scroll: {
        // paddingHorizontal: wp(20),
        paddingBottom: hp(20)
    },
    title: { marginBottom: hp(6) },
    subtitle: { marginBottom: hp(20) },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(24),
        gap: wp(12),
    },
    iconBox: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: '#E8F9EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    infoText: {
        flex: 1,
        gap: hp(2)
    },
    verifiedBadge: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    locationCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(12),
        gap: hp(4),
    },
    locationCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(4),
    },
    cityText: { marginBottom: hp(2) },
    bioText: { marginBottom: hp(8) },
    serviceAreaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
    },
    serviceAreaIcon: {
        width: wp(24),
        height: wp(24),
        borderRadius: wp(12),
        backgroundColor: '#E8F9EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});