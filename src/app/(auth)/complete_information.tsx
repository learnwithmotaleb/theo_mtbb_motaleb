import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { LockIcon } from '@/assets/icons/common_icon/LockIcon';
import { UserIcon } from '@/assets/icons/common_icon/UserIcon';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body6, Caption2, Caption3, H1 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import { validatePassword } from '../../../utils/validation';

interface SecurityRule {
    label: string;
    test: (password: string) => boolean;
}

const SECURITY_RULES: SecurityRule[] = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase and one number', test: (p) => /[A-Z]/.test(p) && /[0-9]/.test(p) },
    { label: 'One special character (@, #, !)', test: (p) => /[@#!$%^&*]/.test(p) },
];

export default function CompleteInformationScreen() {
    const [selectedRules, setSelectedRules] = useState<number[]>([]);
    const router = useRouter();

    const { values, errors, touched, handleChange, handleSubmit } = useForm({
        initialValues: {
            [FORM_FIELDS.FULL_NAME]: '',
            lastName: '',
            [FORM_FIELDS.PASSWORD]: '',
        },
        validationRules: {
            [FORM_FIELDS.FULL_NAME]: (v: string) => !v.trim() ? 'First name is required' : '',
            lastName: (v: string) => !v.trim() ? 'Last name is required' : '',
            [FORM_FIELDS.PASSWORD]: validatePassword,
        },
        onSubmit: async (values) => {
            console.log('Complete info submitted:', JSON.stringify(values, null, 2));
        },
    });

    const passwordRules = useMemo(
        () => SECURITY_RULES.map((rule) => ({ ...rule, passed: rule.test(values[FORM_FIELDS.PASSWORD] ?? '') })),
        [values[FORM_FIELDS.PASSWORD]]
    );

    const toggleRule = (index: number) => {
        setSelectedRules(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.APP_BACKGROUND }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.root}
            >
                {/* Back button */}
                <View style={styles.topRow}>
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => [
                            styles.backBtn,
                            { opacity: pressed ? 0.6 : 1 }
                        ]}
                        hitSlop={8}
                    >
                        <LeftAngleIcon />
                    </Pressable>
                </View>

                {/* Step indicator */}
                <StepIndicator
                    totalSteps={4}
                    currentStep={3}
                    activeColor={Colors.BRAND_PRIMARY}
                    inactiveColor={Colors.BRAND_PRIMARY}
                />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <H1 color={Colors.PRIMARY_TEXT} style={styles.title}>
                            Complete your information
                        </H1>
                        <Body6 color={Colors.TEXT_COLOR} style={styles.description}>
                            Tell us a bit about yourself to personalize your Gestlio experience.
                        </Body6>

                        {/* First Name */}
                        <View style={styles.fieldGroup}>
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                First Name
                            </Body6>
                            <FormInput
                                value={values[FORM_FIELDS.FULL_NAME]}
                                onChangeText={(text) => handleChange(FORM_FIELDS.FULL_NAME, text)}
                                type="text"
                                placeholder="e.g. John"
                                leftIcon={<UserIcon size={16} color="#8C88A3" />}
                                error={errors[FORM_FIELDS.FULL_NAME]}
                                touched={touched[FORM_FIELDS.FULL_NAME]}
                            />
                        </View>

                        {/* Last Name */}
                        <View style={styles.fieldGroup}>
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                Last Name
                            </Body6>
                            <FormInput
                                value={(values as any).lastName ?? ''}
                                onChangeText={(text) => handleChange('lastName' as any, text)}
                                type="text"
                                placeholder="e.g. John"
                                leftIcon={<UserIcon size={16} color="#8C88A3" />}
                                error={(errors as any).lastName}
                                touched={(touched as any).lastName}
                            />
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                Password
                            </Body6>
                            <FormInput
                                value={values[FORM_FIELDS.PASSWORD]}
                                onChangeText={(text) => handleChange(FORM_FIELDS.PASSWORD, text)}
                                type="password"
                                placeholder="Your Password"
                                leftIcon={<LockIcon size={16} color="#8C88A3" />}
                                error={errors[FORM_FIELDS.PASSWORD]}
                                touched={touched[FORM_FIELDS.PASSWORD]}
                            />
                        </View>

                        {/* Password Security */}
                        <Caption2 color={Colors.PRIMARY_TEXT} style={styles.securityTitle}>
                            Password Security
                        </Caption2>
                        {passwordRules.map((rule, index) => {
                            const isSelected = selectedRules.includes(index);
                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => toggleRule(index)}
                                    style={({ pressed }) => [
                                        styles.ruleRow,
                                        { opacity: pressed ? 0.7 : 1 }
                                    ]}
                                    hitSlop={6}
                                >
                                    <View style={[
                                        styles.ruleCircle,
                                        rule.passed && styles.ruleCirclePassed,
                                        isSelected && styles.ruleCircleSelected,
                                    ]}>
                                        {(rule.passed || isSelected) && (
                                            <View style={styles.ruleDot} />
                                        )}
                                    </View>
                                    <Caption3
                                        color={(rule.passed || isSelected)
                                            ? Colors.PRIMARY_TEXT
                                            : Colors.TEXT_COLOR}
                                        style={styles.ruleLabel}
                                    >
                                        {rule.label}
                                    </Caption3>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Bottom button */}
                <View style={styles.footer}>
                    <CustomButton
                        title="Continue"
                        // onPress={handleSubmit}
                        onPress={() => {
                            console.log('Complete info submitted:', JSON.stringify(values, null, 2));
                            router.push('/(auth)/role_select' as any);
                        }}
                        width="100%"
                        height={hp(52)}
                        borderRadius={8}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
    },
    topRow: {
        marginBottom: hp(40),
        marginTop: hp(10),
    },
    backBtn: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#FFFFFF",
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    arrowLeft: {},
    content: {
        flex: 1,
        marginTop: hp(10),
    },
    title: {
        marginBottom: hp(8),
        fontSize: 24,
    },
    description: {
        marginBottom: hp(20),
        textAlign: 'center',
    },
    fieldGroup: {
        marginBottom: hp(12),
    },
    label: {
        marginBottom: hp(6),
        marginLeft: wp(2),
    },
    securityTitle: {
        marginBottom: hp(10),
    },
    ruleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(8),
    },
    ruleCircle: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        borderWidth: 1.5,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp(10),
    },
    ruleCirclePassed: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: Colors.BRAND_PRIMARY,
    },
    ruleCircleSelected: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: Colors.BRAND_PRIMARY,
    },
    ruleDot: {
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        backgroundColor: Colors.TEXT_WHITE,
    },
    ruleLabel: {},
    footer: {
        // paddingTop: hp(32),
    },
});