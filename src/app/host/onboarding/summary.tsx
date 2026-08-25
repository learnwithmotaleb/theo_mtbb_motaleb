import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, Caption1, H2 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

const SUMMARY_DATA = [
    { label: 'Property name', value: 'Appartement Paris 11', route: '/host/onboarding/accommodation' },
    { label: 'Address', value: '11 Rue de la Paix, 75011 Paris', route: '/host/onboarding/location' },
    { label: 'Type', value: 'Apartment', route: '/host/onboarding/property' },
    { label: 'Bedrooms / Bathrooms', value: '2 bedrooms / 1 bathroom', route: '/host/onboarding/property' },
    { label: 'Time slot', value: 'Between 10:00 AM and 4:00 PM', route: '/host/onboarding/cleaning-time' },
    { label: 'Average duration', value: '2h30', route: '/host/onboarding/cleaning-duration' },
    { label: 'Proposed rate', value: '80 € / cleaning', route: '/host/onboarding/cleaning-duration' },
];

function SummaryRow({
    label,
    value,
    onEdit,
}: {
    label: string;
    value: string;
    onEdit: () => void;
}) {
    return (
        <View style={styles.rowBlock}>
            <Body5 color={Colors.TEXT_COLOR} style={styles.rowLabel}>
                {label}
            </Body5>
            <View style={styles.rowCard}>
                <Caption1 color={Colors.PLACEHOLDER_TEXT} style={styles.rowValue}>
                    {value}
                </Caption1>
                <Pressable
                    onPress={onEdit}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Body6 color={Colors.STATUS_COLOR}>Edit</Body6>
                </Pressable>
            </View>
        </View>
    );
}

export default function SummaryScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            router.push('/host/onboarding/congratulations');
        }, 800);
    };

    return (
        <SafeAreaView style={styles.safe}>
           
<SectionTitle/>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    Summary
                </H2>
                <Body6 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Verify your property information before continuing.
                </Body6>

                {SUMMARY_DATA.map((item) => (
                    <SummaryRow
                        key={item.label}
                        label={item.label}
                        value={item.value}
                        onEdit={() => router.push(item.route as any)}
                    />
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    // onPress={handleConfirm}
                    onPress={() => router.push('/host/onboarding/congratulations')}
                    title="Confirm and continue"
                    backgroundColor={Colors.BG_BLACK}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                    isLoading={isLoading}
                    disabled={isLoading}
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
        marginVertical: hp(12),
    },
    subtitle: {
        marginBottom: hp(20),
    },
    rowBlock: {
        marginBottom: hp(14),
    },
    rowLabel: {
        marginBottom: hp(6),
    },
    rowCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        paddingVertical: hp(16),
    },
    rowValue: {
        flex: 1,
        marginRight: wp(12),
    },
    footer: {
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});