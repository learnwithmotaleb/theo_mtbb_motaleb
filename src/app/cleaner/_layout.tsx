// src/app/cleaner/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function CleanerLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}