import { createSlice } from '@reduxjs/toolkit';
import { PAGINATION } from '@/config';
import { coursesReducersList } from './reducers';

const {
  setPageReducer,
  setPageLimitReducer,
  setSearchReducer,
  setSelectedCoursesReducer,
  emptySelectedCoursesReducer,
  setCoursesTotalRecordsReducer,
  resetComponentStateReducer,
  setFilterCoursesReducer,
  emptyFilterCoursesReducer,
} = coursesReducersList;

const coursesInitialState: any = {
  page: PAGINATION.CURRENT_PAGE,
  pageLimit: PAGINATION.PAGE_LIMIT,
  search: '',
  selectedCourses: [],
  filterCourses: {},
  totalRecords: PAGINATION.TOTAL_RECORDS,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState: coursesInitialState,
  reducers: {
    setPage: setPageReducer,
    setPageLimit: setPageLimitReducer,
    setSearch: setSearchReducer,
    setSelectedCourses: setSelectedCoursesReducer,
    emptySelectedCourses: emptySelectedCoursesReducer,
    setCoursesTotalRecords: setCoursesTotalRecordsReducer,
    resetComponentState: resetComponentStateReducer,
    setFilterCourses: setFilterCoursesReducer,
    emptyFilterCourses: emptyFilterCoursesReducer,
  },
});

export const {
  setPage,
  setPageLimit,
  setSearch,
  setSelectedCourses,
  emptySelectedCourses,
  setCoursesTotalRecords,
  resetComponentState,
  setFilterCourses,
  emptyFilterCourses,
} = coursesSlice.actions;

export default coursesSlice.reducer;
