import { Caption4 } from '@/components/typo/Typography';
import { useT } from '@/i18n';
import { cleaningBadge } from '@/lib/cleaningStatus';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

/** The cleaning's status as a small coloured pill (same everywhere in the cleaner app). */
export function CleaningStatusBadge({
    status,
    style,
}: {
    status?: string | null;
    style?: ViewStyle;
}) {
    const t = useT();
    const badge = cleaningBadge(status);
    if (!badge) return null;

    return (
        <View style={[styles.pill, { backgroundColor: badge.background }, style]}>
            <View style={[styles.dot, { backgroundColor: badge.color }]} />
            <Caption4 color={badge.color} numberOfLines={1}>
                {t(badge.label)}
            </Caption4>
        </View>
    );
}

const styles = StyleSheet.create({
    pill: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(5),
        paddingHorizontal: wp(9),
        paddingVertical: hp(3),
        borderRadius: wp(20),
        marginTop: hp(2),
    },
    dot: {
        width: wp(6),
        height: wp(6),
        borderRadius: wp(3),
    },
});
