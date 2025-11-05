import { apiRequest, API_BASE_URL } from './api';

export const productService = {
  // Obtener todos los productos (público)
  getAllProducts: async () => {
    return apiRequest('/productos');
  },

  // Obtener producto por ID (público)
  getProductById: async (id) => {
    return apiRequest(`/productos/${id}`);
  },

  // Obtener productos por categoría (público)
  getProductsByCategory: async (category) => {
    return apiRequest(`/productos/categoria/${category}`);
  },

  // Obtener productos destacados (público)
  getFeaturedProducts: async () => {
    return apiRequest('/productos/destacados');
  },

  // Obtener productos en oferta (público)
  getProductsOnSale: async () => {
    return apiRequest('/productos/ofertas');
  },

  // Buscar productos (público)
  searchProducts: async (searchTerm) => {
    return apiRequest(`/productos/buscar?nombre=${encodeURIComponent(searchTerm)}`);
  },

  // Obtener productos por rango de precio
  getProductsByPriceRange: async (min, max) => {
    return apiRequest(`/productos/rango-precio?min=${min}&max=${max}`);
  },

  // Crear producto (requiere autenticación ADMIN)
  createProduct: async (productData) => {
    return apiRequest('/productos', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Actualizar producto (requiere autenticación ADMIN)
  updateProduct: async (id, productData) => {
    return apiRequest(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Eliminar producto (requiere autenticación ADMIN)
  deleteProduct: async (id) => {
    return apiRequest(`/productos/${id}`, {
      method: 'DELETE',
    });
  }
};