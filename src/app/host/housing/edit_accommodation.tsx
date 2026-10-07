import { SkeletonDetail } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { CityField } from '@/components/host/housing/CityField';
import { FormDropdown } from '@/components/host/housing/FormDropdown';
import {
    ACCOMMODATION_TYPES,
    hasFloorAndElevator,
    KEY_OPTIONS,
    ROOM_OPTIONS,
    roomsToLabel,
    roomsToNumber,
} from '@/constants/accommodation';
import { checkPostalCode, POSTAL_CODE_PATTERN } from '@/lib/frenchGeo';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Caption3, Caption4 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { accommodationPhoto } from '@/lib/mappers';
import {
    buildAccommodationForm,
    PickedPhoto,
    useGetAccommodationByIdQuery,
    useUpdateAccommodationMutation,
} from '@/redux/services/accommodationApi';
import { AppImage } from '@/components/shared/AppImage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function FieldGroup({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <View style={editStyles.fieldGroup}>
            <Caption3 color={Colors.PRIMARY_TEXT} style={editStyles.label}>
                {label}
            </Caption3>
            {children}
        </View>
    );
}

function InputBox({ placeholder, value, onChangeText, keyboardType, multiline, style }: any) {
    return (
        <View style={[editStyles.inputBox, multiline && { alignItems: 'flex-start' }]}>
            <TextInput
                style={[editStyles.input, { flex: 1 }, style]}
                placeholder={placeholder}
                placeholderTextColor={Colors.TEXT_COLOR}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
            />
        </View>
    );
}

