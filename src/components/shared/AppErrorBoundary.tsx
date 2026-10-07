import { t } from '@/i18n';
import type { ErrorBoundaryProps } from 'expo-router';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Last line of defence for render errors. In a release build an uncaught
 * render error terminates the app ("Gestlio keeps stopping"); with this
 * boundary the user sees a recovery screen and can try again instead.
 *
 * It renders outside the redux Provider and the font loader, so it uses the
 * module-level `t()` and system fonts only.
 */
export function AppErrorBoundary({ error, retry }: ErrorBoundaryProps) {
    useEffect(() => {
        console.error('[AppErrorBoundary]', error);
    }, [error]);

    return (
        <View style={styles.root}>
            <Text style={styles.title}>{t('Something went wrong')}</Text>
            <Text style={styles.body}>
                {t('The screen could not be displayed. Please try again.')}
            </Text>
            {__DEV__ ? <Text style={styles.detail}>{String(error?.message ?? error)}</Text> : null}
            <Pressable style={styles.button} onPress={() => retry()} accessibilityRole="button">
                <Text style={styles.buttonText}>{t('Try again')}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#FAFAFA',
    },
    title: { fontSize: 20, fontWeight: '600', color: '#1A1A1A', marginBottom: 8 },
    body: { fontSize: 14, color: '#606060', textAlign: 'center', marginBottom: 24 },
    detail: { fontSize: 12, color: '#FF383C', textAlign: 'center', marginBottom: 16 },
    button: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        paddingVertical: 14,
        paddingHorizontal: 32,
    },
    buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
