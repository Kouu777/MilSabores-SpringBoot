# 🎯 Guía Rápida de Implementación de Endpoints

## ✅ Lo que ya tienes funcionando:

- ✅ **Autenticación** - Login/Register
- ✅ **Productos** - CRUD completo + búsqueda
- ✅ **Categorías** - Listar, obtener por ID
- ✅ **Usuarios** - CRUD básico (admin)

---

## 🚀 Próximos Pasos - Por Orden de Prioridad

### **FASE 1 - CRÍTICA (Recomendado implementar primero)**

#### 1️⃣ **Perfil de Usuario Autenticado** ⭐ RECOMENDADO EMPEZAR AQUÍ
Permite que un usuario vea y edite su propio perfil.

**Cambios necesarios:**

1. **Actualizar Usuario.java** ✅ YA HECHO
   - Agregué campos: `telefono` y `direccion`
   - Ejecuta: `./mvnw compile -q` para verificar

2. **Crear/Actualizar DTOs:**
   - ✅ `PerfilDTO.java` - YA CREADO
   - ✅ `ChangePasswordRequest.java` - YA CREADO

3. **Actualizar UsuarioController.java**
   - Reemplaza el contenido con el del archivo: `EXAMPLE_UsuarioControllerWithProfile.java`
   - Los nuevos endpoints son:
     - `GET /api/usuarios/perfil` - Ver perfil del usuario logueado
     - `PUT /api/usuarios/perfil` - Editar nombre, teléfono, dirección
     - `PATCH /api/usuarios/perfil/password` - Cambiar contraseña
     - `PUT /api/usuarios/perfil/email` - Cambiar email (opcional)

4. **Actualizar SecurityConfig.java**
   - Asegúrate que `/api/usuarios/perfil**` está permitido para AUTHENTICATED:
   ```java
   .requestMatchers("/api/usuarios/perfil/**").authenticated()
   ```

5. **Testing en Postman:**
   ```
   1. POST http://localhost:8080/api/auth/login
      Body: {"email": "usuario@test.com", "password": "123456"}
      Response: {"token": "eyJhbGc..."}
   
   2. GET http://localhost:8080/api/usuarios/perfil
      Headers: Authorization: Bearer eyJhbGc...
      Response: {id, nombre, email, telefono, direccion, fechaCreacion}
   
   3. PUT http://localhost:8080/api/usuarios/perfil
      Headers: Authorization: Bearer eyJhbGc...
      Body: {"nombre": "Nuevo Nombre", "telefono": "+56912345678", "direccion": "Calle 123"}
   
   4. PATCH http://localhost:8080/api/usuarios/perfil/password
      Headers: Authorization: Bearer eyJhbGc...
      Body: {"passwordActual": "123456", "passwordNuevo": "654321", "passwordConfirmar": "654321"}
   ```

---

#### 2️⃣ **Carrito de Compras** (CartController)
Sistema simple para guardar el carrito del usuario.

**Entities/Models necesarios:**
- Necesitas una tabla `CarritoItem` o guardar en sesión/LocalStorage (recomendado)

**Opción A: Carrito en base de datos**
```java
// Crear: backend/src/main/java/com/milsabores/backend/model/CarritoItem.java
@Entity
@Table(name = "carrito_items")
public class CarritoItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    private Usuario usuario;
    
    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;
    
    @Column(name = "cantidad")
    private Integer cantidad;
    
    @Column(name = "fecha_agregado")
    private LocalDateTime fechaAgregado;
}
```

**Opción B: Carrito en frontend (RECOMENDADO para simplicidad)**
- Guardar carrito en `localStorage` del navegador
- Solo sincronizar con backend al crear el pedido

**Endpoints mínimos (si usas base de datos):**
```
GET    /api/carrito           - Obtener items del carrito
POST   /api/carrito           - Agregar producto
PUT    /api/carrito/{itemId}  - Actualizar cantidad
DELETE /api/carrito/{itemId}  - Eliminar item
DELETE /api/carrito           - Vaciar carrito
```

---

#### 3️⃣ **Pedidos** (PedidoController) ⭐ MÁS IMPORTANTE
Sistema para que usuarios creen y gestionen sus pedidos.

**Verifica que tienes estas entidades:**
- ✅ `Pedido.java`
- ✅ `PedidoItem.java`

**Endpoints a implementar:**

```java
// 1. Crear nuevo pedido
POST /api/pedidos
Headers: Authorization: Bearer token
Body: {
    "direccionEntrega": "Calle 123, Apt 45",
    "notasEspeciales": "Entregar después de las 5pm",
    "metodoPago": "tarjeta|transferencia|efectivo"
}
Response: {id, numeroSeguimiento, estado, items, total, fechaCreacion}

// 2. Obtener mis pedidos
GET /api/pedidos?page=0&size=10&estado=pendiente
Headers: Authorization: Bearer token
Response: {content: [...], totalElements, totalPages}

// 3. Ver detalles de un pedido
GET /api/pedidos/{id}
Headers: Authorization: Bearer token
Response: {id, numeroSeguimiento, estado, items: [{productoId, nombre, cantidad, precio}], total}

// 4. Cancelar pedido (admin)
DELETE /api/pedidos/{id}
Headers: Authorization: Bearer token
Response: {}

// 5. Cambiar estado de pedido (admin)
PATCH /api/pedidos/{id}/estado
Headers: Authorization: Bearer token (ADMIN)
Body: {"estado": "confirmado|enviado|entregado|cancelado"}
```

