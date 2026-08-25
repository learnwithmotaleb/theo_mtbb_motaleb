import { EmailIcon } from '@/assets/icons/common_icon/EmailIcon';
import { LeftAngleIcon } from '@/assets/icons/common_icon/LiftAngleIcon';
import { FormInput } from '@/components/inputForm/inputForm';
import { CustomButton } from '@/components/shared/CustomButton';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body3, Caption3, H1 } from '@/components/typo/Typography';
import { FORM_FIELDS } from '@/components/ui/form';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { useForm } from '@/hooks/useForm';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import { validateEmail } from '../../../utils/validation';

export default function TakeEmailScreen() {
  const router = useRouter();

  const { values, errors, touched, handleChange, handleSubmit } = useForm({
    initialValues: {
      [FORM_FIELDS.EMAIL]: '',
    },
    validationRules: {
      [FORM_FIELDS.EMAIL]: validateEmail,
    },
    onSubmit: async (values) => {
      console.log('Email submitted:', JSON.stringify(values, null, 2));
      router.push('/(auth)/verification_email' as any);
    },
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.APP_BACKGROUND }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.root}
      >
        {/* Back button row */}
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
        <View style={{ marginVertical: hp(30) }}>
          <StepIndicator
            totalSteps={4}
            currentStep={1}
            activeColor={Colors.BRAND_PRIMARY}
            inactiveColor={Colors.BRAND_PRIMARY}
          />
        </View>

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Logo */}
            <Image
              source={IMAGE_COMPONENTS.homeLogo}
              style={styles.logo}
              contentFit="contain"
            />

            {/* Title & description */}
            <H1 color={Colors.PRIMARY_TEXT} style={styles.title}>
              Create your account
            </H1>
            <Caption3 color={Colors.TEXT_COLOR} style={styles.description}>
              Join our health platform for simplified management of your well-being.
            </Caption3>

            {/* Email field */}
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
          </View>
        </ScrollView>

        {/* Bottom button */}
        <View style={styles.footer}>
          <CustomButton
            title="Continue"
            // onPress={handleSubmit}
            onPress={() => {
              console.log('Email submitted:', JSON.stringify(values, null, 2));
              router.push('/(auth)/verification_email' as any);
            }}
            width="100%"
            height={hp(52)}
            borderRadius={14}
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
    marginBottom: hp(30),
    marginVertical: hp(30),
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
  content: {
    flex: 1,
  },
  logo: {
    width: wp(140),
    height: hp(70),
    alignSelf: 'center',
    marginVertical: hp(12),
  },
  title: {
    marginBottom: hp(8),
  },
  description: {
    marginBottom: hp(24),
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
    paddingTop: hp(12),
  },
});