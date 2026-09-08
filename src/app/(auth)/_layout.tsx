import { Stack } from 'expo-router';
import React from 'react';

// No redirect here: the root layout already routes a restored session to its
// role home, and the signup flow deliberately runs while a (roleless) token
// exists — bouncing on `token` alone would break verify-otp -> role_select.
export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
