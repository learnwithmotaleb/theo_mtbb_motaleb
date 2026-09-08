import { useT } from '@/i18n';
import { LocationPinIcon } from '@/assets/icons/cleaner_icon/LocationPinIcon';
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body5, Caption1, Caption2, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateOnboarding } from '@/redux/slices/cleanerOnboardingSlice';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fp, hp, wp } from '../../../../utils/responsiveDevice';

export default function WorkLocationScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.cleanerOnboarding);
    const [city, setCity] = useState(draft.workCity);
    const [cityError, setCityError] = useState('');
    const [radius, setRadius] = useState(draft.serviceRadius);
    const [isLoading] = useState(false);

    const handleContinue = () => {
        if (!city.trim()) {
            setCityError('City is required');
            return;
        }
        setCityError('');
        dispatch(updateOnboarding({ workCity: city.trim(), serviceRadius: radius }));
        router.push('/cleaner/onboarding/final-review');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Gestlio" />

            <View style={{ marginVertical: hp(30) }}>
                <StepIndicator
                    totalSteps={5}
                    currentStep={3}
                    activeColor={Colors.COLOR_ACTIVE}
                />
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >


                <H1 color="#4B4B4B" style={styles.title}>
                    {t("Where do you work?")}
                </H1>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Indicate your main city and the radius within which you want to receive missions.")}
                </Caption3>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Your city")}
                </Body5>
                <View style={[styles.searchBox, cityError ? styles.inputError : null]}>
                    <SearchIcon size={20} color={Colors.TEXT_COLOR} />
                    <TextInput
                        style={styles.searchInput}
                        value={city}
                        onChangeText={(t) => {
                            setCity(t);
                            if (t.trim()) setCityError('');
                        }}
                        placeholder={t("e.g. London, Manchester, Birmingham...")}
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                    />
                </View>
                {cityError ? (
                    <Caption1 color={Colors.COLOR_DANGER} style={styles.errorText}>
                        {cityError}
                    </Caption1>
                ) : null}

                <View style={styles.radiusCard}>
                    <View style={styles.radiusHeader}>
                        <Body5 color={Colors.TEXT_COLOR}>{t("Service radius")}</Body5>
                        <View style={styles.radiusBadge}>
                            <Caption2 color={Colors.COLOR_ACTIVE}>{radius} Km</Caption2>
                        </View>
                    </View>
                    <Slider
                        style={styles.slider}
                        minimumValue={5}
                        maximumValue={30}
                        step={5}
                        value={radius}
                        onValueChange={(v) => setRadius(Math.round(v))}
                        minimumTrackTintColor={Colors.COLOR_ACTIVE}
                        maximumTrackTintColor={Colors.BORDER_COLOR}
                        thumbTintColor={Colors.COLOR_ACTIVE}
                    />
                    <View style={styles.sliderLabels}>
                        {['5 KM', '10 KM', '20 KM', '30 KM'].map((l) => (
                            <Caption3 key={l} 
                            color={Colors.TEXT_COLOR}>
                                {l}
                            </Caption3>
                        ))}
                    </View>
                </View>

                <View style={styles.serviceAreaBadge}>
                    <View style={styles.serviceAreaIcon}>
                        <LocationPinIcon size={20} color={Colors.COLOR_ACTIVE} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body5 color={Colors.PRIMARY_TEXT}>{t("Service area")}</Body5>
                        <Caption3 color={Colors.TEXT_COLOR}>
                            {city.trim()
                                ? t("{radius}km radius around {city}", { radius, city: city.trim() })
                                : t("{radius}km radius — enter your city above", { radius })}
                        </Caption3>
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
        //  paddingHorizontal: wp(20),
        paddingBottom: hp(20)
    },
    title: { marginBottom: hp(8) },
    subtitle: { marginBottom: hp(28) },
    label: { marginBottom: hp(8) },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        gap: wp(10),
        marginBottom: hp(4),
    },
    searchInput: {
        flex: 1,
        height: hp(54),
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: fp(14),
    },
    inputError: { borderColor: Colors.COLOR_DANGER },
    errorText: { marginBottom: hp(10) },
    radiusCard: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(16),
        marginTop: hp(10),
    },
    radiusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(12),
    },
    radiusBadge: {
        backgroundColor: '#E8F9EF',
        borderRadius: wp(20),
        paddingHorizontal: wp(12),
        paddingVertical: hp(4),
    },
    slider: { width: '100%', height: hp(36) },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(4),
    },
    serviceAreaBadge: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        marginBottom: hp(4),
    },
    serviceAreaIcon: {
        width: wp(32),
        height: wp(32),
        borderRadius: wp(16),
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