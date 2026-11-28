import { useT } from '@/i18n';
import { CityField } from '@/components/host/housing/CityField';
import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { FormField } from '@/components/host/housing/FormField';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Caption3 } from '@/components/typo/Typography';
import { ACCOMMODATION_TYPES, type AccommodationType } from '@/constants/accommodation';
import { Colors } from '@/constants/theme';
import { useFieldErrors, type FieldErrors } from '@/hooks/useFieldErrors';
import { checkPostalCode, POSTAL_CODE_PATTERN } from '@/lib/frenchGeo';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateDraft } from '@/redux/slices/accommodationDraftSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Field = 'name' | 'type' | 'address' | 'city' | 'zip';
// Top-to-bottom order, so Continue points at the first problem on screen.
const FIELD_ORDER: Field[] = ['name', 'type', 'address', 'city', 'zip'];

export default function GeneralInformationScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    // Local while typing; committed to the wizard draft on Continue.
    const [form, setForm] = useState({
        name: draft.name,
        type: draft.accommodationType,
        address: draft.address,
        city: draft.city,
        zip: draft.zipCode,
        // Known once the city is picked from the suggestions.
        cityCodes: draft.cityPostalCodes,
    });
    const [checking, setChecking] = useState(false);
    const { errors, clear, report, remember, scrollRef } = useFieldErrors(FIELD_ORDER);

    // Instant feedback when the city's codes are already known.
    const zip = form.zip.trim();
    const zipError =
        zip.length === 5 && form.cityCodes.length > 0 && !form.cityCodes.includes(zip)
            ? t('This postal code does not match {city}.', { city: form.city })
            : '';

    const handleCityChange = (city: string, commune: { postalCodes: string[] } | null) => {
        setForm((prev) => {
            const codes = commune?.postalCodes ?? [];
            // A city with a single postal code fills it in. One with several
            // (Lyon has nine) keeps the host's code only if it belongs there.
            let nextZip = prev.zip;
            if (codes.length === 1) nextZip = codes[0];
            else if (codes.length > 1 && !codes.includes(prev.zip)) nextZip = '';
            return { ...prev, city, cityCodes: codes, zip: nextZip };
        });
        clear('city', 'zip');
    };

    const handleContinue = async () => {
        if (checking) return;
        // Every missing field is marked at once, not one per tap.
        const found: FieldErrors<Field> = {};
        if (form.name.trim().length < 2) found.name = t("Enter an accommodation name.");
        if (!form.type) found.type = t("Choose the type of accommodation.");
        if (form.address.trim().length < 5) found.address = t("Enter a full address.");
        if (!form.city.trim()) found.city = t("Enter a city.");
        if (!POSTAL_CODE_PATTERN.test(zip)) found.zip = t("Enter a valid 5-digit postal code.");
        if (!report(found)) return;

        // The postal code must belong to the city.
        setChecking(true);
        const result = await checkPostalCode(form.city, zip, form.cityCodes);
        setChecking(false);
        if (result === 'mismatch') {
            report({ zip: t('This postal code does not match {city}.', { city: form.city.trim() }) });
            return;
        }
        if (result === 'unknown_postal_code') {
            report({ zip: t("This postal code does not exist.") });
            return;
        }
        // 'unavailable': the geo service could not be reached. The format is
        // valid, so the host is not blocked by a third-party outage.

        dispatch(
            updateDraft({
                name: form.name.trim(),
                // The backend only accepts House | Apartment | Studio | Other.
                accommodationType: form.type,
                address: form.address.trim(),
                city: form.city.trim(),
                zipCode: zip,
                cityPostalCodes: form.cityCodes,
            }),
        );
        router.push('/host/housing/accommodation_details' as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
          <View style={{paddingHorizontal: wp(20),}}>
              <SectionTitle title={t("General information")} />
          </View>
            <View style={{ marginTop: hp(30),marginBottom:hp(10) }}>
                <StepIndicator totalSteps={5} currentStep={1} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Body2
                    color={Colors.TEXT_COLOR}
                    style={styles.title}
                >
                    {t("General information")}
                </Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Start with the basic information of your accommodation.")}
                </Caption3>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.legend}>
                    <Caption3 color={Colors.COLOR_DANGER}>✱ </Caption3>
                    {t("Required field")}
                </Caption3>

                <FormField
                    label={t("Accommodation name")}
                    placeholder={t("e.g. Apartment in the city centre")}
                    value={form.name}
                    onChangeText={(v) => {
                        setForm({ ...form, name: v });
                        clear('name');
                    }}
                    required
                    error={errors.name}
                    onLayout={remember('name')}
                />
                <FormDropdown
                    label={t("Type of accommodation")}
                    placeholder={t("Choose a type")}
                    value={form.type}
                    options={[...ACCOMMODATION_TYPES]}
                    onChange={(v) => {
                        setForm({ ...form, type: v as AccommodationType });
                        clear('type');
                    }}
                    required
                    error={errors.type}
                    onLayout={remember('type')}
                />
                <FormField
                    label={t("Address")}
                    placeholder={t("Street number and name")}
                    value={form.address}
                    onChangeText={(v) => {
                        setForm({ ...form, address: v });
                        clear('address');
                    }}
                    textContentType="streetAddressLine1"
                    required
                    error={errors.address}
                    onLayout={remember('address')}
                />

                <CityField
                    label={t("City")}
                    value={form.city}
                    onChange={handleCityChange}
                    required
                    error={errors.city}
                    onLayout={remember('city')}
                />

                <FormField
                    label={t("Zip code")}
                    placeholder={t("5 digits")}
                    keyboardType="number-pad"
                    maxLength={5}
                    value={form.zip}
                    onChangeText={(v) => {
                        setForm({ ...form, zip: v.replace(/\D/g, '') });
                        clear('zip');
                    }}
                    textContentType="postalCode"
                    required
                    // The live city/code mismatch shows the same way as a
                    // Continue error.
                    error={errors.zip || zipError || null}
                    hint={
                        form.cityCodes.length > 1
                            ? t("Postal codes for {city}: {codes}", {
                                  city: form.city,
                                  codes: form.cityCodes.join(', '),
                              })
                            : null
                    }
                    onLayout={remember('zip')}
                />
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title={checking ? t("Checking...") : t("Continue")}
                    onPress={handleContinue}
                    disabled={checking}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    scroll: {
paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
    title: { marginBottom: hp(8),
        textAlign:"center"
    },
    subtitle: { marginBottom: hp(12), textAlign: "center" },
    legend: { marginBottom: hp(16) },
    footer: {
        // paddingVertical: hp(16),
        paddingHorizontal: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});
