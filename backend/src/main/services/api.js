const API_BASE_URL = 'http://localhost:8080/api';

// Headers comunes
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Manejo de errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Error en la solicitud');
  }
  return response.json();
};

// Servicio de Productos
export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/productos`);
    return handleResponse(response);
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`);
    return handleResponse(response);
  },

  // Obtener productos por categoría
  getProductsByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/productos/categoria/${category}`);
    return handleResponse(response);
  },


  // Buscar productos
  searchProducts: async (searchTerm) => {
    const response = await fetch(`${API_BASE_URL}/productos/buscar?nombre=${encodeURIComponent(searchTerm)}`);
    return handleResponse(response);
  },

  // Crear producto (admin)
  createProduct: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/productos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  // Actualizar producto (admin)
  updateProduct: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(response);
  },

  // Eliminar producto (admin)
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/productos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};