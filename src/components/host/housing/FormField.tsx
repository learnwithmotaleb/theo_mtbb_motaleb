import { Body6, Caption3 } from '@/components/typo/Typography';
import { Colors } from '@/constants/theme';
import React from 'react';
import { LayoutChangeEvent, StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { hp, wp } from '../../../../utils/responsiveDevice';

interface Props extends Omit<TextInputProps, 'onLayout'> {
    label: string;
    /** Adds a red ✱ after the label. */
    required?: boolean;
    /** Shown under the field, which turns red. */
    error?: string | null;
    /** Grey help line under the field (hidden while there is an error). */
    hint?: string | null;
    /** Layout of the whole field (label included), for scrolling back to it. */
    onLayout?: (event: LayoutChangeEvent) => void;
}

export function FormField({ label, required, error, hint, onLayout, ...rest }: Props) {
    return (
        <View style={styles.wrapper} onLayout={onLayout}>
            <Body6 color={Colors.PRIMARY_TEXT} style={styles.label}>
                {label}
                {required && <Body6 color={Colors.COLOR_DANGER}> ✱</Body6>}
            </Body6>
            <View style={[styles.inputBox, !!error && styles.inputBoxError]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.TEXT_COLOR}
                    accessibilityHint={error ?? undefined}
                    {...rest}
                />
            </View>
            {error ? (
                <Caption3 color={Colors.COLOR_DANGER} style={styles.helper}>
                    {error}
                </Caption3>
            ) : hint ? (
                <Caption3 color={Colors.TEXT_COLOR} style={styles.helper}>
                    {hint}
                </Caption3>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { marginBottom: hp(20) },
    label: { marginBottom: hp(8), fontFamily: 'Poppins_500Medium' },
    inputBox: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        borderRadius: wp(10),
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        borderWidth: 1,
        borderColor: 'transparent',
    },
    // Same look as FormDropdown's error state.
    inputBoxError: { borderColor: Colors.COLOR_DANGER, backgroundColor: '#FF383C0D' },
    input: {
        fontSize: 13,
        color: Colors.PRIMARY_TEXT,
        fontFamily: 'Poppins_400Regular',
        padding: 0,
    },
    helper: { marginTop: hp(6) },
});