**Steps para implementar:**

1. Crear: `backend/src/main/java/com/milsabores/backend/controller/PedidoController.java`

2. Crear DTO:
```java
// backend/src/main/java/com/milsabores/backend/dtos/PedidoDTO.java
@Data
public class PedidoDTO {
    private Long id;
    private String numeroSeguimiento;
    private String estado; // pendiente, confirmado, enviado, entregado
    private List<PedidoItemDTO> items;
    private Double total;
    private String direccionEntrega;
    private LocalDateTime fechaCreacion;
}
```

3. Crear Repository:
```java
// backend/src/main/java/com/milsabores/backend/repository/PedidoRepository.java
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByUsuarioIdAndEstado(Long usuarioId, String estado);
    List<Pedido> findByEstado(String estado); // Para admin
}
```

4. Actualizar SecurityConfig para permitir:
   ```java
   .requestMatchers("/api/pedidos/**").authenticated()
   .requestMatchers("/api/admin/pedidos/**").hasRole("ADMIN")
   ```

---

### **FASE 2 - IMPORTANTE (Después de Fase 1)**

#### 4️⃣ **Búsqueda Avanzada**
Mejorar búsqueda de productos con filtros múltiples y paginación.

```
GET /api/productos/filtrar?categoria=Tortas&minPrecio=1000&maxPrecio=10000&nombre=Chocolate&page=0&size=10&sort=precio&order=asc
```

#### 5️⃣ **Admin Dashboard**
Panel de administración para ver estadísticas y gestionar contenido.

```
GET /api/admin/estadisticas    - Ventas, productos, usuarios
GET /api/admin/pedidos         - Todos los pedidos
GET /api/admin/productos       - Gestión de productos
GET /api/admin/usuarios        - Gestión de usuarios
```

---

### **FASE 3 - NICE TO HAVE**

#### 6️⃣ **Reseñas y Comentarios**
Sistema de comentarios/calificación de productos.

#### 7️⃣ **Wishlist/Favoritos**
Guardar productos favoritos.

#### 8️⃣ **Cupones y Descuentos**
Sistema de códigos promocionales.

---

## 📋 Checklist Rápido

### Para implementar Perfil de Usuario:
- [ ] Compilar proyecto: `./mvnw compile -q`
- [ ] Reemplazar UsuarioController.java con contenido de EXAMPLE_UsuarioControllerWithProfile.java
- [ ] Verificar que PerfilDTO.java existe
- [ ] Verificar que ChangePasswordRequest.java existe
- [ ] Actualizar SecurityConfig (si es necesario)
- [ ] Reiniciar servidor: `./mvnw spring-boot:run`
- [ ] Probar en Postman con los ejemplos de arriba

### Para implementar Carrito (opción frontend):
- [ ] Guardar carrito en `localStorage` en React
- [ ] Agregar items al carrito desde página de producto
- [ ] Mostrar carrito en componente CartContext

### Para implementar Pedidos:
- [ ] Crear PedidoController.java
- [ ] Crear PedidoDTO.java
- [ ] Crear PedidoRepository.java
- [ ] Crear PedidoItemRepository.java (opcional)
- [ ] Actualizar SecurityConfig
- [ ] Probar endpoints en Postman

---

## 🔗 Archivos de Referencia

- **ENDPOINTS_IMPLEMENTATION_GUIDE.md** - Documentación completa de todos los endpoints
- **EXAMPLE_UsuarioControllerWithProfile.java** - Ejemplo de implementación de perfil
- **EXAMPLE_*.java** - Más ejemplos (si los creo)

---

## 💡 Consejos

1. **Implementa en orden:** Perfil → Carrito → Pedidos
2. **Prueba cada endpoint** antes de pasar al siguiente
3. **Usa Postman** para testing (más fácil que React)
4. **Sincroniza frontend y backend** después de implementar backend

---

## ❓ Preguntas Frecuentes

**P: ¿Por dónde empiezo?**
R: Por "Perfil de Usuario". Es lo más simple y usarás ese patrón en todos los demás endpoints.

**P: ¿Necesito crear tabla CarritoItem?**
R: No es necesario. Puedes guardar el carrito en `localStorage` del navegador.

**P: ¿Cómo genero el numeroSeguimiento del pedido?**
R: Puedes usar UUID o una secuencia: `"PED-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))`

**P: ¿Cómo sé quién es el usuario logueado?**
R: Usa el parámetro `Authentication authentication` en los endpoints. El email está en `authentication.getName()`

---

## 🚀 Próximo Paso

¿Qué endpoint quieres implementar primero? Puedo ayudarte paso a paso.

