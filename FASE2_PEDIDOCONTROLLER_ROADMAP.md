# 📦 FASE 2: Implementar PedidoController

## Introducción

Una vez que el POST /api/reviews está funcionando sin errores 401, el siguiente paso es implementar el sistema de **Pedidos**. Este documento es la hoja de ruta completa.

---

## 📋 Checklist Previa

Antes de empezar PedidoController, verifica que:

- [ ] ✅ POST /api/reviews retorna 201 Created (NO 401)
- [ ] ✅ Endpoint GET /api/productos/{id} funciona
- [ ] ✅ Usuarios pueden obtener /api/usuarios/perfil
- [ ] ✅ Servidor corriendo en puerto 8081 sin errores

---

## 🎯 Objetivo

Implementar endpoints para que usuarios autenticados puedan:

1. **Crear pedidos** (POST /api/pedidos)
2. **Ver sus pedidos** (GET /api/pedidos)
3. **Ver detalle de un pedido** (GET /api/pedidos/{id})
4. **Cambiar estado del pedido** (PATCH /api/pedidos/{id}/estado) - Solo ADMIN

---

## 📊 Modelo de Datos

### Entidad: Pedido

```java
@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;
    
    private String numero; // Ej: PED-20251111-001
    
    private BigDecimal total;
    private Integer cantidad; // Total de items
    
    @Enumerated(EnumType.STRING)
    private EstadoPedido estado; // PENDIENTE, CONFIRMADO, PREPARANDO, ENVIADO, ENTREGADO, CANCELADO
    
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String telefono;
    
    private String notas; // Notas especiales del pedido
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<PedidoDetalle> detalles;
    
    @CreationTimestamp
    private LocalDateTime fechaCreacion;
    
    @UpdateTimestamp
    private LocalDateTime fechaActualizacion;
}
```

### Entidad: PedidoDetalle

```java
@Entity
@Table(name = "pedido_detalles")
public class PedidoDetalle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private Pedido pedido;
    
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal; // cantidad * precioUnitario
}
```

### Enum: EstadoPedido

```java
public enum EstadoPedido {
    PENDIENTE,      // Recién creado, esperando confirmación
    CONFIRMADO,     // Confirmado por usuario
    PREPARANDO,     // En preparación en tienda
    ENVIADO,        // Enviado al usuario
    ENTREGADO,      // Entregado
    CANCELADO;      // Cancelado por usuario o admin
}
```

---

## 🔄 DTOs Necesarios

