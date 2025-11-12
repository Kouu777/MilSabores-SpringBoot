# 📚 MilSabores Backend - Índice de Documentación

## 🎯 Estado Actual

✅ **Servidor corriendo en puerto 8081**
✅ **FIX POST /api/reviews aplicado y compilado**
✅ **Lista para recibir reseñas sin 401 Unauthorized**

---

## 📖 DOCUMENTOS PRINCIPALES

### 🚀 Empezar Aquí
- **[STATUS_SERVIDOR_LISTO.md](STATUS_SERVIDOR_LISTO.md)** ← **COMIENZA AQUÍ**
  - Estado actual del servidor
  - Cómo probar POST /api/reviews
  - Verificación rápida

### 🔧 FIX del 401
- **[SOLUTION_401_FIX_COMPLETE.md](SOLUTION_401_FIX_COMPLETE.md)**
  - Explicación completa del problema y solución
  - Cambios realizados en JwtRequestFilter
  - Resumy del fix aplicado

- **[TECHNICAL_ANALYSIS_JWT_401_FIX.md](TECHNICAL_ANALYSIS_JWT_401_FIX.md)**
  - Análisis técnico profundo
  - Por qué JwtRequestFilter bloqueaba las requests públicas
  - Cómo Spring Security procesa filtros vs autorización

### 🐛 Debugging
- **[DEBUGGING_401_IF_PERSISTS.md](DEBUGGING_401_IF_PERSISTS.md)**
  - Si tu app SIGUE recibiendo 401
  - Checklist paso a paso
  - Verificación del JAR compilado
  - Pruebas desde cURL

---

## 🔌 ENDPOINTS DOCUMENTADOS

### ✅ Implementados y Funcionando

#### Autenticación & Usuarios
```
POST   /api/auth/login               Login con JWT
POST   /api/auth/registro            Registro de usuario
GET    /api/auth/me                  Datos del usuario autenticado
GET    /api/usuarios/perfil          ✅ Obtener perfil (autenticado)
PUT    /api/usuarios/perfil          ✅ Actualizar perfil (autenticado)
PATCH  /api/usuarios/perfil/password ✅ Cambiar contraseña (autenticado)
```

#### Productos
```
GET    /api/productos                Listar todos (público)
GET    /api/productos/{id}           Obtener por ID (público)
GET    /api/productos/categoria/{id} Obtener por categoría ID (público)
GET    /api/productos/buscar/nombre?q=... Buscar por nombre (público)
```

#### Categorías
```
GET    /api/categorias               Listar categorías (público)
GET    /api/categorias/{id}          Obtener categoría (público)
```

#### Reseñas ✅ **AHORA FUNCIONA SIN 401**
```
POST   /api/reviews                  ✅ Crear reseña (PÚBLICO)
GET    /api/productos/{id}/reviews   ✅ Listar reseñas producto (público)
DELETE /api/reviews/{id}             ✅ Eliminar reseña (autenticado)
```

---

## 📱 CÓMO PROBAR DESDE ANDROID

### Test Rápido POST /api/reviews

```kotlin
// En tu Activity o Fragment
val reviewRequest = ReviewRequest(
    usuario = "Usuario",
    texto = "Excelente, muy bueno",
    rating = 5
)

apiService.postReview(reviewRequest).enqueue(object : Callback<ReviewResponse> {
    override fun onResponse(call: Call<ReviewResponse>, response: Response<ReviewResponse>) {
        Log.d("Review", "Código: ${response.code()}")
        if (response.code() == 201) {
            Log.d("Review", "✅ ÉXITO! Código 201 Created")
            Toast.makeText(this@MainActivity, "Reseña creada", Toast.LENGTH_SHORT).show()
        } else if (response.code() == 401) {
            Log.d("Review", "❌ AÚN 401 - Ver DEBUGGING_401_IF_PERSISTS.md")
        }
    }
    override fun onFailure(call: Call<ReviewResponse>, t: Throwable) {
        Log.e("Review", "Error: ${t.message}")
    }
})
```

---

## 🧪 TESTS DISPONIBLES

### Ejecutar Tests

```bash
# Tests de Perfil de Usuario (8 test cases)
.\mvnw test -Dtest=UsuarioControllerTest

# Tests de Reseñas (11 test cases)
.\mvnw test -Dtest=ReviewControllerTest

# Todos los tests
.\mvnw test
```

**Documentación de tests:**
- [TESTS_INTEGRATION_GUIDE.md](TESTS_INTEGRATION_GUIDE.md) - Guía detallada de tests
- [TESTS_HOW_TO.md](TESTS_HOW_TO.md) - Cómo ejecutar tests (en español)
- [TESTS_SUMMARY.md](TESTS_SUMMARY.md) - Resumen ejecutivo de tests

