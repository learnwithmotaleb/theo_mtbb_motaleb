import { useT } from '@/i18n';
import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import {
    hasFloorAndElevator,
    ROOM_OPTIONS,
    roomsToLabel,
    roomsToNumber,
} from '@/constants/accommodation';
import { useFieldErrors, type FieldErrors } from '@/hooks/useFieldErrors';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateDraft } from '@/redux/slices/accommodationDraftSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Field = 'rooms' | 'surface' | 'elevator' | 'rate';
// Top-to-bottom order, so Continue points at the first problem on screen.
const FIELD_ORDER: Field[] = ['rooms', 'surface', 'elevator', 'rate'];

/** Red message under a custom field, same as FormDropdown / FormField. */
function FieldError({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <Caption3 color={Colors.COLOR_DANGER} style={styles.helper}>
            {message}
        </Caption3>
    );
}

export default function AccommodationDetailsScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    // Floor and elevator are only asked for a unit inside a building.
    const askFloor = hasFloorAndElevator(draft.accommodationType);
    // Nothing pre-selected: null until the host answers.
    const [elevator, setElevator] = useState<'yes' | 'no' | null>(
        draft.hasElevator === null ? null : draft.hasElevator ? 'yes' : 'no',
    );
    const [notes, setNotes] = useState(draft.notes);
    const [form, setForm] = useState({
        rooms: roomsToLabel(draft.numberOfRooms),
        surface: draft.surface,
        floor: draft.floor,
        rate: draft.cleaningRate,
    });

    const { errors, clear, report, remember, scrollRef } = useFieldErrors(FIELD_ORDER);

    // "55,5" is how a French keyboard types a decimal.
    const rate = form.rate.replace(',', '.').trim();

    const handleContinue = () => {
        // Every missing field is marked at once, not one per tap.
        const found: FieldErrors<Field> = {};
        if (!form.rooms) found.rooms = t("Choose the number of rooms.");
        if (!(Number(form.surface) > 0)) found.surface = t("Enter the surface area.");
        if (askFloor && elevator === null) found.elevator = t("Tell us whether there is an elevator.");
        if (rate === '' || !(Number(rate) >= 0)) found.rate = t("Enter a cleaning rate.");
        if (!report(found)) return;
        dispatch(
            updateDraft({
                numberOfRooms: roomsToNumber(form.rooms),
                surface: form.surface,
                floor: askFloor ? form.floor : '',
                hasElevator: askFloor ? elevator === 'yes' : false,
                cleaningRate: rate,
                notes,
            }),
        );
        router.push('/host/housing/accommodation_photo' as any);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={{ paddingHorizontal: wp(20), }}>
                <SectionTitle title={t("Accommodation details")} />
            </View>
            <View style={{
                marginTop: hp(30),
                marginBottom: hp(10)
            }}>
                <StepIndicator totalSteps={5} currentStep={2} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Body2 color={Colors.PRIMARY_TEXT} style={styles.title}>
                        {t("Accommodation details")}
                    </Body2>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                        {t("Describe your accommodation to help organize it better.")}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.legend}>
                        <Caption3 color={Colors.COLOR_DANGER}>✱ </Caption3>
                        {t("Required field")}
                    </Caption3>

                    {/* Number of rooms */}
                    <FormDropdown
                        label={t("Number of rooms")}
                        placeholder={t("Choose")}
                        value={form.rooms}
                        options={[...ROOM_OPTIONS]}
                        onChange={(v) => {
                            setForm({ ...form, rooms: v });
                            clear('rooms');
                        }}
                        required
                        error={errors.rooms}
                        onLayout={remember('rooms')}
                    />

                    {/* Surface */}
                    <View style={styles.fieldGroup} onLayout={remember('surface')}>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Surface (m²)")}
                            <Caption3 color={Colors.COLOR_DANGER}> ✱</Caption3>
                        </Caption3>
                        <View style={[styles.inputBox, !!errors.surface && styles.inputBoxError]}>
                            <TextInput
                                style={styles.input}
                                placeholder={t("Surface in m²")}
                                placeholderTextColor={Colors.TEXT_COLOR}
                                keyboardType="number-pad"
                                value={form.surface}
                                onChangeText={(v) => {
                                    setForm({ ...form, surface: v.replace(/\D/g, '') });
                                    clear('surface');
                                }}
                            />
                            <Caption3 color={Colors.TEXT_COLOR}>m²</Caption3>
                        </View>
                        <FieldError message={errors.surface} />
                    </View>

                    {askFloor && (
                    <>
                    {/* Floor */}
                    <View style={styles.fieldGroup}>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>{t("Floor")}</Caption3>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder={t("e.g. 3")}
                                placeholderTextColor={Colors.TEXT_COLOR}
                                value={form.floor}
                                onChangeText={(v) => setForm({ ...form, floor: v })}
                            />
                        </View>
                    </View>

                    {/* Elevator */}
                    <View style={styles.fieldGroup} onLayout={remember('elevator')}>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Is there an elevator?")}
                            <Caption3 color={Colors.COLOR_DANGER}> ✱</Caption3>
                        </Caption3>
                        <View style={styles.toggleRow}>
                            {(['yes', 'no'] as const).map((opt) => (
                                <Pressable
                                    key={opt}
                                    style={[
                                        styles.toggleBtn,
                                        elevator === opt && styles.toggleActive,
                                        !!errors.elevator && styles.inputBoxError,
                                    ]}
                                    onPress={() => {
                                        setElevator(opt);
                                        clear('elevator');
                                    }}
                                >
                                    <Caption3
                                        color={
                                            elevator === opt
                                                ? Colors.PRIMARY_TEXT
                                                : Colors.TEXT_COLOR
                                        }
                                    >
                                        {opt === 'yes' ? t('Yes') : t('No')}
                                    </Caption3>
                                </Pressable>
                            ))}
                        </View>
                        <FieldError message={errors.elevator} />
                    </View>
                    </>
                    )}

                    {/* Cleaning rate */}
                    <View style={styles.fieldGroup} onLayout={remember('rate')}>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Cleaning rate")}
                            <Caption3 color={Colors.COLOR_DANGER}> ✱</Caption3>
                        </Caption3>
                        <View style={[styles.inputBox, !!errors.rate && styles.inputBoxError]}>
                            <TextInput
                                style={styles.input}
                                placeholder={t("Amount")}
                                placeholderTextColor={Colors.TEXT_COLOR}
                                keyboardType="decimal-pad"
                                value={form.rate}
                                onChangeText={(v) => {
                                    setForm({ ...form, rate: v.replace(/[^\d.,]/g, '') });
                                    clear('rate');
                                }}
                            />
                            <Caption3 color={Colors.TEXT_COLOR}>€</Caption3>
                        </View>
                        <FieldError message={errors.rate} />
                        <Caption3
                            color={Colors.TEXT_COLOR}
                            style={{ marginTop: hp(6), fontStyle: 'italic' }}
                        >
                            {t("Amount that you pay for each cleaning.")}
                        </Caption3>
                    </View>

                    {/* Notes */}
                    <View style={styles.fieldGroup}>
                        <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Notes (optional)")}
                        </Caption3>
                        <View style={[styles.inputBox, { alignItems: 'flex-start' }]}>
                            <TextInput
                                style={[styles.input, styles.notesInput]}
                                placeholder={t("Ex: Bright, quiet apartment...")}
                                placeholderTextColor={Colors.TEXT_COLOR}
                                multiline
                                maxLength={1000}
                                value={notes}
                                onChangeText={setNotes}
                                textAlignVertical="top"
                            />
                        </View>
                        <Caption3
                            color={Colors.TEXT_COLOR}
                            style={styles.charCount}
                        >
                            {notes.length}/1000
                        </Caption3>
                    </View>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), 
        // paddingBottom: hp(20)
     },
    title: { marginBottom: hp(6), fontFamily: 'Poppins_600SemiBold',textAlign:"center" },
    subtitle: { marginBottom: hp(12), textAlign: "center" },
    legend: { marginBottom: hp(16) },
    helper: { marginTop: hp(6) },
    fieldGroup: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    // Same look as FormDropdown's error state.
    inputBoxError: { borderColor: Colors.COLOR_DANGER, backgroundColor: '#FF383C0D' },
    input: {
        flex: 1,
        fontSize: 13,
        color: Colors.TEXT_COLOR,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },
    notesInput: {
        width: '100%',
        minHeight: hp(120),
        flex: undefined,
    },
    charCount: {
        textAlign: 'right',
        marginTop: hp(4),
    },
    toggleRow: {
        flexDirection: 'row',
        gap: wp(12),
    },
    toggleBtn: {
        flex: 1,
        paddingVertical: hp(14),
        alignItems: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    toggleActive: {
        backgroundColor: '#E8E8E8',
    },
    footer: {
        paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
        //  paddingBottom: hp(16),
    },
});