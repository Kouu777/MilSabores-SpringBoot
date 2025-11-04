import { API_BASE_URL, handleResponse } from './api';

// Variable para almacenar el token en memoria (no en localStorage)
let authToken = null;
let currentUser = null;

export const userService = {
  // Registro de usuario
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    
    // Guardar token en memoria
    if (data.token) {
      authToken = data.token;
      currentUser = data.usuario;
    }
    
    return data;
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await handleResponse(response);
    
    // Guardar token en memoria
    if (data.token) {
      authToken = data.token;
      currentUser = data.usuario;
    }
    
    return data;
  },

  // Logout
  logout: () => {
    authToken = null;
    currentUser = null;
    // Opcional: llamar al endpoint de logout del backend
    // fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  },

  // Obtener perfil de usuario
  getProfile: async () => {
    if (!authToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    });
    
    const data = await handleResponse(response);
    currentUser = data;
    return data;
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    if (!authToken) {
      throw new Error('No autenticado');
    }

    const response = await fetch(`${API_BASE_URL}/usuarios/perfil`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(userData),
    });
    
    const data = await handleResponse(response);
    currentUser = data;
    return data;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!authToken;
  },

  // Obtener token actual
  getToken: () => {
    return authToken;
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return currentUser;
  }
};

// Actualizar la función getAuthHeaders en api.js
export const getAuthHeaders = () => {
  const token = userService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};