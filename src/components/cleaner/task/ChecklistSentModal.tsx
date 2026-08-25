import { CustomButton } from '@/components/shared/CustomButton';
import { Body5, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    visible: boolean;
    onClose: () => void;
};

export function ChecklistSentModal({ visible, onClose }: Props) {
    const router = useRouter();

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modal}>
                    <View style={styles.iconCircle}>
                        <Body5 color="#fff" style={{ fontSize: 28 }}>✓</Body5>
                    </View>
                    <Body5 color={Colors.PRIMARY_TEXT} align="center" style={{ marginTop: hp(12) }}>
                        Checklist Sent
                    </Body5>
                    <Caption3 color={Colors.TEXT_COLOR} align="center" style={{ marginBottom: hp(16) }}>
                        waiting for host approval
                    </Caption3>
                    <CustomButton
                        title="Back to home"
                        onPress={() => {
                            onClose();
                            router.replace('/cleaner/(tabs)' as any);
                        }}
                        width="100%"
                        backgroundColor={Colors.PRIMARY_TEXT}
                        color="#fff"
                        borderRadius={wp(8)}
                        height={hp(52)}
                    />
                </View>
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
        backgroundColor: '#fff',
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