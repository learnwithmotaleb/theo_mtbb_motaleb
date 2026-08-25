import { RedVerifyIcon } from '@/assets/icons/host_icon/RedVerifyIcon';
import { Body6, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

type Props = {
    visible: boolean;
    isPrimary: boolean;
    onClose: () => void;
    onRemove: () => void;
    onMakePrimary: () => void;
    onMakeSubstitute: () => void;
};

export function CleanerOptionsModal({
    visible,
    isPrimary,
    onClose,
    onRemove,
    onMakePrimary,
    onMakeSubstitute,
}: Props) {
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleRemove = () => {
        setConfirmVisible(true);
    };

    return (
        <>
            {/* Options sheet */}
            <Modal
                visible={visible && !confirmVisible}
                transparent
                animationType="fade"
                onRequestClose={onClose}
            >
                <Pressable style={styles.overlay} onPress={onClose}>
                    <View style={styles.sheet}>
                        {/* Remove Option */}
                        <Pressable style={styles.option} onPress={handleRemove}>
                            <Body6 color={Colors.COLOR_DANGER}>Remove</Body6>
                        </Pressable>

                        <View style={styles.divider} />

                       
                        {isPrimary ? (
                            <Pressable style={styles.option} onPress={onMakeSubstitute}>
                                <Body6 color={Colors.PRIMARY_TEXT}>Make Substitute</Body6>
                            </Pressable>
                        ) : (
                            
                            <Pressable style={styles.option} onPress={onMakePrimary}>
                                <Body6 color={Colors.PRIMARY_TEXT}>Make Primary</Body6>
                            </Pressable>
                        )}
                    </View>
                </Pressable>
            </Modal>

            {/* Confirm remove modal */}
            <Modal
                visible={confirmVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setConfirmVisible(false)}
            >
                <Pressable
                    style={styles.overlay}
                    onPress={() => setConfirmVisible(false)}
                >
                    <View style={styles.confirmModal}>
                        {/* Warning icon */}
                        {/* <View style={styles.warningIcon}>
                            <Body6 color={Colors.COLOR_DANGER} style={{ fontSize: 22 }}>!</Body6>
                        </View> */}
                        <RedVerifyIcon />

                        <Body6
                            color={Colors.PRIMARY_TEXT}
                            align="center"
                            style={{ marginVertical: hp(12) }}
                        >
                            Do you want to Remove this Cleaner
                        </Body6>

                        <View style={styles.confirmBtns}>
                            <Pressable
                                style={[styles.confirmBtn, styles.removeBtn]}
                                onPress={() => {
                                    setConfirmVisible(false);
                                    onRemove();
                                }}
                            >
                                <Caption3 color="#fff">Remove</Caption3>
                            </Pressable>
                            <Pressable
                                style={[styles.confirmBtn, styles.cancelBtn]}
                                onPress={() => setConfirmVisible(false)}
                            >
                                <Caption3 color={Colors.PRIMARY_TEXT}>Cancel</Caption3>
                            </Pressable>
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </>
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
    sheet: {
        backgroundColor: '#fff',
        borderRadius: wp(14),
        width: '100%',
        overflow: 'hidden',
    },
    option: {
        paddingHorizontal: wp(20),
        paddingVertical: hp(16),
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },

    // Confirm modal
    confirmModal: {
        backgroundColor: '#fff',
        borderRadius: wp(16),
        padding: wp(24),
        width: '100%',
        alignItems: 'center',
    },
    warningIcon: {
        width: wp(56),
        height: wp(56),
        borderRadius: wp(28),
        borderWidth: 2,
        borderColor: Colors.COLOR_DANGER,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmBtns: {
        flexDirection: 'row',
        gap: wp(12),
        marginTop: hp(8),
        width: '100%',
    },
    confirmBtn: {
        flex: 1,
        paddingVertical: hp(12),
        borderRadius: wp(10),
        alignItems: 'center',
    },
    removeBtn: { backgroundColor: Colors.COLOR_DANGER },
    cancelBtn: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
    },
});