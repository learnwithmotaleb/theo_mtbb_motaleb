import { IMAGE_COMPONENTS } from "@/constants/image.index";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";

interface AnimatedSplashProps {
    onAnimationComplete: () => void;
}

export default function AnimatedSplash({ onAnimationComplete }: AnimatedSplashProps) {
    const scaleAnim = useRef(new Animated.Value(0.2)).current;  // একদম ছোট থেকে শুরু
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const bgOpacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Phase 1: ছোট → বড় (scale 0.2 → 1.8, তারপর settle হয় 1.4 এ)
        Animated.parallel([
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.8,   // বড় হয়
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1.4,   // একটু settle
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(() => {
            // Phase 2: একটু থামো, তারপর fade out
            setTimeout(() => {
                Animated.timing(bgOpacityAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    onAnimationComplete();
                });
            }, 400);
        });
    }, []);

    return (
        <Animated.View style={[StyleSheet.absoluteFill, styles.container, { opacity: bgOpacityAnim }]}>
            <Animated.Image
                source={IMAGE_COMPONENTS.homeLogo}
                style={[
                    styles.logo,
                    {
                        opacity: opacityAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}
                resizeMode="contain"
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FAFAFA",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        elevation: 999,
    },
    logo: {
        width: 120,
        height: 120,
    },
});