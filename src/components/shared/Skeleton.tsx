import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import { hp, wp } from '../../../utils/responsiveDevice';

/**
 * Loading placeholders shaped like the content they stand in for, so a screen
 * keeps its layout while data arrives instead of collapsing to a spinner.
 *
 * The pulse uses React Native's own Animated rather than Reanimated: it is a
 * single opacity driver on the native thread and needs no worklet setup.
 */
const usePulse = () => {
    const value = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(value, {
                    toValue: 1,
                    duration: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(value, {
                    toValue: 0.4,
                    duration: 700,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();
        return () => loop.stop();
    }, [value]);

    return value;
};

export function Skeleton({
    width = '100%',
    height = hp(14),
    radius = wp(6),
    style,
}: {
    width?: DimensionValue;
    height?: number;
    radius?: number;
    style?: ViewStyle | ViewStyle[];
}) {
    const opacity = usePulse();
    return (
        <Animated.View
            style={[
                styles.block,
                { width, height, borderRadius: radius, opacity },
                style as ViewStyle,
            ]}
        />
    );
}

/** A paragraph: full-width lines with a shorter last one. */
export function SkeletonText({
    lines = 3,
    style,
}: {
    lines?: number;
    style?: ViewStyle;
}) {
    return (
        <View style={[{ gap: hp(8) }, style]}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    width={i === lines - 1 ? '60%' : '100%'}
                    height={hp(12)}
                />
            ))}
        </View>
    );
}

/** Avatar + two lines — conversations, cleaner lists, client lists. */
export function SkeletonRow({ style }: { style?: ViewStyle }) {
    return (
        <View style={[styles.row, style]}>
            <Skeleton width={wp(52)} height={wp(52)} radius={wp(26)} />
            <View style={{ flex: 1, gap: hp(8) }}>
                <Skeleton width="55%" height={hp(13)} />
                <Skeleton width="80%" height={hp(11)} />
            </View>
        </View>
    );
}

/** Thumbnail + three lines — accommodations, missions, requests. */
export function SkeletonCard({ style }: { style?: ViewStyle }) {
    return (
        <View style={[styles.card, style]}>
            <Skeleton width={wp(100)} height={hp(100)} radius={wp(10)} />
            <View style={{ flex: 1, gap: hp(9) }}>
                <Skeleton width="70%" height={hp(14)} />
                <Skeleton width="90%" height={hp(11)} />
                <Skeleton width="45%" height={hp(11)} />
                <Skeleton width="60%" height={hp(11)} />
            </View>
        </View>
    );
}

/** Several cards or rows at once — the usual "list is loading" state. */
export function SkeletonList({
    count = 3,
    variant = 'card',
    style,
}: {
    count?: number;
    variant?: 'card' | 'row';
    style?: ViewStyle;
}) {
    const Item = variant === 'row' ? SkeletonRow : SkeletonCard;
    return (
        <View style={[{ gap: hp(12) }, style]}>
            {Array.from({ length: count }).map((_, i) => (
                <Item key={i} />
            ))}
        </View>
    );
}

/** The 2x2 grid of figures on the revenue and past-cleaning screens. */
export function SkeletonStats({
    count = 4,
    style,
}: {
    count?: number;
    style?: ViewStyle;
}) {
    return (
        <View style={[styles.stats, style]}>
            {Array.from({ length: count }).map((_, i) => (
                <View key={i} style={styles.statCard}>
                    <Skeleton width={wp(36)} height={wp(36)} radius={wp(18)} />
                    <Skeleton width="70%" height={hp(10)} />
                    <Skeleton width="45%" height={hp(14)} />
                </View>
            ))}
        </View>
    );
}

/** Hero image, title block and a couple of sections — detail screens. */
export function SkeletonDetail({ style }: { style?: ViewStyle }) {
    return (
        <View style={[{ gap: hp(16) }, style]}>
            <Skeleton width="100%" height={hp(180)} radius={wp(14)} />
            <View style={{ gap: hp(8) }}>
                <Skeleton width="60%" height={hp(16)} />
                <Skeleton width="40%" height={hp(11)} />
            </View>
            <View style={styles.card}>
                <View style={{ flex: 1, gap: hp(10) }}>
                    <Skeleton width="100%" height={hp(11)} />
                    <Skeleton width="85%" height={hp(11)} />
                    <Skeleton width="70%" height={hp(11)} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    block: { backgroundColor: Colors.BORDER_COLOR },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
    },
    card: {
        flexDirection: 'row',
        gap: wp(12),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(12),
    },
    stats: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(12),
    },
    statCard: {
        width: '47%',
        gap: hp(8),
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(12),
        padding: wp(14),
    },
});
