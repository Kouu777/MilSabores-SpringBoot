import { apiRequest } from './api';

export const categoryService = {
  // Obtener todas las categorías
  getAllCategories: async () => {
    return apiRequest('/categorias');
  },

  // Obtener categoría por ID
  getCategoryById: async (id) => {
    return apiRequest(`/categorias/${id}`);
  },

  // Obtener categorías principales
  getMainCategories: async () => {
    return apiRequest('/categorias/principales');
  },

  // Obtener subcategorías
  getSubcategories: async (parentId) => {
    return apiRequest(`/categorias/${parentId}/subcategorias`);
  },

  // Crear categoría (admin)
  createCategory: async (categoryData) => {
    return apiRequest('/categorias', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // Actualizar categoría (admin)
  updateCategory: async (id, categoryData) => {
    return apiRequest(`/categorias/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  },

  // Eliminar categoría (admin)
  deleteCategory: async (id) => {
    return apiRequest(`/categorias/${id}`, {
      method: 'DELETE',
    });
  }
};