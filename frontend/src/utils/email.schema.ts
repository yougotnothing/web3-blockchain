import * as yup from 'yup';

export const emailSchema = yup
  .string()
  .email('Invalid email')
  .required('Email is required');
