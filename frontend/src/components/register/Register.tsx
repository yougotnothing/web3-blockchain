import api from 'api';
import { useFormik } from 'formik';
import type { registerSchema } from 'utils/register.schema';
import { type InferType } from 'yup';

const Register = () => {
  const formik = useFormik<InferType<typeof registerSchema>>({
    initialValues: {
      email: '',
      password: '',
      name: '',
    },
    onSubmit: () => {},
  });

  const handleRegister = async () => {
    try {
      const response = await api.post('/auth/register', formik.values);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <input
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <input
          type="text"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button type="submit" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
