import * as yup from 'yup';
import { emailSchema } from './email.schema';

export const registerSchema = yup.object().shape({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(18, 'Name must be between 2 and 18 characters')
    .required('Name is required'),
  email: emailSchema,
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});
