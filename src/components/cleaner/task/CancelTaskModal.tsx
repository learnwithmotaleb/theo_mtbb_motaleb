import { RedVerifyIcon } from '@/assets/icons/host_icon/RedVerifyIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { Body5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

export function CancelTaskModal({ visible, onClose, onConfirm }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={styles.modal}>
                    {/* Warning icon — badge shape */}
                    <RedVerifyIcon/>

                    <Body5
                        color={Colors.PRIMARY_TEXT}
                        align="center"
                        style={styles.title}
                    >
                        Do you want to cancel this Task
                    </Body5>

                    <View style={styles.btnRow}>
                        <CustomButton
                            title="Cancel Task"
                            onPress={onConfirm}
                            width="48%"
                            backgroundColor={Colors.COLOR_DANGER}
                            color="#fff"
                            borderRadius={wp(12)}
                            height={hp(48)}
                        />
                        <CustomButton
                            title="Back"
                            onPress={onClose}
                            width="48%"
                            backgroundColor={Colors.BORDER_COLOR}
                            color={Colors.TEXT_COLOR}
                            borderRadius={wp(12)}
                            height={hp(48)}
                        />
                    </View>
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
        backgroundColor: '#fff',
        borderRadius: wp(20),
        padding: wp(24),
        width: '100%',
        alignItems: 'center',
        gap: hp(16),
    },
    iconWrapper: {
        width: wp(70),
        height: wp(70),
        alignItems: 'center',
        justifyContent: 'center',
    },
    exclamation: {
        fontSize: 60,
        color: Colors.COLOR_DANGER,
        // badge shape via text — replace with BadgeIcon if available
    },
    title: { marginBottom: hp(4) },
    btnRow: {
        flexDirection: 'row',
        gap: wp(12),
        width: '100%',
    },
});