import { Redirect } from 'expo-router';

/**
 * gestlio://payouts/return — where Stripe's return page (backend
 * /stripe/connect/return) sends the cleaner after payout onboarding.
 * Normally the auth session catches this URL and closes itself; this route
 * only exists so a deep link that reaches the router lands on the payout
 * screen instead of "Unmatched route".
 */
export default function PayoutsReturn() {
    return <Redirect href="/cleaner/profile/payment" />;
}
