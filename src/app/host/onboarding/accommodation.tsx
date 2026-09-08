
import { useT } from '@/i18n';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body5, Body6, ButtonText, Caption1, H2 } from '@/components/typo/Typography';
import { showToast } from '@/components/shared/Toast';
import { Colors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setDraftPhotos, updateDraft } from '@/redux/slices/accommodationDraftSlice';
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

export default function AccommodationScreen() {
    const t = useT();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const draft = useAppSelector((state) => state.accommodationDraft);

    const [name, setName] = useState(draft.name);
    const [photoUri, setPhotoUri] = useState<string | null>(
        draft.photos[0]?.uri ?? null,
    );
    const [nameError, setNameError] = useState('');

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            showToast(t("Photo permission is needed to add a picture."), 'error');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });
        if (result.canceled || !result.assets?.length) return;

        const asset = result.assets[0];
        const fileName = asset.fileName ?? asset.uri.split('/').pop() ?? 'photo.jpg';
        const ext = fileName.split('.').pop()?.toLowerCase() ?? 'jpg';
        setPhotoUri(asset.uri);
        // The wizard uploads its photos only when the summary step creates the
        // accommodation, so the picked file just lands in the draft for now.
        dispatch(
            setDraftPhotos([
                {
                    uri: asset.uri,
                    name: fileName,
                    type: asset.mimeType ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
                },
            ]),
        );
    };

    const handleContinue = () => {
        if (name.trim().length < 2) {
            setNameError('Accommodation name is required');
            return;
        }
        setNameError('');
        dispatch(updateDraft({ name: name.trim() }));
        router.push('/host/onboarding/location');
    };

    return (
        <SafeAreaView style={styles.safe}>
           <SectionTitle/>

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* <StepIndicator total={4} current={1} /> */}

                <H2 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("Let's start with your accommodation")}
                </H2>
                <Body6 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Give it a name and add a photo so you can find it easily.")}
                </Body6>

                {/* Name input */}
                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>
                    {t("Accommodation Name")}
                </Body5>
                <View style={[styles.inputBox, nameError ? styles.inputError : null]}>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={(t) => {
                            setName(t);
                            if (t.trim()) setNameError('');
                        }}
                        placeholder={t("Accommodation name here")}
                        placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                    />
                </View>
                {nameError ? (
                    <Caption1 color={Colors.COLOR_DANGER} style={styles.errorText}>
                        {nameError}
                    </Caption1>
                ) : null}

                {/* Photo upload */}
                <Pressable
                    style={styles.photoBox}
                    onPress={pickImage}
                >
                    {photoUri ? (
                        <Image
                            source={{ uri: photoUri }}
                            style={styles.photoPreview}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            {/* Dark room background image placeholder */}
                            <View style={styles.photoOverlay} />
                            <View style={styles.uploadCta}>
                                <CameraIcon size={32} color="#FFFFFF" />
                                <Caption1
                                    color="#FFFFFF"
                                    style={styles.uploadText}
                                >
                                    {t("Upload here")}
                                </Caption1>
                            </View>
                        </View>
                    )}
                </Pressable>
            </ScrollView>

            <View style={styles.footer}>
                <Pressable
                    style={styles.btn}
                    onPress={handleContinue}
                >
                    <ButtonText color={Colors.TEXT_WHITE}>{t("Continue")}</ButtonText>
                </Pressable>
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
   
    scroll: {
       marginTop:hp(20),
        paddingBottom: hp(20),
    },
    title: {
        marginBottom: hp(10),
    },
    subtitle: {
        // paddingHorizontal: wp(10),
        marginBottom: hp(28),
    },
    label: {
        marginBottom: hp(8),
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16),
        marginBottom: hp(4),
    },
    inputError: {
        borderColor: Colors.COLOR_DANGER,
    },
    input: {
        height: hp(54),
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(15),
    },
    errorText: {
        marginBottom: hp(10),
    },
    photoBox: {
        borderRadius: wp(16),
        overflow: 'hidden',
        height: hp(220),
        marginTop: hp(16),
        backgroundColor: '#3a3a3a',
    },
    photoPlaceholder: {
        flex: 1,
        backgroundColor: '#4a4a3a',
    },
    photoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    photoPreview: {
        width: '100%',
        height: '100%',
    },
    uploadCta: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: hp(8),
    },
    uploadText: {
        textDecorationLine: 'underline',
    },
    footer: {
        // paddingHorizontal: wp(20),
        // paddingBottom: hp(24),
        // paddingTop: hp(10),
        backgroundColor: Colors.APP_BACKGROUND,
    },
    btn: {
        height: hp(54),
        backgroundColor: Colors.BG_BLACK,
        borderRadius: wp(14),
        alignItems: 'center',
        justifyContent: 'center',
    },
});