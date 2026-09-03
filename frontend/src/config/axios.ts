import axios from 'axios';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor de solicitudes (para adjuntar Token JWT de Sanctum si existe)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sapa_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas (para capturar errores de autorización u otros)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Por ejemplo, limpiar token expirado y redireccionar si fuese necesario
      localStorage.removeItem('sapa_token');
    }
    return Promise.reject(error);
  }
);

export default api;
