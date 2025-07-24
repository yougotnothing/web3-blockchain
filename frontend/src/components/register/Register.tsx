import api from 'api';
import { useFormik } from 'formik';
import { registerSchema } from 'utils/register.schema';
import { type InferType } from 'yup';
import './register.css';
import { useEffect } from 'react';

const Register = () => {
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
      const response = await api.post('/auth/register', formik.values);

      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log(formik.errors);
  }, [formik.values]);

  return (
    <div className="wrapper">
      <div className="inputs-wrapper">
        <input
          className="inputs-wrapper input"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <input
          className="inputs-wrapper input"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <input
          className="inputs-wrapper input"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="inputs-wrapper error-field">{formik.errors.name}</div>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Register;
