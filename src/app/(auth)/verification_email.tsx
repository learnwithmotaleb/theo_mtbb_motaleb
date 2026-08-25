import { EmailIcon } from '@/assets/icons/common_icon/EmailIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body6, Caption3, H1 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fp, hp, wp } from '../../../utils/responsiveDevice';

const OTP_LENGTH = 6;

export default function VerificationEmailScreen() {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
    const inputRefs = useRef<(TextInput | null)[]>([]);

    const email = 'julien.dupont@email.com';
    const maskedDisplay = email;

    const handleChange = (text: string, index: number) => {
        const cleaned = text.replace(/[^0-9]/g, '').slice(-1);
        const newOtp = [...otp];
        newOtp[index] = cleaned;
        setOtp(newOtp);
        if (cleaned && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleResend = () => {
        console.log('Resend code tapped');
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
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
                    <View style={{ marginVertical: hp(20) }}>
                        <StepIndicator
                            totalSteps={4}
                            currentStep={2}
                            activeColor={Colors.BRAND_PRIMARY}
                            inactiveColor={Colors.BRAND_PRIMARY}
                        />
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            <Image
                                source={IMAGE_COMPONENTS.emailImage}
                                style={styles.imageEmail}
                                contentFit="contain"
                            />

                            <H1 color={Colors.PRIMARY_TEXT} style={styles.title}>
                                Verification E-mail
                            </H1>
                            <Body6 color={Colors.TEXT_COLOR} style={styles.description}>
                                We have sent to a code to
                            </Body6>
                            <Body6 color={Colors.PRIMARY_TEXT} style={styles.emailText}>
                                {maskedDisplay}
                            </Body6>

                            {/* Email display row */}
                            <View style={styles.fieldGroup}>
                                <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                    Email
                                </Body6>
                                <View style={styles.emailRow}>
                                    <View style={styles.emailIconWrapper}>
                                        <View style={styles.emailIconOuter}>
                                            <EmailIcon />
                                        </View>
                                    </View>
                                    <Body6 color={Colors.PRIMARY_TEXT} style={styles.emailValue}>
                                        {maskedDisplay}
                                    </Body6>
                                    <Pressable onPress={() => router.back()}>
                                        <Caption3 color={"#35A9D6"}>Modify?</Caption3>
                                    </Pressable>
                                </View>
                            </View>

                            {/* OTP boxes */}
                            <Caption3 color={Colors.PRIMARY_TEXT} style={styles.label}>
                                Type here code
                            </Caption3>
                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => { inputRefs.current[index] = ref; }}
                                        style={[styles.otpBox, digit ? styles.otpBoxFilled : styles.otpBoxEmpty]}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        textContentType="oneTimeCode"
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>

                            {/* Resend */}
                            <View style={styles.resendRow}>
                                <Pressable onPress={handleResend}>
                                    <Caption3
                                        color={Colors.PRIMARY_TEXT}
                                        style={styles.resendText}
                                    >
                                        Resend Code
                                    </Caption3>
                                </Pressable>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Bottom button */}
                    <View style={styles.footer}>
                        <CustomButton
                            title="Continue"
                            // onPress={handleContinue}
                            onPress={() => {
                                const code = otp.join('');
                                console.log('Email OTP submitted:', code);
                                router.push('/(auth)/complete_information' as any);
                            }}
                            width="100%"
                            height={hp(52)}
                            borderRadius={14}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
    },
    topRow: {
        marginTop: hp(20),
        marginBottom: hp(30),
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
    arrowLeft: {
        width: wp(10),
        height: wp(10),
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.PRIMARY_TEXT,
        transform: [{ rotate: '45deg' }],
    },
    content: {
        flex: 1,
    },
    imageEmail: {
        width: wp(160),
        height: hp(124),
        alignSelf: 'center',
        marginVertical: hp(20),
    },
    illustrationPlaceholder: {
        alignItems: 'center',
        marginBottom: hp(16),
    },
    envelope: {
        width: wp(80),
        height: wp(60),
        position: 'relative',
        alignItems: 'center',
    },
    envelopeFlap: {
        width: wp(80),
        height: wp(30),
        backgroundColor: '#D6DCF5',
        borderTopLeftRadius: wp(8),
        borderTopRightRadius: wp(8),
    },
    envelopeBody: {
        width: wp(80),
        height: wp(30),
        backgroundColor: '#E8ECFA',
        borderBottomLeftRadius: wp(8),
        borderBottomRightRadius: wp(8),
    },
    checkBadge: {
        position: 'absolute',
        bottom: -wp(8),
        right: wp(8),
        width: wp(22),
        height: wp(22),
        borderRadius: wp(11),
        backgroundColor: Colors.SUCCESS_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: wp(8),
        height: wp(5),
        borderLeftWidth: 2,
        borderBottomWidth: 2,
        borderColor: Colors.TEXT_WHITE,
        transform: [{ rotate: '-45deg' }, { translateY: -wp(1) }],
    },
    title: {
        marginBottom: hp(4),
    },
    description: {},
    emailText: {
        marginBottom: hp(16),
    },
    fieldGroup: {
        marginBottom: hp(12),
    },
    label: {
        marginBottom: hp(6),
        marginLeft: wp(2),
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    emailIconWrapper: {
        marginRight: wp(10),
    },
    emailIconOuter: {},
    emailIconInner: {
        width: wp(12),
        height: wp(6),
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: Colors.TEXT_COLOR,
        transform: [{ rotate: '0deg' }],
    },
    emailValue: {
        flex: 1,
    },
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp(12),
    },
    otpBox: {
        width: wp(46),
        height: wp(50),
        borderRadius: 10,
        borderWidth: 1.5,
        textAlign: 'center',
        fontSize: fp(16),
        fontFamily: 'Poppins_600SemiBold',
        color: Colors.PRIMARY_TEXT,
    },
    otpBoxEmpty: {
        borderColor: Colors.BORDER_COLOR,
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    otpBoxFilled: {
        borderColor: Colors.BRAND_PRIMARY,
        backgroundColor: Colors.INPUT_BACKGROUND,
        color: Colors.PRIMARY_TEXT,
    },
    resendRow: {
        alignItems: 'flex-end',
    },
    resendText: {
        textDecorationLine: 'underline',
    },
    footer: {
        // paddingBottom: hp(32),
    },
});