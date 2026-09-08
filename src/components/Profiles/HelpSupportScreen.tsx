// components/shared/HelpSupportScreen.tsx
import { useT } from '@/i18n';
import { DownArrowIcon } from '@/assets/icons/common_icon/DownArrowIcon';
import { LockIcon } from '@/assets/icons/common_icon/LockIcon';
import { SmsIcon } from '@/assets/icons/common_icon/SmsIcon';
import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { Body5, Body6, Caption1, Caption3, H3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { useCurrentUser } from '@/redux/hooks';
import { useCreateSupportTicketMutation } from '@/redux/services/miscApi';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList, Modal, Pressable, ScrollView,
    StyleSheet,
    TextInput, View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../utils/responsiveDevice';
import SectionTitle from '../shared/SectionTitle';

const SUBJECTS = ['Technical issue', 'Billing question', 'Feature request', 'Account problem', 'Other'];
const MAX_MSG = 1000;

export function HelpSupportScreen() {
    const t = useT();
    const router = useRouter();
    const me = useCurrentUser();
    const [subject, setSubject] = useState('');
    const [dropOpen, setDropOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [createTicket, { isLoading }] = useCreateSupportTicketMutation();

    // Pre-fill with the signed-in address; the user can still change it.
    useEffect(() => {
        if (me?.email) setEmail((current) => current || me.email);
    }, [me]);

    const handleSend = async () => {
        if (!subject || !email.trim() || !message.trim()) {
            showToast(t("Please fill in all fields"), 'error');
            return;
        }
        try {
            await createTicket({
                subject,
                email: email.trim(),
                message: message.trim(),
            }).unwrap();
            showToast(t("Message sent successfully!"), 'success');
            setSubject('');
            setMessage('');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not send your message.")), 'error');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <SectionTitle title={t("Help and Support")} />

            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.iconCircle}>
                    <SmsIcon />
                </View>
                <H3 align="center" color={Colors.TEXT_COLOR} style={styles.title}>
                    {t("We are here to help you")}
                </H3>


                <Caption3 align="center" color={Colors.TEXT_COLOR} style={styles.subtitle}>
                    {t("Do you have a question, a problem or a suggestion? Write to us, our team will answer you quickly.")}
                </Caption3>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>{t("Subject")}</Body5>
                <Pressable style={styles.dropdown} onPress={() => setDropOpen(true)}>
                    <Body6 color={subject ? Colors.PRIMARY_TEXT : Colors.TEXT_COLOR}>
                        {subject || t("Choose a subject")}
                    </Body6>
                    <Body6 color={Colors.TEXT_COLOR}>
                        <DownArrowIcon color='#4B4B4B' />
                    </Body6>
                </Pressable>

                <Modal visible={dropOpen} transparent animationType="fade">
                    <Pressable style={styles.backdrop} onPress={() => setDropOpen(false)}>
                        <View style={styles.dropList}>
                            <FlatList
                                data={SUBJECTS}
                                keyExtractor={(i) => i}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.dropItem}
                                        onPress={() => { setSubject(item); setDropOpen(false); }}
                                    >
                                        <Body6 color={item === subject ? Colors.BRAND_PRIMARY : Colors.PRIMARY_TEXT}>
                                            {item}
                                        </Body6>
                                    </Pressable>
                                )}
                            />
                        </View>
                    </Pressable>
                </Modal>

                <Body5 color={Colors.TEXT_COLOR} style={styles.label}>{t("Your email")}</Body5>
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="email@example.com"
                        placeholderTextColor={Colors.TEXT_COLOR}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.msgLabelRow}>
                    <Body5 color={Colors.TEXT_COLOR}>{t("Message")}</Body5>
                    <Caption1 color={Colors.TEXT_COLOR}>{message.length}/{MAX_MSG}</Caption1>
                </View>
                <View style={styles.msgBox}>
                    <TextInput
                        style={styles.msgInput}
                        value={message}
                        onChangeText={(t) => setMessage(t.slice(0, MAX_MSG))}
                        placeholder={t("Describe your request in detail...")}
                        placeholderTextColor={Colors.TEXT_COLOR}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                    />
                </View>

                <CustomButton
                    onPress={handleSend}
                    title={t("Send the message")}
                    backgroundColor={Colors.BRAND_PRIMARY}
                    width="100%"
                    height={hp(54)}
                    borderRadius={wp(8)}
                    isLoading={isLoading}
                    disabled={isLoading}
                    style={{ marginBottom: hp(16) }}
                />

                <View style={styles.infoNote}>
                    <View style={styles.lockIconWrapper}>
                        <LockIcon size={24} color={"#0088FF"} />
                    </View>
                    <Caption3 color={Colors.TEXT_COLOR} style={{ flex: 1 }}>
                        {t("Your information is confidential and used only to respond to your request.")}
                    </Caption3>
                </View>
            </ScrollView>
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
        paddingBottom: hp(32)
    },
    iconCircle: {
        alignSelf: 'center',
        width: wp(80), height: wp(80), borderRadius: wp(40),
        backgroundColor: "#0088FF1A",
        borderWidth: 1,
        borderColor: "#0088FF33",
        alignItems: 'center', justifyContent: 'center',
        marginBottom: hp(16), marginTop: hp(8),
    },
    iconText: { fontSize: wp(32) },
    title: { marginBottom: hp(6) },
    subtitle: { marginBottom: hp(28), paddingHorizontal: wp(10) },
    label: { marginBottom: hp(8) },
    dropdown: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14), borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16), height: hp(54),
        marginBottom: hp(16),
    },
    backdrop: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center', paddingHorizontal: wp(20),
    },
    dropList: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14), overflow: 'hidden', maxHeight: hp(260),
    },
    dropItem: {
        paddingVertical: hp(14), paddingHorizontal: wp(18),
        borderBottomWidth: 1, borderBottomColor: Colors.BORDER_COLOR,
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14), borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16), marginBottom: hp(16),
    },
    input: {
        height: hp(54), color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular', fontSize: wp(14),
    },
    msgLabelRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: hp(8),
    },
    msgBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14), borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(16), paddingVertical: hp(12),
        marginBottom: hp(20),
    },
    msgInput: {
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        fontSize: wp(14), minHeight: hp(120),
    },
    infoNote: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#EEF6FF',
        borderRadius: wp(12), padding: wp(14), gap: wp(10),
    },
    lockIconWrapper: {
        height: hp(36),
        width: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#35A9D61A",
        alignItems: 'center',
        justifyContent: 'center',
    },
});