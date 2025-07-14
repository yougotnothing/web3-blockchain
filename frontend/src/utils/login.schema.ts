import * as yup from 'yup';
import { emailSchema } from './email.schema';

export const loginSchema = yup.object().shape({
  email: emailSchema,
  password: yup.string().min(8).required(),
});
