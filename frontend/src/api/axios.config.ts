import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    if (
      error.response.status === 401 &&
      error.response.data.message.includes('token is expired')
    ) {
      const originalRequest = error.config;

      originalRequest._retry = false;

      const response = await api.post('auth/refresh');

      localStorage.setItem('access_token', response.data.access_token);

      originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;
