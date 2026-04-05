import { createSlice } from '@reduxjs/toolkit';
import { PAGINATION } from '@/config';
import { usersReducersList } from './reducers';

const {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  setSelectedUsersReducer,
  emptySelectedUsersReducer,
  setUsersTotalRecordsReducer,
  resetComponentStateReducer,
  setFilterUsersReducer,
  emptyFilterUsersReducer,
} = usersReducersList;

const usersInitialState: any = {
  page: PAGINATION.CURRENT_PAGE,
  pageLimit: PAGINATION.PAGE_LIMIT,
  search: '',
  selectedUsers: [],
  filterUsers: {},
  totalRecords: PAGINATION.TOTAL_RECORDS,
};

const usersSlice = createSlice({
  name: 'users',
  initialState: usersInitialState,
  reducers: {
    setPage: setPageReducer,
    setPageLimit: setPageLimitReducer,
    setSearch: setSearchReducer,
    setSelectedUsers: setSelectedUsersReducer,
    emptySelectedUsers: emptySelectedUsersReducer,
    setUsersTotalRecords: setUsersTotalRecordsReducer,
    resetComponentState: resetComponentStateReducer,
    setFilterUsers: setFilterUsersReducer,
    emptyFilterUsers: emptyFilterUsersReducer,
  },
});

export const {
  setPage,
  setPageLimit,
  setSearch,
  setSelectedUsers,
  emptySelectedUsers,
  setUsersTotalRecords,
  resetComponentState,
  setFilterUsers,
  emptyFilterUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
