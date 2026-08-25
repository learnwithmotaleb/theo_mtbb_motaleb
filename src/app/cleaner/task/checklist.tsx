import { LocationIcon } from '@/assets/icons/cleaner_icon/LocationIcon';
import { InfoIcon } from '@/assets/icons/common_icon/InfoIcon';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import { ClockIcon } from '@/assets/icons/host_icon/ClockIcon';
import { ChecklistSentModal } from '@/components/cleaner/task/ChecklistSentModal';
import { CustomButton } from '@/components/shared/CustomButton';
import SectionTitle from '@/components/shared/SectionTitle';
import { Caption2, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { CLEANER_TASKS, UPCOMING_TASKS } from '@/data/cleanerFakeData';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

export default function ChecklistScreen() {
    const router = useRouter();
    const { taskId } = useLocalSearchParams<{ taskId: string }>();
    const allTasks = [...CLEANER_TASKS, ...UPCOMING_TASKS];
    const task = allTasks.find((t) => t.id === taskId) ?? allTasks[0];

    const [photos, setPhotos] = useState<string[]>([]);
    const [notes, setNotes] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const handleCapture = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Camera permission is needed.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            quality: 0.8,
        });
        if (!result.canceled && result.assets[0]) {
            setPhotos((prev) => [...prev, result.assets[0].uri]);
        }
    };

    const handleRemovePhoto = (idx: number) => {
        setPhotos((prev) => prev.filter((_, i) => i !== idx));
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title="Check List" />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                //  keyboardVerticalOffset={hp(10)}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Apartment info */}
                    <View style={styles.apartmentCard}>
                        <Image
                            source={task.image}
                            style={styles.thumb}
                            contentFit="cover"
                        />
                        <View style={styles.apartmentInfo}>
                            <Caption2 color={Colors.PRIMARY_TEXT} numberOfLines={2}>
                                {task.apartmentName}
                            </Caption2>
                            <View style={styles.row}>
                                <LocationIcon size={17} color={Colors.TEXT_COLOR} />
                                <Caption3 color={Colors.TEXT_COLOR}>{task.address}</Caption3>
                            </View>
                            <View style={styles.row}>
                                <ClockIcon size={17} color={Colors.TEXT_COLOR} />
                                <Caption3 color={Colors.TEXT_COLOR}>{task.time}</Caption3>
                            </View>
                        </View>
                    </View>

                    {/* Info note */}
                    <View style={styles.infoNote}>
                        <InfoIcon color='#8F8F8F' />
                        <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                            Capture picture as a proof of task completion
                        </Caption3>
                    </View>

                    {/* Capture button */}
                    <Pressable style={styles.captureBtn} onPress={handleCapture}>
                        <View style={styles.iconGroup}>
                            <CameraIcon color='#303030' />
                        </View>
                        <Caption3 color={Colors.PRIMARY_TEXT}>Capture Photos</Caption3>
                    </Pressable>

                    {/* Photos section */}
                    {photos.length > 0 && (
                        <>
                            <Caption3
                                color={Colors.TEXT_COLOR}
                                align="center"
                                style={styles.photosLabel}
                            >
                                Photos
                            </Caption3>
                            {photos.map((uri, idx) => (
                                <View key={idx} style={styles.photoWrapper}>
                                    <Image
                                        source={{ uri }}
                                        style={styles.photo}
                                        contentFit="cover"
                                    />
                                    <Pressable
                                        style={styles.removeBtn}
                                        onPress={() => handleRemovePhoto(idx)}
                                    >
                                        <Caption3 color="#fff">✕</Caption3>
                                    </Pressable>
                                </View>
                            ))}
                        </>
                    )}

                    {/* Notes */}
                    <Caption2 color={Colors.TEXT_COLOR} style={styles.notesLabel}>
                        NOTES (OPTIONAL)
                    </Caption2>
                    <View style={styles.notesBox}>
                        <TextInput
                            style={styles.notesInput}
                            placeholder="Add any specific details or issues found..."
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                            textAlignVertical="top"
                        />
                    </View>
                </ScrollView>

                {/* Footer */}
                <View style={styles.footer}>
                    <CustomButton
                        title="Submit Proof"
                        onPress={() => setModalVisible(true)}
                        width="100%"
                        backgroundColor={Colors.COLOR_ACTIVE}
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                    />
                </View>
            </KeyboardAvoidingView>

            <ChecklistSentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: Colors.APP_BACKGROUND,
        paddingHorizontal: wp(20),
    },
    container: { flex: 1 },
    scroll: { paddingBottom: hp(20) },

    apartmentCard: {
        flexDirection: 'row',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(12),
        marginBottom: hp(12),
    },
    thumb: { width: wp(70), height: hp(75), borderRadius: wp(8) },
    apartmentInfo: { flex: 1, gap: hp(4) },
    row: { flexDirection: 'row', alignItems: 'center', gap: wp(4) },

    infoNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        backgroundColor: "#8F8F8F1A",
        borderRadius: wp(10),
        padding: wp(12),
        marginBottom: hp(16),
    },

    captureBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(8),
        gap: wp(8),
        paddingVertical: hp(14),
        marginBottom: hp(16),
    },
    iconGroup: {
        height: hp(28),
        width: wp(28),
        borderRadius: wp(3),
        backgroundColor: "#F4F4F4",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },

    photosLabel: { marginBottom: hp(8) },
    photoWrapper: {
        position: 'relative',
        marginBottom: hp(10),
    },
    photo: {
        width: '100%',
        height: hp(280),
        borderRadius: wp(12),
    },
    removeBtn: {
        position: 'absolute',
        top: wp(10),
        right: wp(10),
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        backgroundColor: '#00000060',
        alignItems: 'center',
        justifyContent: 'center',
    },

    notesLabel: {
        letterSpacing: 0.6,
        marginBottom: hp(8),
    },
    notesBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
        minHeight: hp(120),
    },
    notesInput: {
        fontSize: 13,
        color: Colors.TEXT_COLOR,
        fontFamily: 'Poppins_400Regular',
        minHeight: hp(100),
        padding: 0,
    },

    footer: {

        backgroundColor: Colors.APP_BACKGROUND,
    },
});