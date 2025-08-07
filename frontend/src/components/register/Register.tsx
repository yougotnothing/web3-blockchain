import api from 'api';
import { useFormik } from 'formik';
import { registerSchema } from 'utils/register.schema';
import { type InferType } from 'yup';
import { useNavigate } from 'react-router-dom';
import './register.css';
import useTitle from 'hooks/useTitle';

const INPUTS = ['name', 'email', 'password'];

const Register = () => {
  const navigate = useNavigate();
  const formik = useFormik<InferType<typeof registerSchema>>({
    initialValues: {
      email: '',
      password: '',
      name: '',
    },
    validationSchema: registerSchema,
    onSubmit: () => {},
  });

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', formik.values);

      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  useTitle('Register');

  return (
    <div className="wrapper">
      <div className="inputs-wrapper">
        {INPUTS.map(key => (
          <input
            placeholder={`Enter ${key}`}
            className="inputs-wrapper input"
            name={key}
            value={formik.values[key as keyof typeof formik.values]}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        ))}
        <div className="inputs-wrapper error-field">
          {formik.errors.name || formik.errors.email || formik.errors.password}
        </div>
        <button onClick={handleRegister}>Register</button>
        <button onClick={() => navigate('/login')}>Already registered?</button>
      </div>
    </div>
  );
};

export default Register;
