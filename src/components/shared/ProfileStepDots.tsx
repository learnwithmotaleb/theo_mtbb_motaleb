import { Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { hp, wp } from '../../../utils/responsiveDevice';

interface ProfileStepDotsProps {
    total: number;
    filledCount: number; 
}

export function ProfileStepDots({ total, filledCount }: ProfileStepDotsProps) {
    return (
        <View style={styles.row}>
            {Array.from({ length: total }).map((_, i) => {
                const filled = i < filledCount;
                return (
                    <View
                        key={i}
                        style={[styles.dot, filled ? styles.dotFilled : styles.dotOutline]}
                    >
                        {/* Checkmark */}
                        <View style={styles.checkOuter}>
                            <View style={styles.checkInner} />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const DOT = wp(28);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        gap: wp(44),
        marginBottom: hp(20),
    },
    dot: {
        width: DOT,
        height: DOT,
        borderRadius: DOT / 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotFilled: {
        backgroundColor: Colors.COLOR_ACTIVE,
    },
    dotOutline: {
        borderWidth: 2,
        borderColor: Colors.COLOR_ACTIVE,
        backgroundColor: 'transparent',
    },
    checkOuter: {
        width: wp(10),
        height: wp(6),
        borderLeftWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: '#FFFFFF',
        transform: [{ rotate: '-45deg' }, { translateY: -wp(1.5) }],
    },
    checkInner: {},
});