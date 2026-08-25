import { CustomButton } from '@/components/shared/CustomButton';
import { Body4, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../../utils/responsiveDevice';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function RequestSentModal({ visible, onClose }: Props) {
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
                        <Body4 color="#fff" style={{ fontSize: 28 }}>✓</Body4>
                    </View>

                    <Body4
                        color={Colors.PRIMARY_TEXT}
                        align="center"
                        style={{ marginTop: hp(16), marginBottom: hp(8) }}
                    >
                        Request has been successfully sent.
                    </Body4>
                    <Caption3 color={Colors.TEXT_COLOR} align="center" style={{ marginBottom: hp(24) }}>
                        When the application is accepted, the cleaning agent is automatically associated with the selected accommodation.
                    </Caption3>

                    <CustomButton
                        title="Return to homepage"
                        onPress={() => {
                            onClose();
                            router.replace('/host/(tabs)' as any);
                        }}
                        width="100%"
                        backgroundColor={Colors.PRIMARY_TEXT}
                        color="#fff"
                        borderRadius={wp(14)}
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
        width: wp(72),
        height: wp(72),
        borderRadius: wp(36),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center',
        justifyContent: 'center',
    },
});