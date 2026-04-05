import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const agentsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAgentsList: builder.query({
      query: (params) => ({ url: API_ENDPOINTS.AGENTS.LIST, params }),
      providesTags: ['AGENTS'],
    }),
    getAgentById: builder.query({
      query: (id: string) => API_ENDPOINTS.AGENTS.DETAIL(id),
      providesTags: ['AGENT_DETAIL'],
    }),
  }),
});

export const {
  useGetAgentsListQuery,
  useLazyGetAgentsListQuery,
  useGetAgentByIdQuery,
} = agentsApi;
