import { SkeletonText } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body2, Body4, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
// import { Image } from 'expo-image';
// import { useRouter } from 'expo-router';
import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import { CameraIcon } from '@/assets/icons/host_icon/CameraIcon';
import { IMAGE_COMPONENTS } from '@/constants/image.index';
import { EditableField, useProfileEditor } from '@/hooks/useProfileEditor';
import { imageSource, personName } from '@/lib/mappers';
import { AppImage } from '@/components/shared/AppImage';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function InfoRow({
    field,
    onEdit,
}: {
    field: EditableField;
    onEdit: (field: EditableField) => void;
}) {
    return (
        <View style={infoStyles.row}>
            <View style={{ flex: 1 }}>
                <Caption5 color={Colors.TEXT_COLOR}>{field.label}:</Caption5>
                <Caption3 color={Colors.PRIMARY_TEXT}>{field.value || '—'}</Caption3>
            </View>
            {!field.readOnly && (
                <Pressable hitSlop={8} onPress={() => onEdit(field)}>
                    <EditPenIcon size={18} color={Colors.COLOR_ACTIVE} />
                </Pressable>
            )}
        </View>
    );
}

export default function PersonalInformationScreen() {
    const t = useT();
    const { me, isLoading, openEditor, changeAvatar, editorModal } = useProfileEditor();

    // Field keys match PATCH /auth/update-me's schema.
    const personalInfo = useMemo<EditableField[]>(
        () => [
            { key: 'firstName', label: t("First name"), value: me?.firstName ?? '' },
            { key: 'lastName', label: t("Last name"), value: me?.lastName ?? '' },
            {
                key: 'biography',
                label: t("About"),
                value: (me?.biography as string) ?? (me?.about as string) ?? '',
                multiline: true,
            },
            {
                key: 'siretNumber',
                label: t("SIRET Number"),
                value: (me?.siretNumber as string) ?? '',
            },
            // The email identifies the account and cannot be changed here.
            { key: 'email', label: t("Email"), value: me?.email ?? '', readOnly: true },
            { key: 'phone', label: t("Phone number"), value: me?.phone ?? '' },
            {
                key: 'servicesOffered',
                label: t("Services"),
                value: (me?.servicesOffered ?? []).join('\n'),
                list: true,
            },
            {
                key: 'languages',
                label: t("Spoken Language"),
                value: (me?.languages ?? []).join('\n'),
                list: true,
            },
        ],
        [me, t],
    );

    const addressInfo = useMemo<EditableField[]>(
        () => [
            { key: 'address', label: t("Address"), value: me?.address ?? '' },
            { key: 'city', label: t("City"), value: me?.city ?? '' },
            { key: 'zipCode', label: t("Zip code"), value: me?.zipCode ?? '' },
            { key: 'country', label: t("Country"), value: me?.country ?? '' },
        ],
        [me, t],
    );

    if (isLoading && !me) {
        return (
            <SafeAreaView style={[infoStyles.safe, { paddingTop: hp(16) }]}>
                <SkeletonText lines={6} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={infoStyles.safe}>
            <SectionTitle title={t("Profile")} />
            <ScrollView contentContainerStyle={infoStyles.scroll} showsVerticalScrollIndicator={false}>

                {/* Avatar + name + description */}
                <View style={infoStyles.profileHeader}>
                    <View style={infoStyles.avatarWrapper}>
                        <View style={[infoStyles.avatar, { backgroundColor: Colors.BORDER_COLOR }]} >
                            <AppImage
                                source={imageSource(me?.profileImage, IMAGE_COMPONENTS.cleanerPP)}
                                style={{ height: 80, width: 80 }}
                                contentFit="cover"
                            />
                        </View>

                        <Pressable style={infoStyles.cameraBtn} onPress={changeAvatar}>
                            <CameraIcon size={12} />
                        </Pressable>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Body2 color={Colors.PRIMARY_TEXT}>{personName(me, 'My profile')}</Body2>
                        <Caption5 color={Colors.TEXT_COLOR}>
                            {t("Your personal information is used to manage your account and improve your experience.")}
                        </Caption5>
                    </View>
                </View>

                {/* Personal Info section */}
                <Body4 color={Colors.COLOR_ACTIVE} style={infoStyles.sectionLabel}>
                    {t("Personal Info:")}
                </Body4>
                <View style={infoStyles.card}>
                    {personalInfo.map((item) => (
                        <InfoRow key={item.key} field={item} onEdit={openEditor} />
                    ))}
                </View>

                {/* Address section */}
                <Body4 color={Colors.COLOR_ACTIVE} style={infoStyles.sectionLabel}>
                    {t("Address:")}
                </Body4>
                <View style={infoStyles.card}>
                    {addressInfo.map((item) => (
                        <InfoRow key={item.key} field={item} onEdit={openEditor} />
                    ))}
                </View>

            </ScrollView>

            {editorModal}
        </SafeAreaView>
    );
}

const infoStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: wp(12),
        marginVertical: hp(16),
    },
    avatarWrapper: { position: 'relative' },
    avatar: { width: wp(72), height: wp(72), borderRadius: wp(36) },
    cameraBtn: {
        position: 'absolute',
        bottom: 0, right: 0,
        width: wp(22), height: wp(22),
        borderRadius: wp(11),
        backgroundColor: Colors.COLOR_ACTIVE,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 1.5, borderColor: Colors.APP_BACKGROUND,
    },
    sectionLabel: { marginBottom: hp(8), marginTop: hp(4) },
    card: {
        // backgroundColor: Colors.INPUT_BACKGROUND,
        // borderRadius: wp(14),
        // borderWidth: 1,
        // borderColor: Colors.BORDER_COLOR,
        // overflow: 'hidden',
        marginBottom: hp(16),
    },
    row: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(14),
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        gap: wp(8),
        marginBottom:hp(10)
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});