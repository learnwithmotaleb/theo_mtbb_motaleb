import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Body5, Caption2, Caption3 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const SUMMARY = {
    general: {
        name: 'Appartement T3 – City Center',
        address: '15 Rue de la Paix, 75002 Paris',
    },
    details: {
        rooms: '3 rooms (T3)',
        surface: '65 m²',
        floor: '3rd floor',
        elevator: 'With elevator',
        cleaningRate: '55,00 €',
    },
    photo: IMAGE_COMPONENTS.apartment,
    practical: {
        keys: 'Key box at the entrance',
        accessCode: '–',
        instructions: 'Please close the windows after cleaning.',
        frequency: 'Every week',
    },
};

function SummaryCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <View style={styles.summaryCard}>
            <Body2 color={Colors.TEXT_COLOR} style={styles.cardTitle}>
                {title}
            </Body2>
            {/* <View style={styles.divider} /> */}
            {children}
        </View>
    );
}

export default function AccommodationSummaryScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.safe}>
            
            <View style={{ paddingHorizontal: wp(20), }}>
                <SectionTitle title="Practical information" />
            </View>
            <View style={{ marginVertical: hp(20) }}>
                <StepIndicator totalSteps={5} currentStep={5} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <Body5
                    color={Colors.PRIMARY_TEXT}
                    align="center"
                    style={styles.title}
                >
                    Summary
                </Body5>
                <Caption3
                    color={Colors.TEXT_COLOR}
                    align="center"
                    style={styles.subtitle}
                >
                    Verify your accommodation information before finalizing.
                </Caption3>

                {/* General information */}
                <SummaryCard title="General information:">
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.general.name}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.general.address}
                    </Caption3>
                </SummaryCard>

                {/* Accommodation details */}
                <SummaryCard title="Accommodation details:">
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.rooms}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.surface}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.floor}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        {SUMMARY.details.elevator}
                    </Caption3>
                    <Caption3 color={"#1070B7"}>
                        Cleaning rate : {SUMMARY.details.cleaningRate}
                    </Caption3>
                </SummaryCard>

                {/* Photos */}
                <SummaryCard title="Photos:">
                    <Image
                        source={SUMMARY.photo}
                        style={styles.photo}
                        contentFit="cover"
                    />
                </SummaryCard>

                {/* Practical information */}
                <SummaryCard title="Practical information:">
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Keys: {SUMMARY.practical.keys}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Access code: {SUMMARY.practical.accessCode}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Instructions: {SUMMARY.practical.instructions}
                    </Caption3>
                    <Caption3 color={Colors.TEXT_COLOR} style={styles.infoText}>
                        Frequency: {SUMMARY.practical.frequency}
                    </Caption3>
                </SummaryCard>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <CustomButton
                    title="Create the accommodation"
                    onPress={() => router.replace('/host/(tabs)/housing' as any)}
                    width="100%"
                    backgroundColor={Colors.PRIMARY_TEXT}
                    color="#fff"
                    borderRadius={wp(8)}
                    height={hp(52)}
                />
                <Pressable
                    onPress={() => router.push('/host/housing/edit_accommodation' as any)}
                >
                    <Caption2 color={"#1070B7"}>Edit</Caption2>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(20) },
    title: { marginBottom: hp(4), fontFamily: 'Poppins_600SemiBold' },
    subtitle: { marginBottom: hp(20) },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: wp(16),
        marginBottom: hp(12),
    },
    cardTitle: {
        fontFamily: 'Poppins_600SemiBold',
        marginBottom: hp(10),
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: hp(10),
    },
    infoText: {
        marginBottom: hp(4),
        color: '#888',
    },
    photo: {
        width: "100%",
        height: hp(150),
        borderRadius: wp(8),
        marginTop: hp(4),
    },
    footer: {
        paddingHorizontal: wp(20),
        // paddingVertical: hp(24),
        paddingBottom:hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
        alignItems: 'center',
        gap: hp(12),
    },
});