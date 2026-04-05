'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import CustomModal from '@/components/CustomModal';
import { CustomTextField, CustomSelect } from '@/components/FormFields';
import { createUserSchema, updateUserSchema } from '@/constants/validation';
import { useCreateUserMutation, useUpdateUserMutation } from '@/services/users';
import { successSnackbar, errorSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { User, CreateUserDto } from '@/types/modules/users';
import { USER_ROLES } from '@/constants';
import { styles } from './styles';

const ROLE_OPTIONS = [
  { label: 'Admin', value: USER_ROLES.ADMIN },
  { label: 'User', value: USER_ROLES.USER },
  { label: 'Instructor', value: USER_ROLES.INSTRUCTOR },
];

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  editUser?: User | null;
}

const UserForm = ({ open, onClose, editUser }: UserFormProps) => {
  const isEdit = !!editUser;
  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(isEdit ? updateUserSchema : createUserSchema) as any,
    defaultValues: { firstName: '', lastName: '', email: '', role: '', password: '' },
  });

  useEffect(() => {
    if (editUser) {
      reset({ firstName: editUser.firstName, lastName: editUser.lastName, email: editUser.email, role: editUser.role, password: '' });
    } else {
      reset({ firstName: '', lastName: '', email: '', role: '', password: '' });
    }
  }, [editUser, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (isEdit && editUser) {
        const { password, ...updateData } = data;
        await updateUser({ id: editUser._id, ...updateData }).unwrap();
        successSnackbar(SUCCESS_MESSAGES.USER_UPDATED);
      } else {
        await createUser(data as CreateUserDto).unwrap();
        successSnackbar(SUCCESS_MESSAGES.USER_CREATED);
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
      title={isEdit ? 'Edit User' : 'Create User'}
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
        <CustomTextField name="firstName" control={control} label="First Name" />
        <CustomTextField name="lastName" control={control} label="Last Name" />
        <CustomTextField name="email" control={control} label="Email" textFieldProps={{ type: 'email' }} />
        <CustomSelect name="role" control={control} label="Role" options={ROLE_OPTIONS} />
        {!isEdit && <CustomTextField name="password" control={control} label="Password" textFieldProps={{ type: 'password' }} />}
      </Box>
    </CustomModal>
  );
};

export default UserForm;
