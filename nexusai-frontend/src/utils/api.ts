import { enqueueSnackbar } from 'notistack';
import { NOTISTACK_VARIANTS } from '@/constants/snackbar';

export const successSnackbar = (message: string): void => {
  enqueueSnackbar(message, { variant: NOTISTACK_VARIANTS.SUCCESS });
};

export const errorSnackbar = (message: string): void => {
  enqueueSnackbar(message, { variant: NOTISTACK_VARIANTS.ERROR });
};

export const warningSnackbar = (message: string): void => {
  enqueueSnackbar(message, { variant: NOTISTACK_VARIANTS.WARNING });
};

export const getErrorMessage = (error: any): string => {
  return error?.data?.message || error?.message || 'Something went wrong.';
};
