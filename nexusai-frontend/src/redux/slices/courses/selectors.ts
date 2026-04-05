import { RootState } from '@/redux/store';

export const coursesPageSelector = (state: RootState) => state.courses.page;
export const coursesPageLimitSelector = (state: RootState) => state.courses.pageLimit;
export const coursesSearchSelector = (state: RootState) => state.courses.search;
export const coursesTotalRecordsSelector = (state: RootState) => state.courses.totalRecords;
export const coursesSelectedSelector = (state: RootState) => state.courses.selectedCourses;
export const coursesFilterSelector = (state: RootState) => state.courses.filterCourses;
