import { SkeletonText } from '@/components/shared/Skeleton';
import { useT } from '@/i18n';
import { EditPenIcon } from '@/assets/icons/common_icon/EditPenIcon';
import SectionTitle from '@/components/shared/SectionTitle';
import { Body4, Caption3, Caption5 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import { EditableField, useProfileEditor } from '@/hooks/useProfileEditor';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hp, wp } from '../../../../utils/responsiveDevice';

function InfoRow({
    field,
    onEdit,
}: {
    field: EditableField;
    onEdit: () => void;
}) {
    return (
        <View style={aboutStyles.row}>
            <View style={{ flex: 1 }}>
                <Caption3 color={Colors.TEXT_COLOR}>{field.label}</Caption3>
                <Caption5 color={Colors.PRIMARY_TEXT}>{field.value}</Caption5>
            </View>
            <Pressable hitSlop={8} onPress={onEdit}>
                <EditPenIcon size={18} color={Colors.COLOR_ACTIVE} />
            </Pressable>
        </View>
    );
}

export default function AboutMeScreen() {
    const t = useT();
    const { me, isLoading, openEditor, editorModal } = useProfileEditor();

    // These three are the cleaner's public-facing profile; hosts see them on
    // the housekeeper detail screen.
    const publicInfo = useMemo<EditableField[]>(
        () => [
            {
                key: 'biography',
                label: t("About"),
                value:
                    me?.biography ||
                    // `about` only exists on older profiles; it is not typed.
                    (me?.about as string | undefined) ||
                    t("Tell hosts about yourself."),
                multiline: true,
            },
            {
                key: 'servicesOffered',
                label: t("Services"),
                value: (me?.servicesOffered ?? []).join('\n') || t("No service listed yet."),
                multiline: true,
                list: true,
            },
            {
                key: 'languages',
                label: t("Spoken Language"),
                value: (me?.languages ?? []).join(', ') || t("No language listed yet."),
                list: true,
            },
        ],
        [me, t],
    );

    return (
        <SafeAreaView style={aboutStyles.safe}>
            <SectionTitle title={t("About Me")} />
            <ScrollView contentContainerStyle={aboutStyles.scroll} showsVerticalScrollIndicator={false}>

                <Body4 color={Colors.COLOR_ACTIVE} style={aboutStyles.sectionLabel}>
                    {t("Public Info:")}
                </Body4>
                {isLoading && !me ? (
                    <SkeletonText lines={6} />
                ) : (
                    <View style={aboutStyles.card}>
                        {publicInfo.map((field) => (
                            <InfoRow
                                key={field.key}
                                field={field}
                                onEdit={() =>
                                    openEditor({
                                        ...field,
                                        // Placeholders must not be pushed back
                                        // into the editor as real content.
                                        value: field.list
                                            ? (
                                                  (me?.[field.key] as string[]) ?? []
                                              ).join('\n')
                                            : (me?.biography ?? ''),
                                    })
                                }
                            />
                        ))}
                    </View>
                )}

            </ScrollView>
            {editorModal}
        </SafeAreaView>
    );
}

const aboutStyles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: Colors.APP_BACKGROUND, paddingHorizontal: wp(20) },
    scroll: { paddingBottom: hp(40) },
    sectionLabel: { marginBottom: hp(8), marginTop: hp(16) },
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
        paddingVertical: hp(20),
        gap: wp(8),
        marginBottom:hp(10)
    },
    divider: { height: 1, backgroundColor: Colors.BORDER_COLOR },
});