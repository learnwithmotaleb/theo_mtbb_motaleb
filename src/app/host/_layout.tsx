import { Stack } from 'expo-router';
import React from 'react';

export default function HostLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }} />
    );
}