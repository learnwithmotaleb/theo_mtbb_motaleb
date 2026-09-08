import { useT } from '@/i18n';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { Body5, Caption1, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { useCurrentUser } from '@/redux/hooks';
import {
    useBlockUserMutation,
    useCreateSupportTicketMutation,
} from '@/redux/services/miscApi';
import { hp, wp } from '../../../utils/responsiveDevice';

/**
 * Safety controls for a conversation. Both stores require an app carrying
 * user-to-user messaging to let people flag abusive content and block the
 * other party from inside the conversation itself (App Store Review Guideline
 * 1.2; Play's User Generated Content policy). Reports become support tickets
 * the admin dashboard already triages; blocking is symmetric server-side.
 */
export const useReportConversation = (
    conversationId: string | undefined,
    otherPartyName: string,
    otherPartyId?: string,
) => {
                                         const t = useT();
    const me = useCurrentUser();
    const [createTicket, { isLoading: isReporting }] = useCreateSupportTicketMutation();
    const [blockUser, { isLoading: isBlocking }] = useBlockUserMutation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [reason, setReason] = useState('');

    const submitReport = async () => {
        if (reason.trim().length < 10) {
            showToast(t("Please describe the problem in a little more detail."), 'error');
            return;
        }
        if (!me?.email) {
            showToast(t("Please sign in again before reporting."), 'error');
            return;
        }
        try {
            await createTicket({
                subject: 'Report a conversation',
                email: me.email,
                // The conversation id lets support open the exact thread.
                message: `Reported conversation: ${conversationId ?? 'unknown'}\nOther participant: ${otherPartyName}${otherPartyId ? ` (${otherPartyId})` : ''}\n\n${reason.trim()}`,
            }).unwrap();
            setReportOpen(false);
            setReason('');
            showToast(t("Thank you — our team will review this within 24 hours."), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send the report.")), 'error');
        }
    };

    const confirmBlock = () => {
        if (!otherPartyId) return;
        setMenuOpen(false);
        Alert.alert(
            t("Block {name}?", { name: otherPartyName }),
            t("Neither of you will be able to send messages to the other. You can undo this from Security in your profile."),
            [
                { text: t("Cancel"), style: 'cancel' },
                {
                    text: t("Block"),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await blockUser(otherPartyId).unwrap();
                            showToast(t("{name} has been blocked.", { name: otherPartyName }), 'success');
                        } catch (err) {
                            showToast(
                                getApiErrorMessage(err, t("Could not block this user.")),
                                'error',
                            );
                        }
                    },
                },
            ],
        );
    };

    const reportModal = (
        <>
            {/* The header's "..." opens this small action sheet. */}
            <Modal visible={menuOpen} transparent animationType="fade">
                <Pressable style={styles.backdrop} onPress={() => setMenuOpen(false)}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <Body5 color={Colors.PRIMARY_TEXT}>{otherPartyName}</Body5>
                        <Pressable
                            style={styles.menuItem}
                            onPress={() => {
                                setMenuOpen(false);
                                setReportOpen(true);
                            }}
                        >
                            <Caption3 color={Colors.PRIMARY_TEXT}>
                                {t("Report this conversation")}
                            </Caption3>
                        </Pressable>
                        <Pressable
                            style={styles.menuItem}
                            onPress={confirmBlock}
                            disabled={!otherPartyId || isBlocking}
                        >
                            <Caption3 color={Colors.COLOR_DANGER}>
                                {t("Block {name}", { name: otherPartyName })}
                            </Caption3>
                        </Pressable>
                        <Pressable style={styles.menuItem} onPress={() => setMenuOpen(false)}>
                            <Caption3 color={Colors.TEXT_COLOR}>{t("Cancel")}</Caption3>
                        </Pressable>
                    </Pressable>
                </Pressable>
            </Modal>

            <Modal visible={reportOpen} transparent animationType="fade">
                <Pressable style={styles.backdrop} onPress={() => setReportOpen(false)}>
                    <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                        <Body5 color={Colors.PRIMARY_TEXT}>{t("Report this conversation")}</Body5>
                        <Caption3 color={Colors.TEXT_COLOR} style={styles.hint}>
                            {t("Tell us what happened. Our team reviews every report and can suspend the account involved.")}
                        </Caption3>
                        <View style={styles.inputBox}>
                            <TextInput
                                style={styles.input}
                                value={reason}
                                onChangeText={setReason}
                                placeholder={t("Describe the problem...")}
                                placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                                multiline
                                textAlignVertical="top"
                                maxLength={900}
                            />
                        </View>
                        <Caption1 color={Colors.TEXT_COLOR} style={styles.hint}>
                            {t("Blocking {name} stops all messages between you straight away.", { name: otherPartyName })}
                        </Caption1>
                        <View style={styles.actions}>
                            <CustomButton
                                title={t("Cancel")}
                                onPress={() => setReportOpen(false)}
                                color={Colors.TEXT_COLOR}
                                backgroundColor={Colors.APP_BACKGROUND}
                                borderColor={Colors.BORDER_COLOR}
                                width="48%"
                                borderRadius={wp(10)}
                            />
                            <CustomButton
                                title={t("Send report")}
                                onPress={submitReport}
                                isLoading={isReporting}
                                disabled={isReporting}
                                backgroundColor={Colors.BG_BLACK}
                                width="48%"
                                borderRadius={wp(10)}
                            />
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );

    return { openReport: () => setMenuOpen(true), reportModal };
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        paddingHorizontal: wp(20),
    },
    sheet: {
        backgroundColor: Colors.APP_BACKGROUND,
        borderRadius: wp(16),
        padding: wp(20),
        gap: hp(8),
    },
    menuItem: { paddingVertical: hp(12) },
    hint: { lineHeight: hp(18) },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(14),
        paddingVertical: hp(10),
    },
    input: {
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(14),
        minHeight: hp(90),
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(6),
    },
});
