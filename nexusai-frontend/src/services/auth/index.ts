import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: 'POST',
        body: credentials,
      }),
    }),
    getAuthMe: builder.query({
      query: () => API_ENDPOINTS.AUTH.ME,
      providesTags: ['AUTH_ME'],
    }),
  }),
});

export const { useLoginMutation, useGetAuthMeQuery } = authApi;
