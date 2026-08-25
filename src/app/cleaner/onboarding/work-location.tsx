import { LocationPinIcon } from '@/assets/icons/cleaner_icon/LocationPinIcon';
import { SearchIcon } from '@/assets/icons/common_icon/SearchIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body5, Caption1, Caption2, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fp, hp, wp } from '../../../../utils/responsiveDevice';

const DEFAULT_REGION = {
    latitude: 51.5074,
    longitude: -0.1278,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
};

const kmToMetres = (km: number) => km * 1000;

export default function WorkLocationScreen() {
    const router = useRouter();
    const [city, setCity] = useState('');
    const [cityError, setCityError] = useState('');
    const [radius, setRadius] = useState(15);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = async () => {
        if (!city.trim()) {
            setCityError('City is required');
            return;
        }
        setCityError('');
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setIsLoading(false);
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
                    Where do you work?
                </H1>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Indicate your main city and the radius within which you want to
                    receive missions.
                </Caption3>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    Your city
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
                        placeholder="e.g. London, Manchester, Birmingham..."
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
                        <Body5 color={Colors.TEXT_COLOR}>Service radius</Body5>
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

                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={DEFAULT_REGION}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    >
                        <Marker coordinate={{ latitude: 51.5074, longitude: -0.1278 }} />
                        <Circle
                            center={{ latitude: 51.5074, longitude: -0.1278 }}
                            radius={kmToMetres(radius)}
                            fillColor="rgba(26, 63, 143, 0.15)"
                            strokeColor="rgba(26, 63, 143, 0.35)"
                            strokeWidth={1.5}
                        />
                    </MapView>
                    <View style={styles.serviceAreaBadge}>
                        <View style={styles.serviceAreaIcon}>
                            <LocationPinIcon size={20} color={Colors.COLOR_ACTIVE} />
                        </View>
                        <View>
                            <Body5 color={Colors.PRIMARY_TEXT}>Service area</Body5>
                            <Caption3 color={Colors.TEXT_COLOR}>
                                {radius}km radius around {city || 'London'}
                            </Caption3>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    isLoading={isLoading}
                    disabled={isLoading}
                    // onPress={handleContinue}
                    onPress={() => router.push('/cleaner/onboarding/final-review')}
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
    mapContainer: {
        borderRadius: wp(16),
        overflow: 'hidden',
        height: hp(220),
        marginBottom: hp(4),
    },
    map: { flex: 1 },
    serviceAreaBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.INPUT_BACKGROUND,
        padding: wp(14),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
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