import { useEffect } from 'react';
import { useLazyGetUsersListQuery } from '@/services/users';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import {
  usersPageSelector,
  usersPageLimitSelector,
  usersSearchSelector,
  usersTotalRecordsSelector,
} from '@/redux/slices/users/selectors';
import { setUsersTotalRecords } from '@/redux/slices/users/slice';
import { errorSnackbar, getErrorMessage } from '@/utils/api';

const useGetUsersList = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(usersPageSelector);
  const pageLimit = useAppSelector(usersPageLimitSelector);
  const search = useAppSelector(usersSearchSelector);
  const totalRecords = useAppSelector(usersTotalRecordsSelector);

  const [lazyGetUsersList, { data, isLoading, isFetching }] = useLazyGetUsersListQuery();

  const getUsersList = async (currentPage = page) => {
    try {
      const response = await lazyGetUsersList({
        page: currentPage,
        limit: pageLimit,
        search,
      }).unwrap();

      if (response?.meta?.total !== undefined) {
        dispatch(setUsersTotalRecords(response.meta.total));
      }
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    }
  };

  useEffect(() => {
    getUsersList(page);
  }, [page, pageLimit, search]);

  return {
    users: data?.data || [],
    loading: isLoading || isFetching,
    totalRecords,
    page,
    pageLimit,
    search,
    getUsersList,
  };
};

export default useGetUsersList;
