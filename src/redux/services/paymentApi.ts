import { baseApi } from '../api/baseApi';
import type { ApiEnvelope, Paginated } from '../types';

export interface Payment {
  _id: string;
  schedule: string;
  host: any;
  cleaner: any;
  accommodation: any;
  amount: number;
  currency: string;
  platformFee: number;
  cleanerAmount: number;
  status: 'pending' | 'paid_held' | 'released' | 'refunded' | 'failed';
  createdAt: string;
  updatedAt: string;
}

/**
 * Whole-dataset summary the backend computes for /payment/my (not just the
 * current page), so the summary cards stay correct regardless of pagination.
 */
export interface PaymentSummary {
  count: number;
  totalAmount: number;
  averageAmount: number;
  currency: string;
}

export type MyPayments = Paginated<Payment> & { summary: PaymentSummary };

/** Everything the Stripe PaymentSheet needs. All amounts are in cents. */
export interface PayIntent {
  paymentId: string;
  paymentIntentClientSecret: string;
  ephemeralKey: string;
  customerId: string;
  publishableKey: string;
  /** Total charged to the host: cleanerAmount + platformFee. */
  amount: number;
  /** The cleaner's rate — paid out to them in full. */
  cleanerAmount: number;
  /** Platform commission, charged on top of the cleaner's rate. */
  platformFee: number;
  feePercent: number;
  currency: string;
}

export interface RevenueTransaction {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  scheduleStatus: string | null;
  date: string | null;
  checkInTime: string | null;
  checkOutTime: string | null;
  accommodation: {
    _id: string;
    name: string;
    city: string;
    address: string;
    photo: string | null;
  } | null;
  releasedAt: string;
}

export interface RevenueGraphPoint {
  year: number;
  month: number;
  label: string;
  total: number;
}

export interface Revenue {
  currency: string;
  thisMonth: { year: number; month: number; revenue: number };
  upcoming: number;
  graph: RevenueGraphPoint[];
  transactions: RevenueTransaction[];
  meta: { page: number; limit: number; total: number; totalPage: number };
}

export interface TransactionDetail {
  _id: string;
  status: string;
  currency: string;
  amount: number;
  platformFee: number;
  cleanerAmount: number;
  /** The signed-in side's share: the host sees `amount`, the cleaner their cut. */
  yourAmount: number;
  releasedAt: string | null;
  createdAt: string;
  accommodation: any;
  schedule: any;
  host: any;
  cleaner: any;
}

/** GET /payment/connect/status — the cleaner's Stripe Connect payout state. */
export interface ConnectStatus {
  /** True once Stripe reports both details submitted and payouts enabled. */
  onboarded: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  /** Present only before onboarding has been started at all. */
  message?: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ── Host: pay for an accepted schedule ────────────────────────────────────
    /**
     * Creates the PaymentIntent. The schedule must already be accepted by the
     * cleaner; the money is held in escrow until the host validates the job.
     */
    payForSchedule: builder.mutation<PayIntent, string>({
      query: (scheduleId) => ({
        url: `/payment/schedule/${scheduleId}/pay`,
        method: 'POST',
      }),
      transformResponse: (res: ApiEnvelope<PayIntent>) => res.data,
      invalidatesTags: ['Payment', 'Schedule', 'Calendar', 'HostDashboard'],
    }),

    // ── Cleaner: payout onboarding ────────────────────────────────────────────
    /**
     * Starts (or continues) Stripe Connect onboarding and returns the hosted
     * onboarding URL — open it with expo-web-browser, then refetch
     * `getConnectStatus` when the browser closes. `country` is an optional
     * ISO-2 code; the backend falls back to the cleaner's profile country.
     */
    createConnectAccount: builder.mutation<
      { url: string; accountId?: string },
      { country?: string } | void
    >({
      query: (body) => ({
        url: '/payment/connect/onboard',
        method: 'POST',
        body: body ?? {},
      }),
      transformResponse: (res: ApiEnvelope<{ url: string; accountId?: string }>) =>
        res.data,
      invalidatesTags: ['Payment', 'Me'],
    }),

    getConnectStatus: builder.query<ConnectStatus, void>({
      query: () => '/payment/connect/status',
      transformResponse: (res: ApiEnvelope<ConnectStatus>) => res.data,
      providesTags: ['Payment'],
    }),

    // ── Listings (host and cleaner) ───────────────────────────────────────────
    getMyPayments: builder.query<
      MyPayments,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/payment/my', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<MyPayments>) => res.data,
      providesTags: ['Payment'],
    }),

    /** Revenue summary + monthly graph + paginated transactions. */
    getRevenue: builder.query<
      Revenue,
      { year?: number; month?: number; page?: number; limit?: number } | void
    >({
      query: (params) => ({ url: '/payment/revenue', params: params ?? {} }),
      transformResponse: (res: ApiEnvelope<Revenue>) => res.data,
      providesTags: ['Payment'],
    }),

    getTransactionDetail: builder.query<TransactionDetail, string>({
      query: (id) => `/payment/transaction/${id}`,
      transformResponse: (res: ApiEnvelope<TransactionDetail>) => res.data,
      providesTags: (_r, _e, id) => [{ type: 'Payment', id }, 'Payment'],
    }),
  }),
  overrideExisting: true,
});

export const {
  usePayForScheduleMutation,
  useCreateConnectAccountMutation,
  useGetConnectStatusQuery,
  useGetMyPaymentsQuery,
  useGetRevenueQuery,
  useGetTransactionDetailQuery,
} = paymentApi;
