import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
});

export const createUserSchema = yup.object({
  firstName: yup.string().required('First name is required').max(50),
  lastName: yup.string().required('Last name is required').max(50),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  role: yup.string().required('Role is required'),
  password: yup.string().min(8).required('Password is required'),
});

export const updateUserSchema = yup.object({
  firstName: yup.string().required('First name is required').max(50),
  lastName: yup.string().required('Last name is required').max(50),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  role: yup.string().required('Role is required'),
});

export const courseSchema = yup.object({
  title: yup.string().required('Title is required').max(200),
  description: yup.string().max(1000),
  price: yup.number().min(0).required('Price is required'),
  level: yup.string().required('Level is required'),
  status: yup.string().required('Status is required'),
});
