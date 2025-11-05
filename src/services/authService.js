import { API_BASE_URL, handleResponse } from './api';

// Token en memoria (no en localStorage)
let authToken = null;
let currentUser = null;

export const authService = {
  // Login con JWT
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

  // Registro con JWT
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);
    
    if (data.token) {
      authToken = data.token;
      currentUser = data.usuario;
    }
    
    return data;
  },

  // Obtener perfil del usuario autenticado
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

  // Logout
  logout: () => {
    authToken = null;
    currentUser = null;
  },

  // Verificar autenticación
  isAuthenticated: () => {
    return !!authToken;
  },

  // Obtener token
  getToken: () => {
    return authToken;
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    return currentUser;
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
  }
};