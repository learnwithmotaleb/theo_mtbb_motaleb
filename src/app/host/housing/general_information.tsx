import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { FormField } from '@/components/host/housing/FormField';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function GeneralInformationScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: '',
        type: 'Apartment',
        address: '',
        city: 'Paris',
        zip: '',
    });

    return (
        <SafeAreaView style={styles.safe}>
          <View style={{paddingHorizontal: wp(20),}}>
              <SectionTitle title="General information" />
          </View>
            <View style={{ marginTop: hp(30),marginBottom:hp(10) }}>
                <StepIndicator totalSteps={5} currentStep={1} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Body2
                    color={Colors.TEXT_COLOR}
                    style={styles.title}
                >
                    General information
                </Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Start with the basic information of your accommodation.
                </Caption3>

                <FormField
                    label="Accommodation name"
                    placeholder="Appartement T3 – City Center"
                    value={form.name}
                    onChangeText={(v) => setForm({ ...form, name: v })}
                />
                <FormDropdown
                    label="Type of accommodation"
                    value={form.type}
                    options={['Apartment', 'House', 'Studio', 'Villa', 'Loft']}
                    onChange={(v) => setForm({ ...form, type: v })}
                />
                <FormField
                    label="Address"
                    placeholder="15 Rue de la Paix, 75002 Paris"
                    value={form.address}
                    onChangeText={(v) => setForm({ ...form, address: v })}
                />


                <FormDropdown
                    label="City"
                    value={form.city}
                    options={['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Toulouse']}
                    onChange={(v) => setForm({ ...form, city: v })}
                />
                <FormField
                    label="Zip code"
                    placeholder="75002"
                    keyboardType="number-pad"
                    value={form.zip}
                    onChangeText={(v) => setForm({ ...form, zip: v })}
                />
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    onPress={() =>
                        router.push('/host/housing/accommodation_details' as any)
                    }
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
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
    },
    scroll: {
paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
    title: { marginBottom: hp(8),
        textAlign:"center"
    },
    subtitle: { marginBottom: hp(24),textAlign:"center" },
    footer: {
        // paddingVertical: hp(16),
        paddingHorizontal: wp(20),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});