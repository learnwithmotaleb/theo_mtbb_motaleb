import { useT } from '@/i18n';
import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import {
    ACCESS_CODE_MAX_LENGTH,
    arrivalOptionsAfter,
    DEPARTURE_TIME_OPTIONS,
    KEY_OPTIONS,
    usesKeyBox,
} from '@/constants/accommodation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateDraft } from '@/redux/slices/accommodationDraftSlice';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const FREQUENCY_OPTIONS = [
    'Every day',
    'Every week',
    'Every 2 weeks',
    'Every month',
    'On demand',
];

type Field = 'keys' | 'checkOutTime' | 'checkInTime';
// Top-to-bottom order, so Continue scrolls to the first problem.
const FIELD_ORDER: Field[] = ['keys', 'checkOutTime', 'checkInTime'];

export default function PracticalInformationScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);
    const scrollRef = useRef<ScrollView>(null);
    const fieldY = useRef<Partial<Record<Field, number>>>({});

    const [form, setForm] = useState({
        keys: draft.keys,
        accessCode: draft.accessCode,
        instructions: draft.instructions,
        frequency: draft.frequency,
        // Required by the backend, and what the cleaning recommendations use
        // to pre-fill a turnover slot when the iCal feed has no usable times.
        checkOutTime: draft.checkOutTime,
        checkInTime: draft.checkInTime,
    });
    // Shown under each field (a toast alone was easy to miss).
    const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

    const update = (patch: Partial<typeof form>) => {
        setForm((prev) => ({ ...prev, ...patch }));
        setErrors((prev) => {
            const next = { ...prev };
            (Object.keys(patch) as Field[]).forEach((key) => delete next[key]);
            return next;
        });
    };

    const changeDeparture = (checkOutTime: string) => {
        // An arrival that no longer comes after the departure is cleared
        // rather than kept invalid.
        const keepArrival = form.checkInTime && form.checkInTime > checkOutTime;
        update({ checkOutTime, ...(keepArrival ? {} : { checkInTime: '' }) });
    };

    const validate = (): Partial<Record<Field, string>> => {
        const found: Partial<Record<Field, string>> = {};
        if (!form.keys) found.keys = t("Choose where the keys are.");
        if (!form.checkOutTime) found.checkOutTime = t("Choose the guest departure time.");
        if (!form.checkInTime) {
            found.checkInTime = t("Choose the next guests' arrival time.");
        } else if (form.checkOutTime && form.checkInTime <= form.checkOutTime) {
            // "HH:mm" strings compare in clock order. The cleaning happens
            // between the guest leaving and the next guest arriving.
            found.checkInTime = t("The next guests must arrive after the departure time.");
        }
        return found;
    };

    const handleContinue = () => {
        const found = validate();
        setErrors(found);
        const first = FIELD_ORDER.find((field) => found[field]);
        if (first) {
            const y = fieldY.current[first];
            if (y !== undefined) {
                scrollRef.current?.scrollTo({ y: Math.max(0, y - hp(20)), animated: true });
            }
            return;
        }
        dispatch(
            updateDraft({
                ...form,
                accessCode: usesKeyBox(form.keys) ? form.accessCode : '',
            }),
        );
        router.push('/host/housing/accommodation_summary' as any);
    };

    const remember = (field: Field) => (event: { nativeEvent: { layout: { y: number } } }) => {
        fieldY.current[field] = event.nativeEvent.layout.y;
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={{ paddingHorizontal: wp(20), }}>
                <SectionTitle title={t("Practical information")} />
            </View>
            <View style={{
                marginTop: hp(30),
                marginBottom: hp(10)
            }}>
                <StepIndicator totalSteps={5} currentStep={4} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Body2 color={Colors.PRIMARY_TEXT} style={styles.title}>
                    {t("Practical information")}
                </Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Add useful information for the service visits.")}
                </Caption3>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.legend}>
                    <Caption3 color={Colors.COLOR_DANGER}>✱ </Caption3>
                    {t("Required field")}
                </Caption3>

                {/* Keys */}
                <FormDropdown
                    label={t("Where are the keys?")}
                    placeholder={t("Choose")}
                    value={form.keys}
                    options={[...KEY_OPTIONS]}
                    onChange={(v) => update({ keys: v })}
                    required
                    error={errors.keys}
                    onLayout={remember('keys')}
                />

                {/* Lockbox code — only meaningful with a key box */}
                {usesKeyBox(form.keys) && (
                    <View style={styles.fieldGroup}>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Key box code (optional)")}
                        </Caption3>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder={t("Ex: 1234 or Gate digital code")}
                                placeholderTextColor={Colors.TEXT_COLOR}
                                value={form.accessCode}
                                maxLength={ACCESS_CODE_MAX_LENGTH}
                                autoCapitalize="none"
                                autoCorrect={false}
                                onChangeText={(v) => update({ accessCode: v })}
                            />
                        </View>
                        <Caption3 color={Colors.TEXT_COLOR} style={styles.helper}>
                            {t("Only cleaners whose request you accept can see this code.")}
                        </Caption3>
                    </View>
                )}

                {/* Specific instructions */}
                <View style={styles.fieldGroup}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                        {t("Specific instructions (optional)")}
                    </Caption3>
                    <View style={[styles.inputBox, { alignItems: 'flex-start' }]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder={t("Please close the windows after cleaning.")}
                            placeholderTextColor={Colors.TEXT_COLOR}
                            multiline
                            value={form.instructions}
                            onChangeText={(v) => update({ instructions: v })}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Frequency */}
                <FormDropdown
                    label={t("Usual frequency")}
                    placeholder={t("Choose (optional)")}
                    value={form.frequency}
                    options={FREQUENCY_OPTIONS}
                    onChange={(v) => update({ frequency: v })}
                />

                {/* Guest check-out — when a cleaning can start */}
                <FormDropdown
                    label={t("Guest check-out time")}
                    placeholder="--:--"
                    value={form.checkOutTime}
                    options={DEPARTURE_TIME_OPTIONS}
                    getLabel={(v) => v}
                    onChange={changeDeparture}
                    required
                    error={errors.checkOutTime}
                    onLayout={remember('checkOutTime')}
                />

                {/* Next guest check-in — when a cleaning must be finished */}
                <FormDropdown
                    label={t("Next guest check-in time")}
                    placeholder="--:--"
                    value={form.checkInTime}
                    options={arrivalOptionsAfter(form.checkOutTime)}
                    getLabel={(v) => v}
                    onChange={(v) => update({ checkInTime: v })}
                    required
                    error={errors.checkInTime}
                    hint={
                        form.checkOutTime
                            ? t("Times after {time} only: the cleaning happens in between.", {
                                  time: form.checkOutTime,
                              })
                            : null
                    }
                    onLayout={remember('checkInTime')}
                />
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title={t("Continue")}
                    onPress={handleContinue}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(20) },
    title: {
        marginBottom: hp(6),
        fontFamily: 'Poppins_600SemiBold',
        textAlign: "center"
    },
    subtitle: {
        marginBottom: hp(12),
        textAlign: "center"
    },
    legend: { marginBottom: hp(16) },
    helper: { marginTop: hp(6) },
    fieldGroup: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
    },
    input: {
        fontSize: 13,
        color: Colors.TEXT_COLOR,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },
    textArea: {
        width: '100%',
        minHeight: hp(150),
    },
    footer: {
        paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});