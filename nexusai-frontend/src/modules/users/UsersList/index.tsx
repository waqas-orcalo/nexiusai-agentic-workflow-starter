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
import { useDeleteUserMutation } from '@/services/users';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setPage, setPageLimit } from '@/redux/slices/users/slice';
import { usersPageSelector, usersPageLimitSelector, usersTotalRecordsSelector } from '@/redux/slices/users/selectors';
import useGetUsersList from '../hooks/useGetUsersList';
import UserForm from '../UserForm';
import { successSnackbar, errorSnackbar, getErrorMessage } from '@/utils/api';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { User } from '@/types/modules/users';
import { styles } from './styles';

const UsersList = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const page = useAppSelector(usersPageSelector);
  const pageLimit = useAppSelector(usersPageLimitSelector);
  const totalRecords = useAppSelector(usersTotalRecordsSelector);

  const { users, loading } = useGetUsersList();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

  const handleOpenCreate = () => { setEditUser(null); setFormOpen(true); };
  const handleOpenEdit = (user: User) => { setEditUser(user); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditUser(null); };

  const handleDeleteClick = (id: string) => setDeleteConfirm({ open: true, id });
  const handleDeleteCancel = () => setDeleteConfirm({ open: false, id: null });

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deleteUser(deleteConfirm.id).unwrap();
      successSnackbar(SUCCESS_MESSAGES.USER_DELETED);
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const columns: TableColumn[] = [
    { id: 'firstName', label: 'First Name', minWidth: 120 },
    { id: 'lastName', label: 'Last Name', minWidth: 120 },
    { id: 'email', label: 'Email', minWidth: 200 },
    { id: 'role', label: 'Role', minWidth: 100, render: (row) => <Chip label={row.role} size="small" /> },
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
        title="Users"
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Users' }]}
        actions={<CustomButton label="Add User" variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} />}
      />
      <CustomTable
        columns={columns}
        rows={users}
        loading={loading}
        page={page - 1}
        rowsPerPage={pageLimit}
        totalRecords={totalRecords}
        onPageChange={(p) => dispatch(setPage(p + 1))}
        onRowsPerPageChange={(limit) => dispatch(setPageLimit(limit))}
      />
      <UserForm open={formOpen} onClose={handleCloseForm} editUser={editUser} />
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default UsersList;