### CreatePedidoRequest

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatePedidoRequest {
    private List<PedidoItemRequest> items;      // [{productoId, cantidad}, ...]
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String telefono;
    private String notas; // Opcional
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoItemRequest {
    private Long productoId;
    private Integer cantidad;
}
```

### PedidoDTO (Response)

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long id;
    private String numero;
    private BigDecimal total;
    private Integer cantidad;
    private EstadoPedido estado;
    private String direccion;
    private String ciudad;
    private String codigoPostal;
    private String telefono;
    private String notas;
    private LocalDateTime fechaCreacion;
    private List<PedidoDetalleDTO> detalles;
}

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDetalleDTO {
    private Long id;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private BigDecimal subtotal;
}
```

### UpdateEstadoPedidoRequest

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEstadoPedidoRequest {
    private EstadoPedido nuevoEstado;
    private String motivo; // Opcional, para cancelaciones
}
```

---

## 🔌 Endpoints a Implementar

### 1. POST /api/pedidos - Crear Pedido

**Descripción:** Usuario autenticado crea un nuevo pedido

**Entrada:**
```json
{
  "items": [
    {"productoId": 1, "cantidad": 2},
    {"productoId": 3, "cantidad": 1}
  ],
  "direccion": "Calle 123, Apto 4",
  "ciudad": "Santiago",
  "codigoPostal": "8320000",
  "telefono": "+56912345678",
  "notas": "Entregar después de las 18:00"
}
```

**Salida (201 Created):**
```json
{
  "id": 1,
  "numero": "PED-20251111-001",
  "total": 45000.00,
  "cantidad": 3,
  "estado": "PENDIENTE",
  "direccion": "Calle 123, Apto 4",
  "ciudad": "Santiago",
  "codigoPostal": "8320000",
  "telefono": "+56912345678",
  "notas": "Entregar después de las 18:00",
  "fechaCreacion": "2025-11-11T20:10:00",
  "detalles": [
    {
      "id": 1,
      "nombreProducto": "Torta Pastelera",
      "cantidad": 2,
      "precioUnitario": 15000.00,
      "subtotal": 30000.00
    },
    {
      "id": 2,
      "nombreProducto": "Brownies Deluxe",
      "cantidad": 1,
      "precioUnitario": 15000.00,
      "subtotal": 15000.00
    }
  ]
}
```

**Validaciones:**
- ✅ Usuario autenticado (Bearer JWT)
- ✅ Mínimo 1 item
- ✅ Cantidad > 0 para cada item
- ✅ Producto existe
- ✅ Stock disponible
- ✅ Dirección, ciudad, teléfono obligatorios

**Errores:**
- 401 Unauthorized - No autenticado
- 400 Bad Request - Validación fallida
- 404 Not Found - Producto no existe
- 409 Conflict - Stock insuficiente

---

### 2. GET /api/pedidos - Listar Pedidos del Usuario

**Descripción:** Ver todos los pedidos del usuario autenticado

**Parámetros (opcionales):**
- `estado=PENDIENTE` - Filtrar por estado
- `page=0` - Número de página
- `size=10` - Resultados por página

**Salida (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "numero": "PED-20251111-001",
      "total": 45000.00,
      "cantidad": 3,
      "estado": "PENDIENTE",
      "direccion": "Calle 123",
      "ciudad": "Santiago",
      "fechaCreacion": "2025-11-11T20:10:00",
      "detalles": [...]
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "currentPage": 0
}
```

---

### 3. GET /api/pedidos/{id} - Obtener Detalle del Pedido

**Descripción:** Ver detalles completos de un pedido

**Validaciones:**
- ✅ Usuario autenticado
- ✅ Solo puede ver sus propios pedidos (verificar usuario_id)
- ✅ Admin puede ver cualquier pedido

**Salida (200 OK):**
```json
{
  "id": 1,
  "numero": "PED-20251111-001",
  "total": 45000.00,
  "cantidad": 3,
  "estado": "PENDIENTE",
  "direccion": "Calle 123, Apto 4",
  "ciudad": "Santiago",
  "codigoPostal": "8320000",
  "telefono": "+56912345678",
  "notas": "Entregar después de las 18:00",
  "fechaCreacion": "2025-11-11T20:10:00",
  "detalles": [
    {
      "id": 1,
      "nombreProducto": "Torta Pastelera",
      "cantidad": 2,
      "precioUnitario": 15000.00,
      "subtotal": 30000.00
    }
  ]
}
```

---

### 4. PATCH /api/pedidos/{id}/estado - Cambiar Estado

**Descripción:** Cambiar estado del pedido (Solo ADMIN)

**Entrada:**
```json
{
  "nuevoEstado": "CONFIRMADO",
  "motivo": "" // Opcional, solo para CANCELADO
}
```

**Salida (200 OK):**
```json
{
  "id": 1,
  "numero": "PED-20251111-001",
  "estado": "CONFIRMADO",
  "fechaActualizacion": "2025-11-11T20:15:00",
  "mensaje": "Estado actualizado a CONFIRMADO"
}
```

**Validaciones:**
- ✅ Usuario es ADMIN
- ✅ Cambio de estado es válido (ej: PENDIENTE → CONFIRMADO)
- ✅ No se puede cambiar estado de pedido ENTREGADO o CANCELADO

---

## 🛠️ Implementación Paso a Paso

### Paso 1: Crear Entidades

1. Crear `Pedido.java` en `backend/src/main/java/com/milsabores/backend/model/`
2. Crear `PedidoDetalle.java`
3. Crear `EstadoPedido.java` enum
4. Actualizar `Usuario.java` con relación @OneToMany pedidos

### Paso 2: Crear DTOs

1. Crear `CreatePedidoRequest.java`
2. Crear `PedidoDTO.java`
3. Crear `PedidoDetalleDTO.java`
4. Crear `UpdateEstadoPedidoRequest.java`

### Paso 3: Crear Repositories

1. Crear `PedidoRepository.java` con métodos:
   - `findByUsuarioId(Long usuarioId, Pageable pageable)`
   - `findByUsuarioIdAndEstado(Long usuarioId, EstadoPedido estado, Pageable pageable)`
   - `findByNumero(String numero)`

### Paso 4: Crear Servicio

1. Crear `PedidoService.java` con lógica de:
   - Crear pedido (validar stock, calcular total)
   - Buscar pedidos usuario
   - Obtener detalle pedido
   - Cambiar estado
   - Generar número único (PED-YYYYMMDD-###)

### Paso 5: Crear Controller

1. Crear `PedidoController.java` con endpoints:
   - POST /api/pedidos
   - GET /api/pedidos
   - GET /api/pedidos/{id}
   - PATCH /api/pedidos/{id}/estado

### Paso 6: Actualizar SecurityConfig

```java
.requestMatchers("/api/pedidos/**").authenticated()
.requestMatchers(HttpMethod.PATCH, "/api/pedidos/**").hasRole("ADMIN")
```

### Paso 7: Crear Tests

1. Crear `PedidoControllerTest.java` con test cases para:
   - POST crear pedido exitoso
   - POST sin stock disponible
   - GET listar pedidos autenticado
   - GET detalle pedido (solo propios)
   - PATCH cambiar estado (solo admin)

---

## 📝 Notas Importantes

1. **Número del pedido:** Generar automáticamente con patrón `PED-YYYYMMDD-###`
2. **Total del pedido:** Calculado automáticamente (suma subtotales)
3. **Validación de stock:** Restar stock al crear pedido
4. **Auditoría:** Guardar timestamps de creación y actualización
5. **Transacciones:** Usar @Transactional para crear pedido + detalles

---

## 🧪 Tests Esperados

Mínimo 12 test cases:

```
✅ testCrearPedidoExitoso
✅ testCrearPedidoSinItems (400)
✅ testCrearPedidoProductoNoExiste (404)
✅ testCrearPedidoStockInsuficiente (409)
✅ testListarPedidosUsuario (200)
✅ testListarPedidosNoAutenticado (401)
✅ testObtenerPedidoDetalle (200)
✅ testObtenerPedidoOtroUsuario (403)
✅ testObtenerPedidoNoExiste (404)
✅ testCambiarEstadoAdminExitoso (200)
✅ testCambiarEstadoNoAdmin (403)
✅ testCambiarEstadoInvalido (400)
```

---

## ✅ Checklist de Implementación

- [ ] Entidades (Pedido, PedidoDetalle, EstadoPedido) creadas
- [ ] DTOs creados (CreatePedidoRequest, PedidoDTO, UpdateEstadoPedidoRequest)
- [ ] Repositories creados con métodos necesarios
- [ ] PedidoService implementado con lógica de negocio
- [ ] PedidoController implementado con 4 endpoints
- [ ] SecurityConfig actualizado para proteger /api/pedidos
- [ ] Tests creados y pasando (mínimo 12)
- [ ] Documentación de endpoints actualizada
- [ ] Servidor compilado y corriendo sin errores

---

## 📚 Referencia Rápida

**Archivo base:** ENDPOINTS_IMPLEMENTATION_GUIDE_UPDATED.md
**Tests base:** ReviewControllerTest.java (como referencia)
**Servicio base:** UsuarioService.java (como referencia)
**Security base:** SecurityConfig.java (JwtRequestFilter)

---

**Próximo paso después de PedidoController:** Admin Dashboard

¡Buena suerte! 🚀
