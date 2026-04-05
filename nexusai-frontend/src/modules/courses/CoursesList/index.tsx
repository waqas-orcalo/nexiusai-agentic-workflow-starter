'use client';
import { Box, Chip, useTheme } from '@mui/material';
import { useState } from 'react';
import CustomTable, { TableColumn } from '@/components/CustomTable';
import CustomButton from '@/components/CustomButton';
import ConfirmDialog from '@/components/ConfirmDialog';
import PageHeader from '@/components/PageHeader';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Tooltip } from '@mui/material';
import { useDeleteCourseMutation } from '@/services/courses';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setPage, setPageLimit } from '@/redux/slices/courses/slice';
import { coursesPageSelector, coursesPageLimitSelector, coursesTotalRecordsSelector } from '@/redux/slices/courses/selectors';
import useGetCoursesList from '../hooks/useGetCoursesList';
import CourseForm from '../CourseForm';
import { successSnackbar, errorSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { Course } from '@/types/modules/courses';
import { styles } from './styles';

const CoursesList = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const page = useAppSelector(coursesPageSelector);
  const pageLimit = useAppSelector(coursesPageLimitSelector);
  const totalRecords = useAppSelector(coursesTotalRecordsSelector);

  const { courses, loading } = useGetCoursesList();
  const [deleteCourse, { isLoading: deleteLoading }] = useDeleteCourseMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleOpenCreate = () => { setEditCourse(null); setFormOpen(true); };
  const handleOpenEdit = (course: Course) => { setEditCourse(course); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditCourse(null); };
  const handleDeleteClick = (id: string) => setDeleteConfirm({ open: true, id });
  const handleDeleteCancel = () => setDeleteConfirm({ open: false, id: null });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteCourse(deleteConfirm.id).unwrap();
      successSnackbar(SUCCESS_MESSAGES.COURSE_DELETED);
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const columns: TableColumn[] = [
    { id: 'title', label: 'Title', minWidth: 200 },
    { id: 'price', label: 'Price', minWidth: 100, render: (row) => `$${row.price}` },
    { id: 'instructor', label: 'Instructor', minWidth: 150 },
    {
      id: 'level', label: 'Level', minWidth: 100,
      render: (row) => <Chip label={row.level} size="small" sx={styles?.levelChip(theme, row.level)} />,
    },
    {
      id: 'status', label: 'Status', minWidth: 100,
      render: (row) => <Chip label={row.status} size="small" sx={styles?.statusChip(theme, row.status)} />,
    },
    {
      id: 'actions', label: 'Actions', minWidth: 100, align: 'center',
      render: (row) => (
        <Box sx={styles?.actionCell()}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleOpenEdit(row)}><EditIcon fontSize="small" /></IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => handleDeleteClick(row._id)}><DeleteIcon fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={styles?.wrapper()}>
      <PageHeader
        title="Courses"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Courses' }]}
        actions={<CustomButton label="Add Course" variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} />}
      />
      <CustomTable
        columns={columns}
        rows={courses}
        loading={loading}
        page={page - 1}
        rowsPerPage={pageLimit}
        totalRecords={totalRecords}
        onPageChange={(p) => dispatch(setPage(p + 1))}
        onRowsPerPageChange={(limit) => dispatch(setPageLimit(limit))}
      />
      <CourseForm open={formOpen} onClose={handleCloseForm} editCourse={editCourse} />
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Course"
        message="Are you sure you want to delete this course? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default CoursesList;
