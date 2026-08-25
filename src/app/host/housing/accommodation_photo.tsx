import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { Body2, Caption3 } from '@/components/typo/Typography';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { Colors } from '@/constants/theme';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function AccommodationPhotoScreen() {
    const router = useRouter();
    const [photo, setPhoto] = useState<any>(IMAGE_COMPONENTS.apartment);

    return (
        <SafeAreaView style={styles.safe}>

            <View style={{ paddingHorizontal: wp(20), }}>
                <SectionTitle title="Accommodation photo" />
            </View>
            <View style={{
                marginTop: hp(30),
                marginBottom: hp(10)
            }}>
                <StepIndicator totalSteps={5} currentStep={3} activeColor='#0088FF' inactiveColor='#0088FF' />
            </View>

            <View style={styles.content}>
                <Body2 color={Colors.PRIMARY_TEXT} style={styles.title}>
                    Accommodation photo
                </Body2>
                <Caption3 color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    Add a main photo of your accommodation.
                </Caption3>

                {/* Upload box — image এর মতো full width large */}
                <Pressable
                    style={styles.uploadBox}
                    onPress={() => setPhoto(IMAGE_COMPONENTS.apartment)}
                // activeOpacity={0.8}
                >
                    {photo ? (
                        <>
                            <Image
                                source={photo}
                                style={styles.uploadedImage}
                                contentFit="cover"
                            />
                            {/* Overlay with camera icon */}
                            <View style={styles.overlay}>
                                <Caption3 color="#fff" style={{ fontSize: 24 }}><CameraIcon /></Caption3>
                                <Caption3 color="#fff" style={styles.uploadText}>
                                    Upload here
                                </Caption3>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyUpload}>
                            <Caption3 color={Colors.TEXT_COLOR} style={{ fontSize: 32 }}>📷</Caption3>
                            <Caption3 color={Colors.TEXT_COLOR} style={styles.uploadText}>
                                Upload here
                            </Caption3>
                        </View>
                    )}
                </Pressable>

                <Caption3 color={Colors.TEXT_COLOR} style={styles.hint}>
                    A single photo is enough. Make sure it represents your accommodation well.
                </Caption3>
            </View>

            <View style={styles.footer}>
                <CustomButton
                    title="Continue"
                    onPress={() =>
                        router.push('/host/housing/practical_information' as any)
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
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND },
    content: { flex: 1, paddingHorizontal: wp(20) },
    title: { marginBottom: hp(6), fontFamily: 'Poppins_600SemiBold',textAlign:"center" },
    subtitle: { marginBottom: hp(20),textAlign:"center" },
    uploadBox: {
        width: '100%',
        height: hp(300),
        borderRadius: wp(14),
        overflow: 'hidden',
        backgroundColor: Colors.INPUT_BACKGROUND,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#00000030',
        gap: hp(6),
    },
    emptyUpload: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: hp(8),
    },
    uploadText: {
        textDecorationLine: 'underline',
        color: '#fff',
    },
    hint: {
        marginTop: hp(14),
        lineHeight: hp(20),
    },
    footer: {
        paddingHorizontal: wp(20),
        paddingVertical: hp(16),
        backgroundColor: Colors.APP_BACKGROUND,
    },
});