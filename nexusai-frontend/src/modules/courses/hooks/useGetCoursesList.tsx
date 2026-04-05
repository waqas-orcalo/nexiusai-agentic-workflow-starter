import { useEffect } from 'react';
import { useLazyGetCoursesListQuery } from '@/services/courses';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  coursesPageSelector,
  coursesPageLimitSelector,
  coursesSearchSelector,
  coursesTotalRecordsSelector,
} from '@/redux/slices/courses/selectors';
import { setCoursesTotalRecords } from '@/redux/slices/courses/slice';
import { errorSnackbar, getErrorMessage } from '@/utils/api';

const useGetCoursesList = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(coursesPageSelector);
  const pageLimit = useAppSelector(coursesPageLimitSelector);
  const search = useAppSelector(coursesSearchSelector);
  const totalRecords = useAppSelector(coursesTotalRecordsSelector);

  const [lazyGetCoursesList, { data, isLoading, isFetching }] = useLazyGetCoursesListQuery();

  const getCoursesList = async (currentPage = page) => {
    try {
      const response = await lazyGetCoursesList({
        page: currentPage,
        limit: pageLimit,
        search,
      }).unwrap();

      if (response?.meta?.total !== undefined) {
        dispatch(setCoursesTotalRecords(response.meta.total));
      }
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    }
  };

  useEffect(() => {
    getCoursesList(page);
  }, [page, pageLimit, search]);

  return {
    courses: data?.data || [],
    loading: isLoading || isFetching,
    totalRecords,
    page,
    pageLimit,
    search,
    getCoursesList,
  };
};

export default useGetCoursesList;
