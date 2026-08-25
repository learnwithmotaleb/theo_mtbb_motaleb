import { EmailIcon } from '@/assets/icons/common_icon/EmailIcon';
import { LockIcon } from '@/assets/icons/common_icon/LockIcon';
import { FormInput } from '@/components/inputForm/inputForm';
import { AuthHeading } from '@/components/shared/AuthHeading';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body3, Body6, Caption3 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import { validateEmail, validatePassword } from '../../../utils/validation';

export default function LoginScreen() {
    const router = useRouter();
    const [rememberMe, setRememberMe] = useState(false);

    const { values, errors, touched, handleChange, handleSubmit } = useForm({
        initialValues: {
            [FORM_FIELDS.EMAIL]: '',
            [FORM_FIELDS.PASSWORD]: '',
        },
        validationRules: {
            [FORM_FIELDS.EMAIL]: validateEmail,
            [FORM_FIELDS.PASSWORD]: validatePassword,
        },
        onSubmit: async (values) => {
            console.log('Form submitted:', JSON.stringify(values, null, 2));
        },
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.APP_BACKGROUND }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.scrollContent}
            >
                <View>
                    <SectionTitle title="Sign In" />
                </View>

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>
                        <View style={styles.inner}>

                            {/* Logo + title + description */}
                            <AuthHeading
                                imageSource={IMAGE_COMPONENTS.logo}
                                title="Welcome to Gestlio"
                                description="Cleaning your properties, from Planning to payment"
                            />

                            {/* Form */}
                            <View style={styles.form}>

                                {/* Email */}
                                <View style={styles.fieldGroup}>
                                    <Body3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                        Email
                                    </Body3>
                                    <FormInput
                                        value={values[FORM_FIELDS.EMAIL]}
                                        onChangeText={(text) => handleChange(FORM_FIELDS.EMAIL, text)}
                                        type="email"
                                        placeholder="Your Email"
                                        leftIcon={<EmailIcon size={16} color="#8C88A3" />}
                                        error={errors[FORM_FIELDS.EMAIL]}
                                        touched={touched[FORM_FIELDS.EMAIL]}
                                    />
                                </View>

                                {/* Password */}
                                <View style={styles.fieldGroup}>
                                    <Body3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                        Password
                                    </Body3>
                                    <FormInput
                                        value={values[FORM_FIELDS.PASSWORD]}
                                        onChangeText={(text) => handleChange(FORM_FIELDS.PASSWORD, text)}
                                        placeholder="Your Password"
                                        leftIcon={<LockIcon size={16} color="#8C88A3" />}
                                        type="password"
                                        error={errors[FORM_FIELDS.PASSWORD]}
                                        touched={touched[FORM_FIELDS.PASSWORD]}
                                    />
                                </View>

                                {/* Remember me + Forgot password */}
                                <View style={styles.rememberRow}>
                                    <Pressable
                                        style={styles.rememberLeft}
                                        onPress={() => setRememberMe(!rememberMe)}
                                    >
                                        <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                            {rememberMe && <View style={styles.checkmark} />}
                                        </View>
                                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginLeft: wp(6) }}>
                                            Remember me
                                        </Caption3>
                                    </Pressable>

                                    <Pressable onPress={() => router.push("/(auth)/forgot_password" as any)}>
                                        <Caption3 color={Colors.BRAND_PRIMARY}>
                                            Forgot password?
                                        </Caption3>
                                    </Pressable>
                                </View>

                                {/* Login button */}
                                <CustomButton
                                    title="Log in"
                                    onPress={() => router.push("/host/(tabs)")}
                                    width="100%"
                                    height={hp(52)}
                                    borderRadius={14}
                                    style={{ marginTop: hp(8) }}
                                />
                            </View>

                            {/* Or divider */}
                            <View style={styles.dividerRow}>
                                <View style={styles.dividerLine} />
                                <Body3 color={Colors.TEXT_COLOR} style={styles.dividerText}>
                                    Or
                                </Body3>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* Sign up */}
                            <View style={styles.footer}>
                                <Body6 color={Colors.TEXT_COLOR}>
                                    Don't have an account?
                                </Body6>
                                <Pressable
                                    onPress={() => router.push("/(auth)/take_email" as any)}
                                >
                                    <Body6 color={Colors.BRAND_PRIMARY}> Sign Up</Body6>
                                </Pressable>
                            </View>

                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        flex: 1,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inner: {
        width: '100%',
        maxWidth: 500,
    },
    form: {
        marginTop: hp(8),
    },
    fieldGroup: {
        marginBottom: hp(12),
    },
    label: {
        marginBottom: hp(6),
        marginLeft: wp(2),
    },
    rememberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: hp(4),
        marginBottom: hp(4),
    },
    rememberLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: wp(18),
        height: wp(18),
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: Colors.BRAND_PRIMARY,
        borderColor: Colors.BRAND_PRIMARY,
    },
    checkmark: {
        width: wp(10),
        height: wp(10),
        backgroundColor: Colors.TEXT_WHITE,
        borderRadius: 2,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(20),
        marginBottom: hp(12),
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.BORDER_COLOR,
    },
    dividerText: {
        marginHorizontal: wp(12),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: hp(24),
    },
});