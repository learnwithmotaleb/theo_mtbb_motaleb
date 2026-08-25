import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body6, H3 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';
import { validateEmail } from '../../../utils/validation';

export default function ForgotPasswordScreen() {
    const router = useRouter();

    const { values, errors, touched, handleChange, handleSubmit } = useForm({
        initialValues: {
            [FORM_FIELDS.EMAIL]: '',
        },
        validationRules: {
            [FORM_FIELDS.EMAIL]: validateEmail,
        },
        onSubmit: async (values) => {
            console.log('Forgot password submitted:', JSON.stringify(values, null, 2));
            router.push('/(auth)/verification' as any);
        },
    });

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.root}
            >
                <View style={styles.header}>
                    <SectionTitle title="Forgot Password" />
                </View>

                <View style={styles.content}>
                    {/* Title & description */}
                    <H3 color={Colors.PRIMARY_TEXT} align="center" style={styles.title}>
                        Forgot Password
                    </H3>
                    <Body6 color={Colors.TEXT_COLOR} align="center" style={styles.description}>
                        Don't worry enter your registered email
                    </Body6>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.fieldGroup}>
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                Email
                            </Body6>
                            <FormInput
                                value={values[FORM_FIELDS.EMAIL]}
                                onChangeText={(text) => handleChange(FORM_FIELDS.EMAIL, text)}
                                type="email"
                                placeholder="Enter your email here"
                                error={errors[FORM_FIELDS.EMAIL]}
                                touched={touched[FORM_FIELDS.EMAIL]}
                            />
                        </View>
                    </View>
                    {/* Bottom button */}
                    <View style={styles.footer}>
                        <CustomButton
                            title="Send OTP"
                            // onPress={handleSubmit}
                            onPress={() => router.push('/(auth)/verification' as any)}
                            width="100%"
                            height={hp(52)}
                            borderRadius={14}
                            backgroundColor={Colors.BG_BLACK}
                        />
                    </View>
                </View>


            </KeyboardAvoidingView>
        </>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
    },
    header: {
        marginBottom: hp(8),
    },
    content: {
        flex: 1,
        paddingTop: hp(50),
    },
    title: {
        marginBottom: hp(8),
    },
    description: {
        marginBottom: hp(32),
    },
    form: {},
    fieldGroup: {
        marginBottom: hp(12),
    },
    label: {
        marginBottom: hp(6),
        marginLeft: wp(2),
    },
    footer: {
        paddingBottom: hp(32),
    },
});