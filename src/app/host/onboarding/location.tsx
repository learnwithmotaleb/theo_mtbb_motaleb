import { useT } from '@/i18n';
import { Colors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { updateDraft } from '@/redux/slices/accommodationDraftSlice';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption1, H2 } from '@/components/typo/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function LocationScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    const [address, setAddress] = useState(draft.address);
    const [city, setCity] = useState(draft.city);
    const [zipCode, setZipCode] = useState(draft.zipCode);
    const [address2, setAddress2] = useState(draft.floor);
    const [addressError, setAddressError] = useState('');

    const handleContinue = () => {
        // The backend refuses an accommodation without city and zip code, so
        // they are asked for here rather than parsed out of the address.
        if (address.trim().length < 5) {
            setAddressError('Enter the full street address');
            return;
        }
        if (!city.trim()) {
            setAddressError('City is required');
            return;
        }
        if (!zipCode.trim()) {
            setAddressError('Zip code is required');
            return;
        }
        setAddressError('');
        dispatch(
            updateDraft({
                address: address.trim(),
                city: city.trim(),
                zipCode: zipCode.trim(),
                floor: address2.trim(),
            }),
        );
        router.push('/host/onboarding/property');
    };

    return (
        <SafeAreaView style={styles.safe}>
           <SectionTitle/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("Where is your property located?")}
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Enter the full address so that the housekeepers can find you.")}
                </Body6>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Add Address")}
                </Body5>
                <View style={[styles.searchBox, addressError ? styles.inputError : null]}>
                    <SearchIcon size={20} color={Colors.TEXT_COLOR} />
                    <TextInput
                        style={styles.searchInput}
                        value={address}
                        onChangeText={(t) => {
                            setAddress(t);
                            if (t.trim()) setAddressError('');
                        }}
                        placeholder={t("add address here")}
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                    />
                </View>
                {addressError ? (
                    <Caption1 color={Colors.COLOR_DANGER} style={styles.errorText}>
                        {addressError}
                    </Caption1>
                ) : null}

                <View style={styles.addressPreview}>
                    <View style={styles.addressPreviewIcon}>
                        <SearchIcon size={18} color={Colors.COLOR_ACTIVE} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body5 color={Colors.PRIMARY_TEXT}>{t("Cleaning address")}</Body5>
                        <Caption1 color={Colors.TEXT_COLOR}>
                            {[address, zipCode, city].filter(Boolean).join(', ') ||
                                t("Your housekeeper will be given this address.")}
                        </Caption1>
                    </View>
                </View>

                <View style={styles.cityRow}>
                    <View style={{ flex: 1 }}>
                        <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                            {t("City")}
                        </Body5>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={city}
                                onChangeText={setCity}
                                placeholder="Paris"
                                placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                            />
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                            {t("Zip code")}
                        </Body5>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={zipCode}
                                onChangeText={setZipCode}
                                placeholder="75011"
                                placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Address line 2 (optional)")}
                </Body5>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={address2}
                        onChangeText={setAddress2}
                        placeholder={t("Floor, building, door code...")}
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    // onPress={handleContinue}
                    onPress={handleContinue}
                    title={t("Continue")}
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
    cityRow: { flexDirection: 'row', gap: wp(12) },
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    backBtn: {
        marginTop: hp(12),
        marginLeft: wp(20),
        width: wp(32),
    },
    scroll: {
        
        paddingBottom: hp(20),
    },
    title: {
        marginVertical: hp(10),
    },
    subtitle: {
        paddingHorizontal: wp(10),
        marginBottom: hp(28),
    },
    label: {
        marginBottom: hp(8),
    },
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
        fontSize: wp(15),
    },
    inputError: {
        borderColor: Colors.COLOR_DANGER,
    },
    errorText: {
        marginBottom: hp(10),
    },
    addressPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(16),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        padding: wp(16),
        marginBottom: hp(20),
        marginTop: hp(10),
    },
    addressPreviewIcon: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: '#E8F9EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        marginBottom: hp(4),
    },
    input: {
        height: hp(54),
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(15),
    },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});