---

## 📋 TAREAS PENDIENTES

### Fase 1 (Próxima Iteración)
- [ ] **Implementar PedidoController**
  - POST /api/pedidos - Crear pedido
  - GET /api/pedidos - Listar pedidos usuario
  - GET /api/pedidos/{id} - Detalle pedido
  - PATCH /api/pedidos/{id}/estado - Cambiar estado (ADMIN)

### Fase 2
- [ ] **Admin Dashboard**
  - GET /api/admin/estadisticas
  - GET /api/admin/usuarios
  - GET /api/admin/pedidos
  - GET /api/admin/productos/bajoStock

- [ ] **Búsqueda Avanzada**
  - GET /api/productos/buscar/avanzado
  - Con paginación y filtros

---

## 🛠️ CONFIGURACIÓN ACTUAL

### Servidor Backend
- **Puerto:** 8081
- **Framework:** Spring Boot 3.5.7
- **Java:** 21.0.9
- **Base de datos:** H2 (en memoria)
- **Seguridad:** JWT (modificado con JwtRequestFilter fix)
- **CORS:** Habilitado para todas las origins

### Base de Datos H2
- **Acceso:** http://192.168.100.8:8081/h2-console
- **JDBC URL:** jdbc:h2:mem:testdb
- **Usuario:** sa
- **Contraseña:** (vacía)

---

## 📁 ESTRUCTURA DE CARPETAS

```
backend/
├── src/main/java/com/milsabores/backend/
│   ├── controller/          ← Controllers (endpoints)
│   │   ├── AuthController.java
│   │   ├── UsuarioController.java
│   │   ├── ProductoController.java
│   │   ├── CategoriaController.java
│   │   └── ReviewController.java ✅
│   ├── model/               ← Entidades JPA
│   │   ├── Usuario.java
│   │   ├── Producto.java
│   │   ├── Categoria.java
│   │   ├── Pedido.java
│   │   ├── PedidoDetalle.java
│   │   └── Review.java ✅
│   ├── repository/          ← Repositories JPA
│   ├── service/             ← Servicios de negocio
│   ├── security/            ← Seguridad JWT
│   │   ├── SecurityConfig.java
│   │   ├── JwtRequestFilter.java ✅ MODIFICADO
│   │   ├── JwtUtil.java
│   │   └── CustomUserDetailsService.java
│   ├── dtos/                ← Data Transfer Objects
│   │   ├── PerfilDTO.java
│   │   ├── ReviewRequest.java ✅
│   │   ├── ReviewResponse.java ✅
│   │   └── ...
│   └── config/              ← Configuración
│       └── WebMvcConfig.java (manejo de /uploads)
├── src/test/java/          ← Tests
│   └── UsuarioControllerTest.java ✅
│   └── ReviewControllerTest.java ✅
├── pom.xml                  ← Dependencias Maven
└── application.properties   ← Configuración app
```

---

## 🔐 SEGURIDAD

### Endpoints Públicos (Sin JWT)
```
✅ GET /api/productos/**
✅ GET /api/categorias/**
✅ GET /api/reviews/**
✅ POST /api/reviews         ← AHORA FUNCIONA SIN 401
✅ POST /api/auth/**
✅ GET /api/auth/**
```

### Endpoints Protegidos (Requieren JWT)
```
🔒 GET /api/usuarios/perfil/**
🔒 PUT /api/usuarios/perfil/**
🔒 PATCH /api/usuarios/perfil/**
🔒 GET /api/pedidos/**
🔒 POST /api/pedidos/**
🔒 GET /api/admin/**
🔒 PATCH /api/admin/**
```

---

## 🚀 CÓMO EMPEZAR

1. **Lee primero:** [STATUS_SERVIDOR_LISTO.md](STATUS_SERVIDOR_LISTO.md)
2. **Verifica servidor en:** http://192.168.100.8:8081
3. **Prueba POST /api/reviews desde tu app Android**
4. **Si falla:** Consulta [DEBUGGING_401_IF_PERSISTS.md](DEBUGGING_401_IF_PERSISTS.md)

---

## 📞 CONTACTO & SOPORTE

Si encuentras problemas:

1. ✅ **Revisa DEBUGGING_401_IF_PERSISTS.md** primero
2. ✅ **Verifica que el servidor está en puerto 8081**
3. ✅ **Comprueba que usas `isPublicEndpoint()` en JwtRequestFilter**
4. ✅ **Limpia caché de la app Android y reinstala**

---

**Última actualización:** 2025-11-11 20:02:25
**Status:** ✅ Servidor listo, FIX aplicado, documentación completa
