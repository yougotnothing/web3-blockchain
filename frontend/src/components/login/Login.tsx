import api from 'api';
import { useFormik } from 'formik';
import { type loginSchema } from 'utils/login.schema';
import { type InferType } from 'yup';

const Login = () => {
  const formik = useFormik<InferType<typeof loginSchema>>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: () => {},
  });

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', formik.values);

      localStorage.setItem('access_token', response.data.access_token);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <input
          name="email"
          placeholder="Enter email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span>{formik.errors.email}</span>
      </div>
      <div>
        <input
          name="password"
          placeholder="Enter password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <span>{formik.errors.password}</span>
      </div>
      <button onClick={handleLogin}>Login</button>
    </>
  );
};

export default Login;
