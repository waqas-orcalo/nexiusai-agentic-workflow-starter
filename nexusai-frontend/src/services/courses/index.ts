import { baseAPI } from '@/services/base-api';
import { API_ENDPOINTS } from '@/constants/api';

const coursesApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesList: builder.query({
      query: (params) => ({ url: API_ENDPOINTS.COURSES.LIST, params }),
      providesTags: ['COURSES'],
    }),
    getCourseById: builder.query({
      query: (id: string) => API_ENDPOINTS.COURSES.DETAIL(id),
      providesTags: ['COURSE_DETAIL'],
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.COURSES.CREATE,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['COURSES'],
    }),
    updateCourse: builder.mutation({
      query: ({ id, ...data }) => ({
        url: API_ENDPOINTS.COURSES.UPDATE(id),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['COURSES', 'COURSE_DETAIL'],
    }),
    deleteCourse: builder.mutation({
      query: (id: string) => ({
        url: API_ENDPOINTS.COURSES.DELETE(id),
        method: 'DELETE',
      }),
      invalidatesTags: ['COURSES'],
    }),
  }),
});

export const {
  useGetCoursesListQuery,
  useLazyGetCoursesListQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi;
