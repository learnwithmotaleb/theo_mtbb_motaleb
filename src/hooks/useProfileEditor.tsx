import { useT } from '@/i18n';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { CustomButton } from '@/components/shared/CustomButton';
import { showToast } from '@/components/shared/Toast';
import { Body5, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { getApiErrorMessage } from '@/lib/apiError';
import { useGetMeQuery, useUpdateMeMutation } from '@/redux/services/authApi';
import { hp, wp } from '../../utils/responsiveDevice';

/**
 * One editable profile field. `key` is the name PATCH /auth/update-me expects
 * (see updateProfileSchema on the backend); `list` fields are sent as repeated
 * form entries so the backend coerces them into a string[].
 */
export interface EditableField {
    key: string;
    label: string;
    value: string;
    multiline?: boolean;
    list?: boolean;
    /** Read-only fields (email, SIRET once verified) show no edit affordance. */
    readOnly?: boolean;
}

/**
 * Profile editing shared by the host and cleaner profile screens: the current
 * user, an avatar picker, and a single-field editor backed by update-me.
 */
export const useProfileEditor = () => {
                                    const t = useT();
    const { data: me, isLoading } = useGetMeQuery();
    const [updateMe, { isLoading: isSaving }] = useUpdateMeMutation();

    const [editing, setEditing] = useState<EditableField | null>(null);
    const [draft, setDraft] = useState('');

    const openEditor = useCallback((field: EditableField) => {
        if (field.readOnly) return;
        setEditing(field);
        setDraft(field.value);
    }, []);

    const closeEditor = useCallback(() => {
        setEditing(null);
        setDraft('');
    }, []);

    const saveEditor = useCallback(async () => {
        if (!editing) return;
        const form = new FormData();
        if (editing.list) {
            // Multi-value fields (languages, servicesOffered) are entered one
            // per line and sent as repeated keys.
            draft
                .split(/[\n,]/)
                .map((entry) => entry.trim())
                .filter(Boolean)
                .forEach((entry) => form.append(editing.key, entry));
        } else {
            form.append(editing.key, draft.trim());
        }

        try {
            await updateMe(form).unwrap();
            showToast(t("Profile updated"), 'success');
            closeEditor();
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not save the change.")), 'error');
        }
    }, [editing, draft, updateMe, closeEditor, t]);

    /** Pick a new avatar and upload it as `profileImage`. */
    const changeAvatar = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            showToast(t("Photo permission is needed to change your picture."), 'error');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (result.canceled || !result.assets?.length) return;

        const asset = result.assets[0];
        const name = asset.fileName ?? asset.uri.split('/').pop() ?? 'avatar.jpg';
        const ext = name.split('.').pop()?.toLowerCase() ?? 'jpg';

        const form = new FormData();
        form.append('profileImage', {
            uri: asset.uri,
            name,
            type: asset.mimeType ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`,
        } as unknown as Blob);

        try {
            await updateMe(form).unwrap();
            showToast(t("Photo updated"), 'success');
        } catch (err) {
            showToast(getApiErrorMessage(err, t("Could not upload the photo.")), 'error');
        }
    }, [updateMe, t]);

    const editorModal = (
        <Modal visible={!!editing} transparent animationType="fade">
            <Pressable style={styles.backdrop} onPress={closeEditor}>
                <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
                    <Body5 color={Colors.PRIMARY_TEXT} style={{ marginBottom: hp(10) }}>
                        {editing?.label}
                    </Body5>
                    {editing?.list ? (
                        <Caption3 color={Colors.TEXT_COLOR} style={{ marginBottom: hp(8) }}>
                            {t("One per line.")}
                        </Caption3>
                    ) : null}
                    <View style={[styles.inputBox, editing?.multiline && styles.inputBoxTall]}>
                        <TextInput
                            style={[styles.input, editing?.multiline && styles.inputTall]}
                            value={draft}
                            onChangeText={setDraft}
                            multiline={editing?.multiline || editing?.list}
                            textAlignVertical={
                                editing?.multiline || editing?.list ? 'top' : 'center'
                            }
                            placeholder={editing?.label}
                            placeholderTextColor={Colors.PLACEHOLDER_TEXT}
                            autoCapitalize="none"
                        />
                    </View>
                    <CustomButton
                        title={isSaving ? 'Saving...' : 'Save'}
                        onPress={saveEditor}
                        disabled={isSaving}
                        width="100%"
                        height={hp(50)}
                        borderRadius={wp(8)}
                        backgroundColor={Colors.PRIMARY_TEXT}
                        color={Colors.TEXT_WHITE}
                    />
                </Pressable>
            </Pressable>
        </Modal>
    );

    return { me, isLoading, isSaving, openEditor, changeAvatar, editorModal };
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
    },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        borderWidth: 1,
        borderColor: Colors.BORDER_COLOR,
        paddingHorizontal: wp(14),
        marginBottom: hp(14),
    },
    inputBoxTall: { paddingVertical: hp(12) },
    input: {
        height: hp(50),
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
    },
    inputTall: { height: hp(140) },
});
