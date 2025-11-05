import { authService } from './authService';

const API_BASE_URL = 'http://localhost:8080/api';

// Headers con autenticación JWT
export const getAuthHeaders = () => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Manejo mejorado de respuestas
export const handleResponse = async (response) => {
  if (response.status === 401) {
    // Token expirado o inválido
    authService.logout();
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }

  if (response.status === 403) {
    throw new Error('No tienes permisos para esta acción');
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Error en la solicitud';
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  // Si la respuesta es exitosa pero no tiene contenido
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

// Interceptor para requests
export const apiRequest = async (url, options = {}) => {
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  return handleResponse(response);
};

export { API_BASE_URL };