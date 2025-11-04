import { API_BASE_URL, handleResponse, getAuthHeaders } from './api';

export const orderService = {
  // Crear pedido
  createOrder: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/pedidos`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  // Obtener pedidos del usuario
  getUserOrders: async () => {
    const response = await fetch(`${API_BASE_URL}/pedidos/usuario`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Obtener pedido por ID
  getOrderById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Cancelar pedido
  cancelOrder: async (id) => {
    const response = await fetch(`${API_BASE_URL}/pedidos/${id}/cancelar`, {
      method: 'PUT',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
};