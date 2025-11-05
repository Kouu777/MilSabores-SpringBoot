// Constantes de la aplicación
export const APP_CONSTANTS = {
    API_BASE_URL: 'http://localhost:8080/api',
    DEFAULT_PAGE_SIZE: 12,
    MAX_CART_QUANTITY: 99,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
  };
  
  // Estados de pedido
  export const ORDER_STATUS = {
    PENDIENTE: 'PENDIENTE',
    CONFIRMADO: 'CONFIRMADO',
    PREPARACION: 'PREPARACION',
    EN_CAMINO: 'EN_CAMINO',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO'
  };
  
  // Roles de usuario
  export const USER_ROLES = {
    ADMIN: 'ROLE_ADMIN',
    CLIENTE: 'ROLE_CLIENTE',
    REPARTIDOR: 'ROLE_REPARTIDOR'
  };
  
  // Categorías predefinidas
  export const DEFAULT_CATEGORIES = [
    
    'Bollería y Masas dulces',
    'Tortas y Pasteles',
    'Panes Especiales',
    'Galletas y Pequeños dulces'
  ];