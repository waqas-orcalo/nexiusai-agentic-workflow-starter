import { RootState } from '@/redux/store';

export const usersPageSelector = (state: RootState) => state.users.page;
export const usersPageLimitSelector = (state: RootState) => state.users.pageLimit;
export const usersSearchSelector = (state: RootState) => state.users.search;
export const usersTotalRecordsSelector = (state: RootState) => state.users.totalRecords;
export const usersSelectedSelector = (state: RootState) => state.users.selectedUsers;
export const usersFilterSelector = (state: RootState) => state.users.filterUsers;
