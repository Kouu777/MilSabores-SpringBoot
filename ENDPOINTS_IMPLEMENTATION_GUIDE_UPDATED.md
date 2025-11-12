# Guía de Implementación de Endpoints - MilSabores

## 📋 Estado Actual (11 Nov 2025)

### ✅ Endpoints Implementados

#### Autenticación
- `POST /api/auth/login` - Login con email/password
- `POST /api/auth/register` - Registro de nuevos usuarios

#### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/{id}` - Obtener producto por ID
- `GET /api/productos/buscar?nombre=...` - Buscar productos por nombre
- `GET /api/productos/rango-precio?min=...&max=...` - Filtrar por rango de precio
- `GET /api/productos/categoria/{categoria}` - Obtener productos por categoría
- `POST /api/productos` - Crear producto (solo ADMIN)
- `PUT /api/productos/{id}` - Actualizar producto (solo ADMIN)
- `DELETE /api/productos/{id}` - Eliminar producto (solo ADMIN)
- `PATCH /api/productos/{id}/stock` - Actualizar stock

#### Categorías
- `GET /api/categorias` - Obtener todas las categorías
- `POST /api/categorias` - Crear categoría (solo ADMIN)
- `PUT /api/categorias/{id}` - Actualizar categoría (solo ADMIN)
- `DELETE /api/categorias/{id}` - Eliminar categoría (solo ADMIN)

---

## 📌 Endpoints Pendientes por Implementar

### 1️⃣ **PERFIL DE USUARIO** (Autenticado)

```
GET /api/usuarios/perfil
└─ Obtener información del usuario autenticado
├─ Response: PerfilDTO { id, nombre, apellido, email, fechaNacimiento, edad, 
│                         isDuoc, hasFelices50, preferencias, fechaRegistro }
└─ Status: 200 OK | 401 Unauthorized

PUT /api/usuarios/perfil
└─ Actualizar información del usuario
├─ Request: PerfilDTO (excepto email y fechaRegistro)
├─ Response: PerfilDTO actualizado
└─ Status: 200 OK | 400 Bad Request | 401 Unauthorized

PATCH /api/usuarios/perfil/password
└─ Cambiar contraseña del usuario
├─ Request: { passwordActual: string, passwordNueva: string }
├─ Response: { mensaje: "Contraseña actualizada correctamente" }
└─ Status: 200 OK | 400 Bad Request | 401 Unauthorized
```

**DTOs Necesarios:**
```java
// PerfilDTO.java
public class PerfilDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String fechaNacimiento;
    private Integer edad;
    private Boolean isDuoc;
    private Boolean hasFelices50;
    private String preferencias;
    private LocalDateTime fechaRegistro;
}

// ChangePasswordRequest.java
public class ChangePasswordRequest {
    private String passwordActual;
    private String passwordNueva;
}
```

---

### 2️⃣ **CARRITO DE COMPRAS** (Frontend - Recomendado)

**Opción A: localStorage (RECOMENDADO)**
```
Guardar carrito en localStorage del navegador
Estructura: { items: [{ productoId, cantidad, precio }] }
Ventajas: No requiere backend, rápido, privado por usuario
```

**Opción B: Backend (Si lo prefieres)**
```
POST /api/carrito/agregar
└─ Agregar producto al carrito
├─ Request: { productoId: long, cantidad: int }
├─ Response: { id, usuarioId, items: [...], total }
└─ Status: 201 Created

GET /api/carrito
└─ Obtener carrito del usuario
├─ Response: { id, usuarioId, items: [...], total }
└─ Status: 200 OK

PATCH /api/carrito/{itemId}
└─ Actualizar cantidad de item
├─ Request: { cantidad: int }
└─ Status: 200 OK

DELETE /api/carrito/{itemId}
└─ Eliminar item del carrito
└─ Status: 204 No Content

DELETE /api/carrito
└─ Vaciar carrito
└─ Status: 204 No Content
```

---

### 3️⃣ **PEDIDOS** (Autenticado)

```
POST /api/pedidos
└─ Crear nuevo pedido desde el carrito
├─ Request: { items: [{ productoId, cantidad }] }
├─ Response: PedidoDTO
└─ Status: 201 Created

GET /api/pedidos
└─ Obtener todos los pedidos del usuario
├─ Response: List<PedidoDTO>
└─ Status: 200 OK

GET /api/pedidos/{id}
└─ Obtener detalles de un pedido específico
├─ Response: PedidoDTO con items completos
└─ Status: 200 OK | 404 Not Found

PATCH /api/pedidos/{id}/estado
└─ Actualizar estado del pedido (solo ADMIN)
├─ Request: { estado: "PENDIENTE|PROCESANDO|ENVIADO|ENTREGADO|CANCELADO" }
├─ Response: PedidoDTO
└─ Status: 200 OK | 403 Forbidden
```

