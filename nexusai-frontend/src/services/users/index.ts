import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const usersApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsersList: builder.query({
      query: (params) => ({ url: API_ENDPOINTS.USERS.LIST, params }),
      providesTags: ['USERS'],
    }),
    getUserById: builder.query({
      query: (id: string) => API_ENDPOINTS.USERS.DETAIL(id),
      providesTags: ['USER_DETAIL'],
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.USERS.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['USERS'],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.USERS.UPDATE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['USERS', 'USER_DETAIL'],
    }),
    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: API_ENDPOINTS.USERS.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['USERS'],
    }),
  }),
});

export const {
  useGetUsersListQuery,
  useLazyGetUsersListQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
