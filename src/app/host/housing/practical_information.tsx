import { FormDropdown } from '@/components/host/housing/FormDropdown';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function PracticalInformationScreen() {
    const router = useRouter();
    const [form, setForm] = useState({
        keys: 'Key box at the entrance',
        accessCode: '',
        instructions: '',
        frequency: 'Every week',
    });

    return (
        <SafeAreaView style={styles.safe}>
            <View style={{ paddingHorizontal: wp(20), }}>
                <SectionTitle title="Practical information" />
            </View>
            <View style={{
                marginTop: hp(30),
                marginBottom: hp(10)
            }}>
                <StepIndicator totalSteps={5} currentStep={4} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Body2 color={Colors.PRIMARY_TEXT} style={styles.title}>
                    Practical information
                </Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Add useful information for the service visits.
                </Caption3>

                {/* Keys */}
                <FormDropdown
                    label="Where are the keys?"
                    value={form.keys}
                    options={[
                        'Key box at the entrance',
                        'With the concierge',
                        'Under the doormat',
                        'Neighbor',
                        'Other',
                    ]}
                    onChange={(v) => setForm({ ...form, keys: v })}
                />

                {/* Access code */}
                <View style={styles.fieldGroup}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                        Access code (optional)
                    </Caption3>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            placeholder="Ex: 1234 or Gate digital code"
                            placeholderTextColor={Colors.TEXT_COLOR}
                            value={form.accessCode}
                            onChangeText={(v) => setForm({ ...form, accessCode: v })}
                        />
                    </View>
                </View>

                {/* Specific instructions */}
                <View style={styles.fieldGroup}>
                    <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                        Specific instructions (optional)
                    </Caption3>
                    <View style={[styles.inputBox, { alignItems: 'flex-start' }]}>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Please close the windows after cleaning."
                            placeholderTextColor={Colors.TEXT_COLOR}
                            multiline
                            value={form.instructions}
                            onChangeText={(v) => setForm({ ...form, instructions: v })}
                            textAlignVertical="top"
                        />
                    </View>
                </View>

                {/* Frequency */}


                <FormDropdown
                    label="Usual frequency"
                    value={form.frequency}
                    options={[
                        'Every day',
                        'Every week',
                        'Every 2 weeks',
                        'Every month',
                        'On demand',
                    ]}
                    onChange={(v) => setForm({ ...form, frequency: v })}
                />
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    onPress={() => router.push('/host/housing/accommodation_summary' as any)}
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
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    scroll: { paddingHorizontal: wp(20), paddingBottom: hp(20) },
    title: {
        marginBottom: hp(6),
        fontFamily: 'Poppins_600SemiBold',
        textAlign: "center"
    },
    subtitle: {
        marginBottom: hp(24),
        textAlign: "center"
    },
    fieldGroup: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
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
    textArea: {
        width: '100%',
        minHeight: hp(150),
    },
    footer: {
        paddingHorizontal: wp(20),
        // paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});