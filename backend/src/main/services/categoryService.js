import { API_BASE_URL, handleResponse } from './api';

export const categoryService = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categorias`);
    return handleResponse(response);
  },

  // Obtener categoría por ID
  getCategoryById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${id}`);
    return handleResponse(response);
  },

  // Obtener categorías principales
  getMainCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categorias/principales`);
    return handleResponse(response);
  },

  // Obtener subcategorías
  getSubcategories: async (parentId) => {
    const response = await fetch(`${API_BASE_URL}/categorias/${parentId}/subcategorias`);
    return handleResponse(response);
  },

  // Crear categoría (admin)
  createCategory: async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categorias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
  }
};