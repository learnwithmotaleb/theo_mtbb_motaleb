import { RoleGuard } from '@/components/shared/RoleGuard';
import { Stack } from 'expo-router';
import React from 'react';

export default function HostLayout() {
    return (
        <RoleGuard role="host">
            <Stack screenOptions={{ headerShown: false }} />
        </RoleGuard>
    );
}
