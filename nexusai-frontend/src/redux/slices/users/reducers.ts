import { PayloadAction } from '@reduxjs/toolkit';
import { PAGINATION } from '@/config';

const setPageReducer = (state: any, action: PayloadAction<any>) => {
  state.page = action.payload;
};

const setPageLimitReducer = (state: any, action: PayloadAction<any>) => {
  state.pageLimit = action.payload;
};

const setSearchReducer = (state: any, action: PayloadAction<any>) => {
  state.search = action.payload.searchTerm;
  state.page = action.payload.page;
};

const setSelectedUsersReducer = (state: any, action: PayloadAction<any>) => {
  state.selectedUsers = action.payload;
};

const emptySelectedUsersReducer = (state: any) => {
  state.selectedUsers = [];
};

const setUsersTotalRecordsReducer = (state: any, action: PayloadAction<any>) => {
  state.totalRecords = action.payload;
};

const resetComponentStateReducer = (state: any) => {
  state.page = PAGINATION.CURRENT_PAGE;
  state.pageLimit = PAGINATION.PAGE_LIMIT;
  state.search = '';
  state.selectedUsers = [];
  state.totalRecords = PAGINATION.TOTAL_RECORDS;
  state.filterUsers = {};
};

const setFilterUsersReducer = (state: any, action: PayloadAction<any>) => {
  state.filterUsers = action.payload.filterValues;
  state.page = action.payload.page;
};

const emptyFilterUsersReducer = (state: any) => {
  state.filterUsers = {};
};

export const usersReducersList = {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  setSelectedUsersReducer,
  emptySelectedUsersReducer,
  setUsersTotalRecordsReducer,
  resetComponentStateReducer,
  setFilterUsersReducer,
  emptyFilterUsersReducer,
};
