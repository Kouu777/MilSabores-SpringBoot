import { apiRequest } from './api';

export const orderService = {
  // Crear pedido (autenticado)
  createOrder: async (orderData) => {
    return apiRequest('/pedidos', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Obtener pedidos del usuario (autenticado)
  getUserOrders: async () => {
    return apiRequest('/pedidos/usuario');
  },

  // Obtener pedido por ID (autenticado)
  getOrderById: async (id) => {
    return apiRequest(`/pedidos/${id}`);
  },

  // Cancelar pedido (autenticado)
  cancelOrder: async (id) => {
    return apiRequest(`/pedidos/${id}/cancelar`, {
      method: 'PUT',
    });
  },

  // Obtener todos los pedidos (ADMIN)
  getAllOrders: async () => {
    return apiRequest('/pedidos');
  },

  // Actualizar estado del pedido (ADMIN)
  updateOrderStatus: async (id, status) => {
    return apiRequest(`/pedidos/${id}/estado`, {
      method: 'PUT',
      body: JSON.stringify({ estado: status }),
    });
  }
};