**DTOs Necesarios:**
```java
// PedidoDTO.java
public class PedidoDTO {
    private Long id;
    private Long usuarioId;
    private List<PedidoItemDTO> items;
    private Double total;
    private String estado; // PENDIENTE, PROCESANDO, ENVIADO, ENTREGADO, CANCELADO
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
}

// PedidoItemDTO.java
public class PedidoItemDTO {
    private Long id;
    private Long productoId;
    private String nombreProducto;
    private Integer cantidad;
    private Double precioUnitario;
    private Double subtotal;
}
```

---

### 4️⃣ **ADMIN DASHBOARD** (Solo ADMIN - Fase 2)

```
GET /api/admin/estadisticas
├─ totalProductos: int
├─ totalUsuarios: int
├─ totalPedidos: int
├─ ingresosTotales: double
└─ pedidosPendientes: int

GET /api/admin/usuarios
└─ Listar todos los usuarios con paginación

GET /api/admin/pedidos
└─ Listar todos los pedidos con filtros

GET /api/admin/productos/bajoStock
└─ Listar productos con stock bajo
```

---

### 5️⃣ **BÚSQUEDA AVANZADA** (Fase 2)

```
GET /api/productos/buscar/avanzado
├─ Query params: nombre, categoria, minPrecio, maxPrecio, ordenar, pagina, tamaño
└─ Response: { content: [...], totalElements, totalPages, currentPage }
```

---

## 🎯 Prioridad de Implementación

### Fase 1 (INMEDIATA)
1. **Perfil de Usuario** ← Comienza por aquí
2. **Pedidos** (con CrearPedido y ListarPedidos)

### Fase 2 (MEDIA)
3. Carrito de Compras (si lo prefieres en backend)
4. Búsqueda avanzada y paginación

### Fase 3 (BAJA)
5. Admin Dashboard
6. Reportes y estadísticas

---

## 🛠️ Pasos para Implementar Perfil de Usuario

### 1. Crear los DTOs
- `PerfilDTO.java` en `backend/src/main/java/com/milsabores/backend/dtos/`
- `ChangePasswordRequest.java` en el mismo directorio

### 2. Actualizar UsuarioController
- Agregar método `getPerfil()` con `@GetMapping("/perfil")`
- Agregar método `updatePerfil()` con `@PutMapping("/perfil")`
- Agregar método `changePassword()` con `@PatchMapping("/perfil/password")`

### 3. Crear/Actualizar UsuarioService
- Método para obtener usuario autenticado actual
- Método para actualizar perfil sin cambiar email
- Método para cambiar contraseña con validación

### 4. Agregar métodos en UsuarioRepository
- `findByEmail(String email)` ← Ya existe
- Métodos existentes son suficientes

### 5. Actualizar SecurityConfig
- Permitir `GET /api/usuarios/perfil` solo autenticados
- Permitir `PUT /api/usuarios/perfil` solo autenticados
- Permitir `PATCH /api/usuarios/perfil/password` solo autenticados

---

## 📝 Notas Importantes

1. **Autenticación**: Todos los endpoints de usuario, carrito y pedidos requieren JWT válido
2. **ADMIN**: Algunos endpoints requieren rol ADMIN (productos CRUD, cambiar estado pedidos)
3. **CORS**: Ya está configurado para localhost:3000 y localhost:5173
4. **H2 Console**: Disponible en `/h2-console` para development

---

## 📞 Datos de Ejemplo

**Usuario de Prueba:**
```json
{
  "email": "usuario@test.com",
  "password": "password123"
}
```

**Producto de Ejemplo:**
```json
{
  "nombre": "Torta de Chocolate",
  "descripcion": "Deliciosa torta de chocolate",
  "precio": 15990,
  "categoria": "Tortas y Pasteles",
  "stock": 10
}
```

**Pedido de Ejemplo:**
```json
{
  "items": [
    { "productoId": 1, "cantidad": 2 },
    { "productoId": 3, "cantidad": 1 }
  ]
}
```

---

## 🔍 Testing en Postman

**Headers comunes:**
```
Content-Type: application/json
Authorization: Bearer <tu_jwt_token>
```

---

¿Cuál endpoint te gustaría implementar primero? Te puedo proporcionar el código completo. 🚀
