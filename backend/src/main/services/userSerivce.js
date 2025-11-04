import { API_BASE_URL, handleResponse } from './api';

export const userService = {
  // Registro de usuario
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/registro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/usuarios/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Credenciales inválidas');
    }
    
    const userData = await response.json();
    
    // Guardar token en localStorage (si tu backend usa JWT)
    if (userData.token) {
      localStorage.setItem('authToken', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return userData;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // Obtener perfil de usuario
  getProfile: async () => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/usuarios/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  // Actualizar perfil
  updateProfile: async (userData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/usuarios/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  }
};