export default function EditAccommodationScreen() {
    const t = useT();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data: accommodation, isLoading } = useGetAccommodationByIdQuery(id, {
        skip: !id,
    });
    const [updateAccommodation, { isLoading: isSaving }] =
        useUpdateAccommodationMutation();

    const [elevator, setElevator] = useState<'yes' | 'no'>('no');
    // Postal codes of a city picked from the suggestions (empty when typed).
    const [cityCodes, setCityCodes] = useState<string[]>([]);
    const [checking, setChecking] = useState(false);
    // Only set when the host picks a new picture — otherwise the existing
    // photos are left untouched.
    const [newPhoto, setNewPhoto] = useState<PickedPhoto | null>(null);
    const [form, setForm] = useState({
        name: '',
        type: '',
        address: '',
        city: '',
        zip: '',
        rooms: '',
        surface: '',
        floor: '',
        rate: '',
        notes: '',
        keys: '',
        accessCode: '',
        instructions: '',
        frequency: '',
    });
    const askFloor = hasFloorAndElevator(form.type);

    // Fill the form once the accommodation arrives.
    useEffect(() => {
        if (!accommodation) return;
        setElevator(accommodation.hasElevator ? 'yes' : 'no');
        setForm({
            name: accommodation.name ?? '',
            type: accommodation.accommodationType ?? '',
            address: accommodation.address ?? '',
            city: accommodation.city ?? '',
            zip: accommodation.zipCode ?? '',
            rooms: roomsToLabel(accommodation.numberOfRooms),
            surface: accommodation.surface ? String(accommodation.surface) : '',
            floor: accommodation.floor ?? '',
            rate:
                accommodation.cleaningRate !== undefined
                    ? String(accommodation.cleaningRate)
                    : '',
            notes: accommodation.notes ?? '',
            keys: accommodation.keys ?? '',
            accessCode: accommodation.accessCode ?? '',
            instructions: accommodation.instructions ?? '',
            frequency: accommodation.frequency ?? '',
        });
    }, [accommodation]);

    const handlePickPhoto = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            showToast(t("Photo permission is needed to change the picture."), 'error');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (result.canceled || !result.assets?.length) return;
        const asset = result.assets[0];
        setNewPhoto({
            uri: asset.uri,
            name: asset.fileName ?? undefined,
            type: asset.mimeType ?? undefined,
        });
    };

    const handleSave = async () => {
        if (!id || isSaving || checking) return;
        if (form.name.trim().length < 2 || form.address.trim().length < 5) {
            showToast(t("Name and address are required."), 'error');
            return;
        }
        if (!form.city.trim()) {
            showToast(t("Enter a city."), 'error');
            return;
        }
        const zip = form.zip.trim();
        if (!POSTAL_CODE_PATTERN.test(zip)) {
            showToast(t("Enter a valid 5-digit postal code."), 'error');
            return;
        }
        setChecking(true);
        const postal = await checkPostalCode(form.city, zip, cityCodes);
        setChecking(false);
        if (postal === 'mismatch') {
            showToast(t('This postal code does not match {city}.', { city: form.city.trim() }), 'error');
            return;
        }
        if (postal === 'unknown_postal_code') {
            showToast(t("This postal code does not exist."), 'error');
            return;
        }
        // The rate may still carry the currency symbol from the old copy.
        const rate = form.rate.replace(/[^\d.,]/g, '').replace(',', '.');

        const body = buildAccommodationForm(
            {
                name: form.name.trim(),
                accommodationType: form.type,
                address: form.address.trim(),
                city: form.city.trim(),
                zipCode: form.zip.trim(),
                numberOfRooms: roomsToNumber(form.rooms),
                surface: form.surface,
                // A house has no floor or elevator.
                floor: askFloor ? form.floor.trim() : '',
                hasElevator: askFloor ? elevator === 'yes' : false,
                cleaningRate: rate,
                notes: form.notes.trim(),
                keys: form.keys,
                accessCode: form.accessCode.trim(),
                instructions: form.instructions.trim(),
                frequency: form.frequency,
            },
            newPhoto ? [newPhoto] : [],
        );

        try {
            await updateAccommodation({ id, body }).unwrap();
            showToast(t("Accommodation updated!"), 'success');
            router.back();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not save the changes.")), 'error');
        }
    };

    if (isLoading && !accommodation) {
        return (
            <SafeAreaView style={[editStyles.safe, { paddingTop: hp(16) }]}>
                <SkeletonDetail />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={editStyles.safe}>
            <SectionTitle title={t("Edit Accommodation")} />
            <ScrollView
                contentContainerStyle={editStyles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Photo edit */}
                <Pressable style={editStyles.photoBox} onPress={handlePickPhoto}>
                    <AppImage
                        source={
                            newPhoto
                                ? { uri: newPhoto.uri }
                                : accommodationPhoto(accommodation)
                        }
                        style={editStyles.photo}
                        contentFit="cover"
                    />
                    <View style={editStyles.photoOverlay}>
                        <Caption3 color="#000000">{t("Edit Photo")}</Caption3>
                    </View>
                </Pressable>

                {/* Name */}
                <FieldGroup label={t("Accommodation name")}>
                    <InputBox
                        placeholder={t("e.g. Apartment in the city centre")}
                        value={form.name}
                        onChangeText={(v: string) => setForm({ ...form, name: v })}
                    />
                </FieldGroup>

                {/* Type */}
                <FormDropdown
                    label={t("Type of accommodation")}
                    placeholder={t("Choose a type")}
                    value={form.type}
                    options={[...ACCOMMODATION_TYPES]}
                    onChange={(v) => setForm({ ...form, type: v })}
                />

                {/* Address */}
                <FieldGroup label={t("Address")}>
                    <InputBox
                        placeholder={t("Street number and name")}
                        value={form.address}
                        onChangeText={(v: string) => setForm({ ...form, address: v })}
                    />
                </FieldGroup>

                {/* City — any French city, checked against the postal code */}
                <CityField
                    label={t("City")}
                    value={form.city}
                    onChange={(city, commune) => {
                        const codes = commune?.postalCodes ?? [];
                        setCityCodes(codes);
                        setForm((prev) => ({
                            ...prev,
                            city,
                            zip: codes.length === 1 ? codes[0] : prev.zip,
                        }));
                    }}
                />

                {/* Zip */}
                <FieldGroup label={t("Zip code")}>
                    <InputBox
                        placeholder={t("5 digits")}
                        value={form.zip}
                        keyboardType="number-pad"
                        onChangeText={(v: string) =>
                            setForm({ ...form, zip: v.replace(/\D/g, '').slice(0, 5) })
                        }
                    />
                </FieldGroup>

                {/* Rooms */}
                <FormDropdown
                    label={t("Number of rooms")}
                    placeholder={t("Choose")}
                    value={form.rooms}
                    options={[...ROOM_OPTIONS]}
                    onChange={(v) => setForm({ ...form, rooms: v })}
                />

                {/* Surface */}
                <FieldGroup label={t("Surface (m²)")}>
                    <InputBox
                        placeholder={t("Surface in m²")}
                        value={form.surface}
                        keyboardType="number-pad"
                        onChangeText={(v: string) => setForm({ ...form, surface: v })}
                    />
                </FieldGroup>

                {askFloor && (
                <>
                {/* Floor */}
                <FieldGroup label={t("Floor")}>
                    <InputBox
                        placeholder={t("e.g. 3")}
                        value={form.floor}
                        onChangeText={(v: string) => setForm({ ...form, floor: v })}
                    />
                </FieldGroup>

                {/* Elevator */}
                <View style={editStyles.fieldGroup}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={editStyles.label}>
                        {t("Is there an elevator?")}
                    </Caption3>
                    <View style={editStyles.toggleRow}>
                        {(['yes', 'no'] as const).map((opt) => (
                            <Pressable
                                key={opt}
                                style={[
                                    editStyles.toggleBtn,
                                    elevator === opt && editStyles.toggleActive,
                                ]}
                                onPress={() => setElevator(opt)}
                            >
                                <Caption3
                                    color={elevator === opt ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR}
                                >
                                    {opt === 'yes' ? t('Yes') : t('No')}
                                </Caption3>
                            </Pressable>
                        ))}
                    </View>
                </View>
                </>
                )}

                {/* Cleaning rate */}
                <FieldGroup label={t("Cleaning rate")}>
                    <InputBox
                        placeholder={t("Amount")}
                        value={form.rate}
                        keyboardType="decimal-pad"
                        onChangeText={(v: string) => setForm({ ...form, rate: v })}
                    />
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4), fontStyle: 'italic' }}>
                        {t("Amount that you pay for each cleaning.")}
                    </Caption4>
                </FieldGroup>

                {/* Notes */}
                <FieldGroup label={t("Notes (optional)")}>
                    <InputBox
                        placeholder={t("Ex: Bright, quiet apartment...")}
                        value={form.notes}
                        multiline
                        style={{ minHeight: hp(100) }}
                        onChangeText={(v: string) => setForm({ ...form, notes: v })}
                    />
                </FieldGroup>

                {/* Keys */}
                <FormDropdown
                    label={t("Where are the keys?")}
                    placeholder={t("Choose")}
                    value={form.keys}
                    options={[...KEY_OPTIONS]}
                    onChange={(v) => setForm({ ...form, keys: v })}
                />

                {/* Access code */}
                <FieldGroup label={t("Access code (optional)")}>
                    <InputBox
                        placeholder={t("Ex: 1234 or Gate digital code")}
                        value={form.accessCode}
                        onChangeText={(v: string) => setForm({ ...form, accessCode: v })}
                    />
                </FieldGroup>

                {/* Instructions */}
                <FieldGroup label={t("Specific instructions (optional)")}>
                    <InputBox
                        placeholder={t("Please close the windows after cleaning.")}
                        value={form.instructions}
                        multiline
                        style={{ minHeight: hp(120) }}
                        onChangeText={(v: string) => setForm({ ...form, instructions: v })}
                    />
                </FieldGroup>

                {/* Frequency */}
                <FormDropdown
                    label={t("Usual frequency")}
                    placeholder={t("Choose (optional)")}
                    value={form.frequency}
                    options={['Every day', 'Every week', 'Every 2 weeks', 'Every month', 'On demand']}
                    onChange={(v) => setForm({ ...form, frequency: v })}
                />
            </ScrollView>

            {/* Save button */}
            <View style={editStyles.footer}>
                <CustomButton
                    title={isSaving || checking ? t('Saving...') : t('Save')}
                    disabled={isSaving || checking}
                    onPress={handleSave}
                    width="100%"
                    backgroundColor={Colors.BRAND_PRIMARY}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
            </View>
        </SafeAreaView>
    );
}

const editStyles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)
    },
    scroll: {
        paddingTop: hp(20),
        paddingBottom: hp(10)
    },
    photoBox: {
        width: '100%',
        height: hp(160),
        borderRadius: wp(14),
        overflow: 'hidden',
        marginBottom: hp(20),
    },
    photo: { width: '100%', height: '100%' },
    photoOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#ffffff80',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldGroup: { marginBottom: hp(16) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
        flexDirection: 'row',
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
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
    toggleActive: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderColor: Colors.PRIMARY_TEXT,
    },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
        // borderTopWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
    },
});