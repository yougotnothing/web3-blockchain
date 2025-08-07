import api from 'api';
import { useFormik } from 'formik';
import { loginSchema } from 'utils/login.schema';
import { type InferType } from 'yup';
import { useNavigate } from 'react-router-dom';
import './login.css';
import { user } from 'store/user';
import useTitle from 'hooks/useTitle';

const Login = () => {
  const navigate = useNavigate();
  const formik = useFormik<InferType<typeof loginSchema>>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: () => {},
  });

  const handleLogin = async () => {
    try {
      const response = await api.post('/auth/login', formik.values);

      localStorage.setItem('access_token', response.data.access_token);

      user.getSelf();

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  useTitle('Login');

  return (
    <div className="wrapper">
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
      <button onClick={() => navigate('/register')}>Not registered yet?</button>
    </div>
  );
};

export default Login;
