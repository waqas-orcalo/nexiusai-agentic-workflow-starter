import { BASE_URL } from '@/config';
import { AUTH_TOKEN_BYPASS_API } from '@/constants/strings';
import { RootState } from '@/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const TAGS = [
  'USERS',
  'USER_DETAIL',
  'COURSES',
  'COURSE_DETAIL',
  'AUTH_ME',
] as const;

const BYPASS_AUTH_API_ROUTES = [
  AUTH_TOKEN_BYPASS_API.LOGIN,
  AUTH_TOKEN_BYPASS_API.REGISTER,
];

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState, endpoint }) => {
    const token = (getState() as RootState)?.auth?.accessToken;
    if (token && !BYPASS_AUTH_API_ROUTES.includes(endpoint as any)) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseAPI = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: TAGS,
  endpoints: () => ({}),
});

export const clearApiCache = baseAPI.util.resetApiState;
