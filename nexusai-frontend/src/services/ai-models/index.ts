import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const aiModelsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getAiModelsList: builder.query({
      query: (params) => ({ url: API_ENDPOINTS.AI_MODELS.LIST, params }),
      providesTags: ['AI_MODELS'],
    }),
    getAiModelById: builder.query({
      query: (id: string) => API_ENDPOINTS.AI_MODELS.DETAIL(id),
      providesTags: ['AI_MODEL_DETAIL'],
    }),
  }),
});

export const {
  useGetAiModelsListQuery,
  useLazyGetAiModelsListQuery,
  useGetAiModelByIdQuery,
} = aiModelsApi;
