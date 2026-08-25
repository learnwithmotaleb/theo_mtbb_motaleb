import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Body7, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function CleaningValidatedModal({ visible, onClose }: Props) {
    const router = useRouter();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modal}>
                    {/* Check icon */}
                    <View style={styles.iconCircle}>
                        <Body7 color="#fff" style={{ fontSize: 28 }}>✓</Body7>
                    </View>

                    <Body4 color={Colors.PRIMARY_TEXT} align="center" style={{ marginTop: hp(12) }}>
                        Cleaning validated!
                    </Body4>
                    <Caption3 color={Colors.TEXT_COLOR} align="center" style={styles.desc}>
                        The mission has been successfully scheduled.{'\n'}
                        You will be notified of the next steps.
                    </Caption3>

                    <CustomButton
                        title="Perfect"
                        onPress={() => {
                            onClose();
                            router.replace('/host/(tabs)' as any);
                        }}
                        width="100%"
                        backgroundColor={Colors.PRIMARY_TEXT}
                        color="#fff"
                        borderRadius={wp(8)}
                        style={{ marginTop: hp(8) }}
                        height={hp(52)}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: '#00000050',
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(24),
    },
    modal: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(20),
        padding: wp(24),
        width: '100%',
        alignItems: 'center',
    },
    iconCircle: {
        width: wp(72), height: wp(72),
        borderRadius: wp(36),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
    },
    desc: { marginTop: hp(8), marginBottom: hp(16), lineHeight: hp(22) },
});