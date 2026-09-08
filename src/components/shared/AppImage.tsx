import { Image, ImageProps } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ImagePlaceholderIcon } from '@/assets/icons/common_icon/ImagePlaceholderIcon';
import { Colors } from '@/constants/theme';

/**
 * A light grey block shown while a remote image is still downloading, so a
 * card never flashes an empty hole first.
 */
const LOADING_BLURHASH = 'L6Pj0^i_.AyE_3t7t7R**0o#DgR4';

type Props = ImageProps & {
    /** Rendered instead of the neutral placeholder when loading fails. */
    fallback?: ImageProps['source'];
};

/**
 * `expo-image` with a placeholder for the two cases the raw component leaves
 * blank: a source that is missing, and a URL that exists but fails to load
 * (deleted upload, offline, 404). The mappers already substitute a contextual
 * image when the backend sends no path at all; this covers everything after.
 */
export function AppImage({ source, fallback, onError, style, ...rest }: Props) {
    const [failed, setFailed] = useState(false);

    // A recycled row can be handed a new source; the old failure must not stick.
    useEffect(() => {
        setFailed(false);
    }, [source]);

    const hasSource =
        !!source &&
        !(typeof source === 'object' && 'uri' in source && !(source as any).uri);

    if ((failed || !hasSource) && !fallback) {
        return (
            <View style={[styles.placeholder, style as any]}>
                <ImagePlaceholderIcon size={22} color={Colors.PLACEHOLDER_TEXT} />
            </View>
        );
    }

    return (
        <Image
            {...rest}
            style={style}
            source={failed ? fallback : source}
            placeholder={{ blurhash: LOADING_BLURHASH }}
            transition={150}
            onError={(event) => {
                setFailed(true);
                onError?.(event);
            }}
        />
    );
}

const styles = StyleSheet.create({
    placeholder: {
        backgroundColor: Colors.INPUT_BACKGROUND,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
