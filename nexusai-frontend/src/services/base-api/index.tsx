import { BASE_URL } from '@/config';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const TAGS = [
  'AI_MODELS',
  'AI_MODEL_DETAIL',
  'AGENTS',
  'AGENT_DETAIL',
] as const;

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
});

export const baseAPI = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: TAGS,
  endpoints: () => ({}),
});

export const clearApiCache = baseAPI.util.resetApiState;
