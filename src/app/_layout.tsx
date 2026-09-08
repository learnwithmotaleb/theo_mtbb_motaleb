import AnimatedSplash from '@/components/AnimatedSplash';
import { LocaleProvider } from '@/components/shared/LocaleProvider';
import Toast from '@/components/shared/Toast';
import { useSessionBootstrap } from '@/hooks/useSession';
import { store } from '@/redux/store';
import {
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    useFonts,
} from '@expo-google-fonts/poppins';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import { useColorScheme, View } from 'react-native';
import { Provider } from 'react-redux';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const [showAnimatedSplash, setShowAnimatedSplash] = useState(false);
    // The splash animation and the session restore run at the same time; we
    // navigate only once both have finished, so the first screen is final.
    const [splashDone, setSplashDone] = useState(false);
    const hasNavigated = useRef(false);

    const { isBootstrapped, isAuthenticated, homeRoute } = useSessionBootstrap();

    const [fontsLoaded, fontError] = useFonts({
        Poppins_400Regular,
        Poppins_400Regular_Italic,
        Poppins_500Medium,
        Poppins_500Medium_Italic,
        Poppins_600SemiBold,
        Poppins_600SemiBold_Italic,
        Poppins_700Bold,
        Poppins_700Bold_Italic,
        Poppins_800ExtraBold,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            SplashScreen.hideAsync().then(() => {
                setShowAnimatedSplash(true);
            });
        }
    }, [fontsLoaded, fontError]);

    // Restored session -> straight to that role's home. Otherwise sign in.
    useEffect(() => {
        if (!splashDone || !isBootstrapped || hasNavigated.current) return;
        hasNavigated.current = true;
        setShowAnimatedSplash(false);
        router.replace((isAuthenticated ? homeRoute : '/(auth)/login') as never);
    }, [splashDone, isBootstrapped, isAuthenticated, homeRoute]);

    if (!fontsLoaded && !fontError) return null;

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <View style={{ flex: 1 }}>
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="(auth)" />
                    <Stack.Screen name="host" />
                    <Stack.Screen name="cleaner" />
                </Stack>

                {showAnimatedSplash && (
                    <AnimatedSplash onAnimationComplete={() => setSplashDone(true)} />
                )}

                <Toast />
            </View>
        </ThemeProvider>
    );
}

export default function RootLayout() {
    return (
        <Provider store={store}>
            {/*
             * The publishable key also travels with every PaymentIntent, and
             * the payment screen re-inits Stripe with it before opening the
             * sheet — so a missing env var degrades to "card pay is
             * unavailable until the intent arrives", never to a crash.
             */}
            <StripeProvider
                publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}
            >
                <LocaleProvider>
                    <RootLayoutNav />
                </LocaleProvider>
            </StripeProvider>
        </Provider>
    );
}
