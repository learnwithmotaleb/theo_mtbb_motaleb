import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { showToast } from '@/components/shared/Toast';
import { Caption3, Caption4 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
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
    const router = useRouter();
    const [elevator, setElevator] = useState<'yes' | 'no'>('yes');
    const [form, setForm] = useState({
        name: 'Appartement T3 – City Center',
        type: 'Apartment',
        address: '15 Rue de la Paix, 75002 Paris',
        city: 'Paris',
        zip: '75002',
        rooms: '3 rooms (T3)',
        surface: '65',
        floor: '3rd Floor',
        rate: '55,00 €',
        notes: '',
        keys: 'Key box at the entrance',
        accessCode: '',
        instructions: '',
        frequency: 'Every week',
    });

    return (
        <SafeAreaView style={editStyles.safe}>
            <SectionTitle title="Edit Accommodation" />
            <ScrollView
                contentContainerStyle={editStyles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Photo edit */}
                <Pressable style={editStyles.photoBox} onPress={() => { }}>
                    <Image
                        source={IMAGE_COMPONENTS.apartment}
                        style={editStyles.photo}
                        contentFit="cover"
                    />
                    <View style={editStyles.photoOverlay}>
                        <Caption3 color="#000000">Edit Photo</Caption3>
                    </View>
                </Pressable>

                {/* Name */}
                <FieldGroup label="Accommodation name">
                    <InputBox
                        placeholder="Appartement T3 – City Center"
                        value={form.name}
                        onChangeText={(v: string) => setForm({ ...form, name: v })}
                    />
                </FieldGroup>

                {/* Type */}
                <FormDropdown
                    label="Type of accommodation"
                    value={form.type}
                    options={['Apartment', 'House', 'Studio', 'Villa', 'Loft']}
                    onChange={(v) => setForm({ ...form, type: v })}
                />

                {/* Address */}
                <FieldGroup label="Address">
                    <InputBox
                        placeholder="15 Rue de la Paix, 75002 Paris"
                        value={form.address}
                        onChangeText={(v: string) => setForm({ ...form, address: v })}
                    />
                </FieldGroup>

                {/* City */}
                <FormDropdown
                    label="City"
                    value={form.city}
                    options={['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse']}
                    onChange={(v) => setForm({ ...form, city: v })}
                />

                {/* Zip */}
                <FieldGroup label="Zip code">
                    <InputBox
                        placeholder="75002"
                        value={form.zip}
                        keyboardType="number-pad"
                        onChangeText={(v: string) => setForm({ ...form, zip: v })}
                    />
                </FieldGroup>

                {/* Rooms */}
                <FormDropdown
                    label="Number of rooms"
                    value={form.rooms}
                    options={['1 room (T1)', '2 rooms (T2)', '3 rooms (T3)', '4 rooms (T4)', '5+ rooms']}
                    onChange={(v) => setForm({ ...form, rooms: v })}
                />

                {/* Surface */}
                <FieldGroup label="Surface (m²)">
                    <InputBox
                        placeholder="65"
                        value={form.surface}
                        keyboardType="number-pad"
                        onChangeText={(v: string) => setForm({ ...form, surface: v })}
                    />
                </FieldGroup>

                {/* Floor */}
                <FieldGroup label="Floor">
                    <InputBox
                        placeholder="3rd Floor"
                        value={form.floor}
                        onChangeText={(v: string) => setForm({ ...form, floor: v })}
                    />
                </FieldGroup>

                {/* Elevator */}
                <View style={editStyles.fieldGroup}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={editStyles.label}>
                        Is there an elevator?
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
                                    {opt === 'yes' ? 'Yes' : 'No'}
                                </Caption3>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Cleaning rate */}
                <FieldGroup label="Cleaning rate">
                    <InputBox
                        placeholder="55,00 €"
                        value={form.rate}
                        keyboardType="decimal-pad"
                        onChangeText={(v: string) => setForm({ ...form, rate: v })}
                    />
                    <Caption4 color={Colors.TEXT_COLOR} style={{ marginTop: hp(4), fontStyle: 'italic' }}>
                        Amount that you pay for each cleaning.
                    </Caption4>
                </FieldGroup>

                {/* Notes */}
                <FieldGroup label="Notes (optional)">
                    <InputBox
                        placeholder="Ex: Bright, quiet apartment..."
                        value={form.notes}
                        multiline
                        style={{ minHeight: hp(100) }}
                        onChangeText={(v: string) => setForm({ ...form, notes: v })}
                    />
                </FieldGroup>

                {/* Keys */}
                <FormDropdown
                    label="Where are the keys?"
                    value={form.keys}
                    options={['Key box at the entrance', 'With the concierge', 'Under the doormat', 'Neighbor', 'Other']}
                    onChange={(v) => setForm({ ...form, keys: v })}
                />

                {/* Access code */}
                <FieldGroup label="Access code (optional)">
                    <InputBox
                        placeholder="Ex: 1234 or Gate digital code"
                        value={form.accessCode}
                        onChangeText={(v: string) => setForm({ ...form, accessCode: v })}
                    />
                </FieldGroup>

                {/* Instructions */}
                <FieldGroup label="Specific instructions (optional)">
                    <InputBox
                        placeholder="Please close the windows after cleaning."
                        value={form.instructions}
                        multiline
                        style={{ minHeight: hp(120) }}
                        onChangeText={(v: string) => setForm({ ...form, instructions: v })}
                    />
                </FieldGroup>

                {/* Frequency */}
                <FormDropdown
                    label="Usual frequency"
                    value={form.frequency}
                    options={['Every day', 'Every week', 'Every 2 weeks', 'Every month', 'On demand']}
                    onChange={(v) => setForm({ ...form, frequency: v })}
                />
            </ScrollView>

            {/* Save button */}
            <View style={editStyles.footer}>
                <CustomButton
                    title="Save"
                    onPress={() => {
                        showToast('Accommodation updated!', 'success');
                        router.back();
                    }}
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