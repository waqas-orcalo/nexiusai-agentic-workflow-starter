'use client';
import { TextField, TextFieldProps } from '@mui/material';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { styles } from './styles';

interface CustomTextFieldProps<T extends FieldValues = FieldValues> {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  label: string;
  textFieldProps?: TextFieldProps;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTextField = <T extends FieldValues = FieldValues>({ name, control, label, textFieldProps }: CustomTextFieldProps<T>) => (
  <Controller
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name={name as any}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        {...textFieldProps}
        label={label}
        fullWidth
        error={!!fieldState.error}
        helperText={fieldState.error?.message}
        size="small"
        sx={styles?.textField()}
      />
    )}
  />
);

export default CustomTextField;
