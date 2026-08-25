// components/shared/LanguageScreen.tsx
import { EarthIcon } from '@/assets/icons/common_icon/EarthIcon';
import { Body3, Caption3, H3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import SectionTitle from '../shared/SectionTitle';

const LANGUAGES = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'French', flag: '🇫🇷' },
];

export function LanguageScreen() {
    const router = useRouter();
    const [selected, setSelected] = useState('en');

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Language" />

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.iconCircle}>
                    <EarthIcon />
                </View>

                <H3 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    Choose your language
                </H3>
                <Caption3 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Select the language you want to use in the application.
                </Caption3>

                <View style={styles.optionList}>
                    {LANGUAGES.map((lang, idx) => (
                        <React.Fragment key={lang.code}>
                            <Pressable
                                style={styles.optionRow}
                                onPress={() => setSelected(lang.code)}
                            >
                                <Text style={styles.flag}>{lang.flag}</Text>
                                <Body3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                                    {lang.label}
                                </Body3>
                                <View style={[styles.radio, selected === lang.code && styles.radioSelected]}>
                                    {selected === lang.code && <View style={styles.radioDot} />}
                                </View>
                            </Pressable>
                            {idx < LANGUAGES.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    header: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(14),
    },
    headerTitle: { fontFamily: 'Poppins_600SemiBold' },
    scroll: {
        paddingBottom: hp(32)
    },
    iconCircle: {
        alignSelf: 'center',
        width: wp(80), height: wp(80), borderRadius: wp(40),
        backgroundColor: "#0088FF1A",
        borderWidth:1,
        borderColor:"#0088FF33",
        alignItems: 'center', justifyContent: 'center',
        marginBottom: hp(16), marginTop: hp(8),
    },

    title: { marginBottom: hp(6) },
    subtitle: { marginBottom: hp(28), paddingHorizontal: wp(10) },
    optionList: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        //  borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        //  overflow: 'hidden',
    },
    optionRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: wp(16), paddingVertical: hp(18), gap: wp(12),
    },
    flag: { fontSize: wp(24) },
    radio: {
        width: wp(22), height: wp(22), borderRadius: wp(11),
        borderWidth: 2, borderColor: Colors.BORDER_COLOR,
        alignItems: 'center', justifyContent: 'center',
    },
    radioSelected: { borderColor: Colors.BRAND_PRIMARY },
    radioDot: {
        width: wp(11), height: wp(11),
        borderRadius: wp(6), backgroundColor: Colors.BRAND_PRIMARY,
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR, marginHorizontal: wp(16) },
});