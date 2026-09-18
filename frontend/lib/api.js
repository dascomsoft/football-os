import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const TOKEN_KEY = 'football_os_token';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname;
      // On ne purge et ne redirige pas si on est deja sur /login,
      // pour eviter une boucle infinie.
      if (path !== '/login') {
        window.localStorage.removeItem(TOKEN_KEY);
        window.localStorage.removeItem('football_os_user');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export { TOKEN_KEY };
export default api;