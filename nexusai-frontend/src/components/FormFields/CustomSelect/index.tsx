'use client';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller, Control, FieldValues } from 'react-hook-form';
import { SelectOption } from '@/types/shared';
import { styles } from './styles';

interface CustomSelectProps<T extends FieldValues = FieldValues> {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<T, any, any>;
  label: string;
  options: SelectOption[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomSelect = <T extends FieldValues = FieldValues>({ name, control, label, options }: CustomSelectProps<T>) => (
  <Controller
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name={name as any}
    control={control}
    render={({ field, fieldState }) => (
      <FormControl fullWidth size="small" sx={styles?.formControl()} error={!!fieldState.error}>
        <InputLabel>{label}</InputLabel>
        <Select {...field} label={label}>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
        {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
      </FormControl>
    )}
  />
);

export default CustomSelect;
