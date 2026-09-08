import { useT } from '@/i18n';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import Toast, { showToast } from '@/components/shared/Toast';
import { Caption2 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { getApiErrorMessage } from '@/lib/apiError';
import { useAppSelector } from '@/redux/hooks';
import { useResetPasswordMutation } from '@/redux/services/authApi';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';
import { validatePassword } from '../../../utils/validation';

export default function NewPasswordScreen() {
    const t = useT();
    const router = useRouter();
    const params = useLocalSearchParams<{ email?: string }>();
    // The email comes through the route; the slice is the fallback for a
    // reload mid-flow (forgotPassword stashes it as pendingEmail).
    const pendingEmail = useAppSelector((state) => state.auth.pendingEmail);
    const email = params.email ?? pendingEmail ?? '';
    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const { values, errors, touched, handleChange, handleSubmit } = useForm({
        initialValues: {
            [FORM_FIELDS.NEW_PASSWORD]: '',
            [FORM_FIELDS.CONFIRM_NEW_PASSWORD]: '',
        },
        validationRules: {
            [FORM_FIELDS.NEW_PASSWORD]: validatePassword,
            [FORM_FIELDS.CONFIRM_NEW_PASSWORD]: (value: string, allValues: { newPassword: string; confirmNewPassword: string }) => {
                if (!value) return 'Confirm password is required';
                if (value !== allValues[FORM_FIELDS.NEW_PASSWORD]) return 'Passwords do not match';
                return '';
            },
        },
        onSubmit: async (values) => {
            if (!email) {
                showToast(t("Missing email — start the reset again."), 'error');
                return;
            }
            try {
                const res = await resetPassword({
                    email,
                    newPassword: values[FORM_FIELDS.NEW_PASSWORD],
                    confirmPassword: values[FORM_FIELDS.CONFIRM_NEW_PASSWORD],
                }).unwrap();
                showToast(res.message ?? t("Password updated"), 'success');
                setTimeout(() => router.replace('/(auth)/login' as any), 800);
            } catch (err) {
                showToast(getApiErrorMessage(err, t("Could not reset the password.")), 'error');
            }
        },
    });

    return (
        <>
            <Toast />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.root}
            >
                <View style={styles.header}>
                    <SectionTitle title={t("New Password")} />
                </View>

                <View style={styles.content}>
                    {/* Password */}
                    <View style={styles.fieldGroup}>
                        <Caption2 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Password")}
                        </Caption2>
                        <FormInput
                            value={values[FORM_FIELDS.NEW_PASSWORD]}
                            onChangeText={(text) => handleChange(FORM_FIELDS.NEW_PASSWORD, text)}
                            type="password"
                            placeholder="********"
                            error={errors[FORM_FIELDS.NEW_PASSWORD]}
                            touched={touched[FORM_FIELDS.NEW_PASSWORD]}
                        />
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.fieldGroup}>
                        <Caption2 color={Colors.PRIMARY_TEXT} style={styles.label}>
                            {t("Confirm Password")}
                        </Caption2>
                        <FormInput
                            value={values[FORM_FIELDS.CONFIRM_NEW_PASSWORD]}
                            onChangeText={(text) => handleChange(FORM_FIELDS.CONFIRM_NEW_PASSWORD, text)}
                            type="password"
                            placeholder="********"
                            error={errors[FORM_FIELDS.CONFIRM_NEW_PASSWORD]}
                            touched={touched[FORM_FIELDS.CONFIRM_NEW_PASSWORD]}
                        />
                    </View>
                     {/* Bottom button */}
                <View style={styles.footer}>
                    <CustomButton
                        title={isLoading ? 'Saving...' : 'Save'}
                        disabled={isLoading}
                        onPress={handleSubmit}
                        width="100%"
                        height={hp(56)}
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
        paddingTop: hp(24),
    },
    fieldGroup: {
        marginBottom: hp(12),
    },
    label: {
        marginBottom: hp(6),
        marginLeft: wp(2),
    },
    footer: {
        // paddingBottom: hp(32),
    },
});