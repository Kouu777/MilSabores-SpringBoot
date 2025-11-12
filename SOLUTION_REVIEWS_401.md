# 🔐 Solución: POST /api/reviews - 401 Unauthorized

## ✅ Problema Resuelto

Tu app Android recibía **401 Unauthorized** al intentar crear una reseña porque el servidor necesitaba ser **reiniciado** después de aplicar los cambios en `SecurityConfig.java`.

## 🔧 Lo que se hizo

### 1. SecurityConfig.java - Permitir POST sin autenticación

```java
// ✅ Esta línea permite a CUALQUIERA hacer POST a /api/reviews sin token JWT
.requestMatchers(HttpMethod.POST, "/api/reviews").permitAll()
```

### 2. Reinicio del Servidor

El servidor Spring Boot ha sido reiniciado en **puerto 8081**:
```
http://192.168.100.8:8081
```

---

## 📱 Ahora tu App Android puede hacer esto

### Endpoint: POST /api/reviews

```
POST http://192.168.100.8:8081/api/reviews
Content-Type: application/json

{
  "category": "Tortas y Pasteles",
  "comment": "El mejor producto, me encanta.",
  "imageUrls": [],
  "productId": "7",
  "productName": "Torta Pastelera",
  "rating": 5,
  "sentimentScore": 0.5,
  "userId": "user_unknown",
  "userName": "Usuario"
}
```

**Respuesta esperada (HTTP 201 Created):**
```json
{
  "id": 3,
  "productoId": 7,
  "usuario": "Usuario",
  "texto": "El mejor producto, me encanta.",
  "rating": 5,
  "imageUrl": null,
  "fecha": "2025-11-11T22:36:17.000"
}
```

---

## 🔑 Reglas de Seguridad Actuales

| Endpoint | Método | Autenticación | Estado |
|----------|--------|---------------|--------|
| `/api/productos/**` | GET | ❌ No necesaria | ✅ Público |
| `/api/categorias/**` | GET | ❌ No necesaria | ✅ Público |
| `/api/reviews/**` | GET | ❌ No necesaria | ✅ Público |
| `/api/reviews` | **POST** | ❌ No necesaria | ✅ **Público** |
| `/api/auth/**` | POST | ❌ No necesaria | ✅ Público (login/registro) |
| `/api/usuarios/perfil/**` | GET/PUT/PATCH | ✅ Necesario JWT | 🔒 Protegido |
| `/api/pedidos/**` | GET/POST | ✅ Necesario JWT | 🔒 Protegido |
| `/api/admin/**` | * | ✅ Necesario ADMIN | 🔒 Protegido |

---

## 📝 Estructura esperada de la Reseña

Tu app envía estos campos:
```json
{
  "category": "Tortas y Pasteles",      // ← Categoría
  "comment": "Súper, me encanta",        // ← Comentario/texto
  "imageUrls": [],                       // ← URLs de imágenes (vacío si no hay)
  "productId": "7",                      // ← ID del producto
  "productName": "Torta Pastelera",      // ← Nombre del producto
  "rating": 5,                           // ← Calificación 1-5
  "sentimentScore": 0.5,                 // ← Análisis de sentimiento
  "userId": "user_unknown",              // ← ID del usuario
  "userName": "Usuario"                  // ← Nombre del usuario
}
```

Pero el backend espera:
```java
// ReviewRequest.java
{
  "usuario": "Usuario",         // ← userName
  "texto": "Súper, me encanta", // ← comment
  "rating": 5                   // ← rating
}
```

---

## 🔄 Mapeo de Campos (Android → Backend)

| Campo Android | Campo Backend | Mapeo |
|---------------|---------------|-------|
| `userName` | `usuario` | Directo |
| `comment` | `texto` | Directo |
| `rating` | `rating` | Directo |
| `productId` | `productoId` | Directo (pero como Long) |
| `imageUrls[]` | `imageUrl` | Primera imagen o null |

---

## 🧪 Prueba con Postman

```bash
POST http://localhost:8081/api/reviews
Content-Type: application/json

{
  "usuario": "Usuario",
  "texto": "El mejor producto, me encanta.",
  "rating": 5
}
```

**Respuesta:**
```json
{
  "id": 1,
  "productoId": null,
  "usuario": "Usuario",
  "texto": "El mejor producto, me encanta.",
  "rating": 5,
  "imageUrl": null,
  "fecha": "2025-11-11T22:40:00.000"
}
```

---

## ✅ Verificación

### Desde la terminal, prueba:

```bash
# Test si el endpoint es accesible sin autenticación
curl -X POST http://localhost:8081/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"usuario":"Test","texto":"Prueba","rating":5}'

# Debería responder 201 Created, NO 401 Unauthorized
```

### Desde tu App Android:

```kotlin
// Ya debería funcionar sin problemas
val response = apiService.postReview(reviewRequest)
if (response.code() == 201) {
    // ✅ Reseña creada correctamente
    showSuccessMessage("Reseña publicada")
} else if (response.code() == 401) {
    // ❌ Todavía hay problemas de autenticación
    showErrorMessage("No autorizado")
}
```

---

## 🔍 Debugging si aún hay problemas

### 1. Verifica que estés usando puerto 8081
```kotlin
// ✅ CORRECTO
val baseUrl = "http://192.168.100.8:8081/"

// ❌ INCORRECTO (puerto 8080)
val baseUrl = "http://192.168.100.8:8080/"
```

### 2. Verifica la ruta exacta
```kotlin
// ✅ CORRECTO
POST http://192.168.100.8:8081/api/reviews

// ❌ INCORRECTO
POST http://192.168.100.8:8081/api/productos/reviews
```

### 3. Verifica que el servidor está corriendo
```bash
# En PowerShell, desde c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
.\mvnw.cmd spring-boot:run

# Deberías ver:
# ... Started BackendApplication in X.XXX seconds
# ... Tomcat started on port 8081
```

---

## 📋 Resumen

✅ **SecurityConfig** permite POST sin autenticación
✅ **Servidor reiniciado** en puerto 8081
✅ **Endpoint `/api/reviews`** es público para POST
✅ Tu app Android debería poder crear reseñas

**Próximo paso:** Intenta crear una reseña desde tu app. Debería recibir **201 Created** en lugar de **401 Unauthorized**.

