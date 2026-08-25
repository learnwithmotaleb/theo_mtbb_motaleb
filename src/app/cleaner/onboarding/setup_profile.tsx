import { ShieldCheckIcon } from '@/assets/icons/cleaner_icon/ShieldCheckIcon';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { InfoCard } from '@/components/shared/InfoCard';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body5, Body6, Caption1, Caption3, H1 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function SetupProfileScreen() {
    const router = useRouter();
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [bio, setBio] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleContinue = async () => {
        setIsLoading(true);
        await new Promise((r) => setTimeout(r, 900));
        setIsLoading(false);
        router.push('/cleaner/onboarding/you_are_ready');
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Gestlio" />
            <View style={{ marginVertical: hp(30) }}>
                <StepIndicator
                    totalSteps={5}
                    currentStep={5}
                    activeColor={Colors.COLOR_ACTIVE}
                />
            </View>
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
              

                <H1 color="#4B4B4B" style={styles.title}>
                    Almost finished!
                </H1>
                <Body6 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Let's set up your profile to make it official.
                </Body6>

                {/* Avatar picker */}
                <View style={styles.avatarSection}>
                    <Pressable onPress={pickImage} style={styles.avatarWrapper}>
                        {photoUri ? (
                            <Image
                                source={{ uri: photoUri }}
                                style={styles.avatar}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <CameraIcon size={32} color={"#6F8393"} />
                            </View>
                        )}
                        <View style={styles.plusBadge}>
                            <Body5 color="#FFFFFF">+</Body5>
                        </View>
                    </Pressable>
                    <Body6 color={Colors.COLOR_ACTIVE} style={styles.addPhotoText}>
                        Add profile photo
                    </Body6>
                </View>

                {/* Biography */}
                <View style={styles.bioLabelRow}>
                    <Body6 color={"#8E8E93"}>Biography</Body6>
                    <Caption1 color={"#8E8E93"}>  (Optional)</Caption1>
                </View>
                <View style={styles.bioBox}>
                    <TextInput
                        style={styles.bioInput}
                        value={bio}
                        onChangeText={setBio}
                        placeholder="Tell us a little bit about yourself or your professional background..."
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>
                <Caption3 color={"#8E8E93"} style={styles.bioHint}>
                    This will be visible to your team and clients.
                </Caption3>

                <InfoCard
                    icon={<ShieldCheckIcon size={20} color={Colors.COLOR_ACTIVE} />}
                    title="Secure & Private"
                    description="Your data is encrypted and used only for service operational task within Gestlio"
                    style={styles.infoCard}
                />
            </ScrollView>

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    isLoading={isLoading}
                    disabled={isLoading}
                    onPress={handleContinue}
                    backgroundColor={Colors.BG_BLACK}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(14)}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20)
    },
    scroll: {  paddingBottom: hp(20) },
    title: { marginBottom: hp(6) },
    subtitle: { marginBottom: hp(24) },
    avatarSection: {
        alignItems: 'center',
        marginBottom: hp(28),
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: hp(10),
    },
    avatar: {
        width: wp(110),
        height: wp(110),
        borderRadius: wp(55),
    },
    avatarPlaceholder: {
        width: wp(110),
        height: wp(110),
        borderRadius: wp(55),
        backgroundColor: "#D9E0E5",
        borderWidth: 2,
        borderColor: Colors.BORDER_COLOR,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
    },
    plusBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    addPhotoText: { marginTop: hp(4) },
    bioLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(8),
    },
    bioBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        paddingVertical: hp(12),
        marginBottom: hp(6),
    },
    bioInput: {
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(14),
        minHeight: hp(100),
    },
    bioHint: { marginBottom: hp(20) },
    infoCard: { marginTop: hp(4) },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});