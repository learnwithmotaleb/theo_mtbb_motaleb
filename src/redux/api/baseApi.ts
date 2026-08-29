// RTK Query setup — পরে use করার জন্য ready রাখা হয়েছে
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.gestlio.com',
        // পরে token header যোগ হবে
        // prepareHeaders: (headers, { getState }) => {
        //     const token = (getState() as RootState).auth.token;
        //     if (token) headers.set('Authorization', `Bearer ${token}`);
        //     return headers;
        // },
    }),
    endpoints: () => ({}),
});