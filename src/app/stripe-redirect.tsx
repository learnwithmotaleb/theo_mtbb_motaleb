import { Redirect, useRouter } from 'expo-router';
import { useEffect } from 'react';

/**
 * gestlio://stripe-redirect — where the bank's 3-D Secure page returns to
 * during a card payment. Stripe's SDK resumes the payment itself (see the
 * URL handling in the root layout); this route only keeps the router from
 * showing "Unmatched route" and returns to the payment screen underneath.
 */
export default function StripeRedirect() {
    const router = useRouter();
    const canGoBack = router.canGoBack();

    useEffect(() => {
        if (canGoBack) router.back();
    }, [canGoBack, router]);

    return canGoBack ? null : <Redirect href="/" />;
}
