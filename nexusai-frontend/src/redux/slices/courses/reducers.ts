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

const setSelectedCoursesReducer = (state: any, action: PayloadAction<any>) => {
  state.selectedCourses = action.payload;
};

const emptySelectedCoursesReducer = (state: any) => {
  state.selectedCourses = [];
};

const setCoursesTotalRecordsReducer = (state: any, action: PayloadAction<any>) => {
  state.totalRecords = action.payload;
};

const resetComponentStateReducer = (state: any) => {
  state.page = PAGINATION.CURRENT_PAGE;
  state.pageLimit = PAGINATION.PAGE_LIMIT;
  state.search = '';
  state.selectedCourses = [];
  state.totalRecords = PAGINATION.TOTAL_RECORDS;
  state.filterCourses = {};
};

const setFilterCoursesReducer = (state: any, action: PayloadAction<any>) => {
  state.filterCourses = action.payload.filterValues;
  state.page = action.payload.page;
};

const emptyFilterCoursesReducer = (state: any) => {
  state.filterCourses = {};
};

export const coursesReducersList = {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  setSelectedCoursesReducer,
  emptySelectedCoursesReducer,
  setCoursesTotalRecordsReducer,
  resetComponentStateReducer,
  setFilterCoursesReducer,
  emptyFilterCoursesReducer,
};
