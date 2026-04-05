'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import { CustomTextField, CustomSelect } from '@/components/FormFields';
import { courseSchema } from '@/constants/validation';
import { useCreateCourseMutation, useUpdateCourseMutation } from '@/services/courses';
import { successSnackbar, errorSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { Course, CreateCourseDto } from '@/types/modules/courses';
import { COURSE_LEVEL, COURSE_STATUS } from '@/constants';
import { styles } from './styles';

const LEVEL_OPTIONS = [
  { label: 'Beginner', value: COURSE_LEVEL.BEGINNER },
  { label: 'Intermediate', value: COURSE_LEVEL.INTERMEDIATE },
  { label: 'Advanced', value: COURSE_LEVEL.ADVANCED },
];

const STATUS_OPTIONS = [
  { label: 'Draft', value: COURSE_STATUS.DRAFT },
  { label: 'Published', value: COURSE_STATUS.PUBLISHED },
  { label: 'Archived', value: COURSE_STATUS.ARCHIVED },
];

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  editCourse?: Course | null;
}

const CourseForm = ({ open, onClose, editCourse }: CourseFormProps) => {
  const isEdit = !!editCourse;
  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(courseSchema) as any,
    defaultValues: { title: '', description: '', price: 0, level: '', status: '', instructor: '' },
  });

  useEffect(() => {
    if (editCourse) {
      reset({
        title: editCourse.title,
        description: editCourse.description,
        price: editCourse.price,
        level: editCourse.level,
        status: editCourse.status,
        instructor: editCourse.instructor,
      });
    } else {
      reset({ title: '', description: '', price: 0, level: '', status: '', instructor: '' });
    }
  }, [editCourse, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && editCourse) {
        await updateCourse({ id: editCourse._id, ...data }).unwrap();
        successSnackbar(SUCCESS_MESSAGES.COURSE_UPDATED);
      } else {
        await createCourse(data as CreateCourseDto).unwrap();
        successSnackbar(SUCCESS_MESSAGES.COURSE_CREATED);
      }
      onClose();
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Course' : 'Create Course'}
      actions={
        <Box sx={styles?.buttonRow()}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={creating || updating}>
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </Box>
      }
    >
      <Box component="form" sx={styles?.form()} onSubmit={handleSubmit(onSubmit)}>
        <CustomTextField name="title" control={control} label="Title" />
        <CustomTextField name="description" control={control} label="Description" textFieldProps={{ multiline: true, rows: 3 }} />
        <CustomTextField name="price" control={control} label="Price" textFieldProps={{ type: 'number' }} />
        <CustomTextField name="instructor" control={control} label="Instructor" />
        <CustomSelect name="level" control={control} label="Level" options={LEVEL_OPTIONS} />
        <CustomSelect name="status" control={control} label="Status" options={STATUS_OPTIONS} />
      </Box>
    </CustomModal>
  );
};

export default CourseForm;
