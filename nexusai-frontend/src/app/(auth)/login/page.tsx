'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box, Container, Paper, Typography, Button, CircularProgress,
} from '@mui/material';
import { CustomTextField } from '@/components/FormFields';
import { loginSchema } from '@/constants/validation';
import { useLoginMutation } from '@/services/auth';
import useAuth from '@/hooks/useAuth';
import { errorSnackbar, getErrorMessage, successSnackbar } from '@/utils/api';
import { ROUTES } from '@/constants';
import { SUCCESS_MESSAGES } from '@/constants/messages';
import { styles } from './styles';

const LoginPage = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loginMutation, { isLoading }] = useLoginMutation();
  const { login } = useAuth();

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginSchema) as any,
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, router]);

  const onSubmit = async (data: any) => {
    try {
      const response = await loginMutation(data).unwrap();
      await login(response);
      successSnackbar(SUCCESS_MESSAGES.LOGIN);
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      errorSnackbar(getErrorMessage(error));
    }
  };

  return (
    <Container maxWidth="sm" sx={styles?.container()}>
      <Paper sx={styles?.paper()}>
        <Typography variant="h4" sx={styles?.title()}>AAC Starter</Typography>
        <Typography variant="body2" sx={styles?.subtitle()}>Welcome back! Please login to your account</Typography>

        <Box component="form" sx={styles?.form()} onSubmit={handleSubmit(onSubmit)}>
          <CustomTextField name="email" control={control} label="Email Address" textFieldProps={{ type: 'email' }} />
          <CustomTextField name="password" control={control} label="Password" textFieldProps={{ type: 'password' }} />

          <Button
            variant="contained"
            fullWidth
            type="submit"
            disabled={isLoading}
            sx={styles?.submitButton()}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
