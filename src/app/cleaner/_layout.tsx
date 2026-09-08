// src/app/cleaner/_layout.tsx
import { RoleGuard } from '@/components/shared/RoleGuard';
import { Stack } from 'expo-router';
import React from 'react';

export default function CleanerLayout() {
    return (
        <RoleGuard role="cleaner">
            <Stack screenOptions={{ headerShown: false }} />
        </RoleGuard>
    );
}
