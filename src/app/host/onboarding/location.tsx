import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption1, H2 } from '@/components/typo/Typography';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const DEFAULT_REGION = {
    latitude: 48.8566,
    longitude: 2.3522,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
};

export default function LocationScreen() {
    const router = useRouter();
    const [address, setAddress] = useState('');
    const [address2, setAddress2] = useState('');
    const [addressError, setAddressError] = useState('');

    const handleContinue = () => {
        if (!address.trim()) {
            setAddressError('Address is required');
            return;
        }
        setAddressError('');
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
                    Where is your property located?
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Enter the full address so that the housekeepers can find you.
                </Body6>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    Add Address
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
                        placeholder="add address here"
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                    />
                </View>
                {addressError ? (
                    <Caption1 color={Colors.COLOR_DANGER} style={styles.errorText}>
                        {addressError}
                    </Caption1>
                ) : null}

                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={DEFAULT_REGION}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    >
                        <Marker coordinate={{ latitude: 48.8566, longitude: 2.3522 }} />
                        <Circle
                            center={{ latitude: 48.8566, longitude: 2.3522 }}
                            radius={2000}
                            fillColor="rgba(26, 63, 143, 0.15)"
                            strokeColor="rgba(26, 63, 143, 0.35)"
                            strokeWidth={1.5}
                        />
                    </MapView>
                </View>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    Address line 2 (optional)
                </Body5>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={address2}
                        onChangeText={setAddress2}
                        placeholder="Floor, building, door code..."
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                    />
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    // onPress={handleContinue}
                    onPress={() => router.push('/host/onboarding/property')}
                    title="Continue"
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
    mapContainer: {
        borderRadius: wp(16),
        overflow: 'hidden',
        height: hp(200),
        marginBottom: hp(20),
        marginTop: hp(4),
    },
    map: {
        flex: 1,
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