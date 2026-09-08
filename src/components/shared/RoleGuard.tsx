import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import { Colors } from '@/constants/theme';
import { useAppSelector } from '@/redux/hooks';

/**
 * Wraps a role's route tree so a signed-out user (or one signed in as the
 * other role) can never land inside it — reached by a deep link, a back
 * gesture after sign-out, or a 401 that cleared the session mid-session.
 */
export function RoleGuard({
  role,
  children,
}: {
  role: 'host' | 'cleaner';
  children: React.ReactNode;
}) {
  const { token, role: currentRole, isBootstrapped } = useAppSelector((s) => s.auth);

  // Still reading the keychain — render nothing routable yet, or we would
  // bounce a signed-in user to login for a frame.
  if (!isBootstrapped) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.APP_BACKGROUND,
        }}
      >
        <ActivityIndicator color={Colors.BRAND_PRIMARY} />
      </View>
    );
  }

  if (!token) return <Redirect href={'/(auth)/login' as never} />;

  // Signed in as the other role: send them to their own home instead.
  if (currentRole && currentRole !== role) {
    const home = currentRole === 'cleaner' ? '/cleaner/(tabs)' : '/host/(tabs)';
    return <Redirect href={home as never} />;
  }

  return <>{children}</>;
}
