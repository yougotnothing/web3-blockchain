import * as yup from 'yup';
import { emailSchema } from './email.schema';

export const registerSchema = yup.object().shape({
  name: yup.string().min(2).required('Name is required'),
  email: emailSchema,
  password: yup.string().min(8).required('Password is required'),
});
