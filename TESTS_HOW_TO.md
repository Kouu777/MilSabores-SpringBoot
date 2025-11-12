# 🧪 Guía de Tests de Integración - MilSabores Backend

## 📌 Resumen Ejecutivo

Se han implementado **19 test cases** de integración para validar dos grupos principales de funcionalidad:

✅ **Perfil de Usuario** (8 tests)
✅ **Reseñas de Productos** (11 tests)

Todos los tests están compilados y listos para ejecutar.

---

## 🎯 ¿Qué se Testea?

### 1️⃣ Endpoints de Perfil de Usuario

```
GET    /api/usuarios/perfil                    → Obtener perfil del usuario autenticado
PUT    /api/usuarios/perfil                    → Actualizar datos del perfil
PATCH  /api/usuarios/perfil/password           → Cambiar contraseña
PUT    /api/usuarios/perfil/email              → Cambiar email
```

**Tests incluidos:**
- ✅ Obtener perfil (autenticado)
- ✅ Obtener perfil (sin autenticación → 401)
- ✅ Actualizar perfil (múltiples campos)
- ✅ Cambiar contraseña (casos exitoso y errores)
- ✅ Cambiar email (validación de duplicados)

### 2️⃣ Endpoints de Reseñas de Productos

```
GET    /api/productos/{productoId}/reviews     → Listar reseñas del producto
POST   /api/productos/{productoId}/reviews     → Crear reseña (JSON)
POST   /api/productos/{productoId}/reviews     → Crear reseña con imagen (multipart)
DELETE /api/reviews/{id}                       → Eliminar reseña
```

**Tests incluidos:**
- ✅ Listar reseñas por producto
- ✅ Crear reseña sin imagen (JSON)
- ✅ Crear reseña con imagen (multipart/form-data)
- ✅ Manejo de usuarios anónimos
- ✅ Eliminación de reseñas
- ✅ Ordenamiento por fecha
- ✅ Múltiples reseñas por producto

---

## 🚀 Cómo Ejecutar los Tests

### Opción A: Usando PowerShell Script (MÁS FÁCIL)

```powershell
# Navega a la carpeta raíz del proyecto
cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1

# Ejecutar solo tests de PERFIL
.\run-tests.ps1 -TestType perfil

# Ejecutar solo tests de RESEÑAS
.\run-tests.ps1 -TestType resenas

# Ejecutar TODOS los tests
.\run-tests.ps1 -TestType todos

# Ver detalles completos (verbose)
.\run-tests.ps1 -TestType perfil -Verbose
```

### Opción B: Usando Maven Directamente

```powershell
cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend

# Solo tests de Perfil
.\mvnw.cmd test -Dtest=UsuarioControllerTest

# Solo tests de Reseñas
.\mvnw.cmd test -Dtest=ReviewControllerTest

# Todos los tests
.\mvnw.cmd test

# Test específico por nombre
.\mvnw.cmd test -Dtest=UsuarioControllerTest#testGetPerfilAutenticado
```

---

## 📂 Archivos Creados

### Tests (Código)

| Archivo | Ubicación | Tests | Descripción |
|---------|-----------|-------|-------------|
| `UsuarioControllerTest.java` | `backend/src/test/java/.../controller/` | 8 | Tests de perfil de usuario |
| `ReviewControllerTest.java` | `backend/src/test/java/.../controller/` | 11 | Tests de reseñas de productos |

### Documentación

| Archivo | Ubicación | Descripción |
|---------|-----------|-------------|
| `TESTS_INTEGRATION_GUIDE.md` | Raíz del proyecto | Guía detallada de cada test |
| `TESTS_SUMMARY.md` | Raíz del proyecto | Resumen ejecutivo y tablas |
| `run-tests.ps1` | Raíz del proyecto | Script PowerShell para ejecutar tests |

---

## 📊 Detalle de Tests

### Perfil de Usuario (8 tests)

#### 1. testGetPerfilAutenticado
```
Descripción: Obtener perfil completo del usuario autenticado
Endpoint: GET /api/usuarios/perfil
Headers: Authorization (simulado)
Validaciones:
  ✅ Status 200 OK
  ✅ Datos del usuario presentes (nombre, apellido, email, edad, isDuoc, preferencias)
  ✅ fechaRegistro incluida
```

#### 2. testGetPerfilNoAutenticado
```
Descripción: Intentar acceder al perfil sin autenticación
Endpoint: GET /api/usuarios/perfil
Headers: Sin Authorization
Validaciones:
  ✅ Status 401 Unauthorized
  ✅ No devuelve datos de usuario
```

#### 3. testActualizarPerfilAutenticado
```
Descripción: Actualizar múltiples campos del perfil
Endpoint: PUT /api/usuarios/perfil
Body JSON:
  {
    "nombre": "Juan Carlos",
    "apellido": "Pérez García",
    "edad": 30,
    "isDuoc": false,
    "hasFelices50": true,
    "preferencias": "Pasteles y tartas"
  }
Validaciones:
  ✅ Status 200 OK
  ✅ Campos actualizados correctamente
  ✅ Email y fechaRegistro no se modifican
```

#### 4. testCambiarContrasenaExito
```
Descripción: Cambiar contraseña exitosamente
Endpoint: PATCH /api/usuarios/perfil/password
Body JSON:
  {
    "passwordActual": "password123",
    "passwordNuevo": "newPassword456",
    "passwordConfirmar": "newPassword456"
  }
Validaciones:
  ✅ Status 200 OK
  ✅ Mensaje de éxito retornado
  ✅ Contraseña encriptada correctamente
```

#### 5. testCambiarContrasenaIncorrectaActual
```
Descripción: Rechazar contraseña actual incorrecta
Endpoint: PATCH /api/usuarios/perfil/password
Body: passwordActual incorrecta
Validaciones:
  ✅ Status 400 Bad Request
  ✅ Mensaje de error apropiado
```

#### 6. testCambiarContrasenaNoCoinciden
```
Descripción: Rechazar si las nuevas contraseñas no coinciden
Endpoint: PATCH /api/usuarios/perfil/password
Body: passwordNuevo ≠ passwordConfirmar
Validaciones:
  ✅ Status 400 Bad Request
  ✅ Mensaje: "Las contraseñas no coinciden"
```

#### 7. testCambiarContrasenaCorta
```
Descripción: Rechazar contraseña muy corta
Endpoint: PATCH /api/usuarios/perfil/password
Body: passwordNuevo = "12345" (< 6 caracteres)
Validaciones:
  ✅ Status 400 Bad Request
  ✅ Mensaje: "debe tener al menos 6 caracteres"
```

#### 8. testCambiarEmailExito / testCambiarEmailDuplicado
```
Descripción: Cambiar email o rechazar si ya existe
Endpoint: PUT /api/usuarios/perfil/email?emailNuevo=nuevo@example.com
Validaciones:
  ✅ Status 200 OK para cambio exitoso
  ✅ Status 400 Bad Request si email ya existe
```

### Reseñas de Productos (11 tests)

#### 1. testListarResenasProducto
```
Descripción: Listar todas las reseñas de un producto
Endpoint: GET /api/productos/1/reviews
Validaciones:
  ✅ Status 200 OK
  ✅ Array con reseñas (id, productoId, usuario, texto, rating, imageUrl, fecha)
  ✅ Cantidad correcta de reseñas
```

#### 2. testListarResenasProductoSinResennas
```
Descripción: Listar reseñas para producto sin reseñas
Endpoint: GET /api/productos/999/reviews
Validaciones:
  ✅ Status 200 OK
  ✅ Array vacío
```

#### 3. testCrearResennaJSON
```
Descripción: Crear reseña enviando JSON
Endpoint: POST /api/productos/1/reviews
Content-Type: application/json
Body JSON:
  {
    "usuario": "Juan Testero",
    "texto": "Muy rico y fresco",
    "rating": 5
  }
Validaciones:
  ✅ Status 201 Created
  ✅ Resena creada con datos correctos
  ✅ ID y fecha autogenerados
```

#### 4. testCrearResennaAnonimo
```
Descripción: Crear reseña sin proporcionar usuario
Endpoint: POST /api/productos/1/reviews
Body: usuario omitido
Validaciones:
  ✅ Status 201 Created
  ✅ usuario = "Anónimo" (valor por defecto)
```

#### 5. testCrearResennaConImagen
```
Descripción: Crear reseña con imagen (multipart/form-data)
Endpoint: POST /api/productos/1/reviews
Content-Type: multipart/form-data
Fields:
  - usuario: "María Fotografía"
  - texto: "La presentación es hermosa"
  - rating: 5
  - image: <archivo.jpg>
Validaciones:
  ✅ Status 201 Created
  ✅ Imagen guardada en ./uploads/reviews/
  ✅ imageUrl retornado: /uploads/reviews/{timestamp}-{uuid}-{filename}
  ✅ Resena asociada a imagen correctamente
```

#### 6. testCrearResennaMultipartSinImagen
```
Descripción: Crear reseña multipart sin archivo
Endpoint: POST /api/productos/1/reviews
Content-Type: multipart/form-data
Fields: (sin archivo)
Validaciones:
  ✅ Status 201 Created
  ✅ imageUrl vacío o null
```

#### 7. testListarResenasConImagenes
```
Descripción: Verificar que imageUrl se devuelve en GET
Endpoint: GET /api/productos/1/reviews
Validaciones:
  ✅ Status 200 OK
  ✅ Reseñas con imagen tienen imageUrl poblado
  ✅ Reseñas sin imagen tienen imageUrl null/vacío
```

#### 8. testEliminarResennaExito
```
Descripción: Eliminar reseña existente
Endpoint: DELETE /api/reviews/1
Validaciones:
  ✅ Status 204 No Content
  ✅ Resena eliminada de BD
  ✅ GET posterior devuelve menos reseñas
```

#### 9. testEliminarResennaNoExistente
```
Descripción: Intentar eliminar resena que no existe
Endpoint: DELETE /api/reviews/9999
Validaciones:
  ✅ Status 404 Not Found
```

#### 10. testResenasOrdenPorFecha
```
Descripción: Verificar que reseñas se devuelven ordenadas por fecha (descendente)
Endpoint: GET /api/productos/1/reviews
Procedimiento:
  1. Listar reseñas iniciales
  2. Crear nueva reseña
  3. Verificar que está en índice 0 (más reciente)
Validaciones:
  ✅ Status 200 OK
  ✅ Reseña más reciente en posición 0
  ✅ Orden descendente por fecha
```

#### 11. testMultiplesResenasProducto
```
Descripción: Crear múltiples reseñas al mismo producto
Endpoint: POST /api/productos/1/reviews (múltiples llamadas)
Procedimiento:
  1. POST 5 nuevas reseñas
  2. GET para verificar total
Validaciones:
  ✅ Cada POST devuelve 201 Created
  ✅ GET devuelve todas (iniciales + nuevas)
  ✅ Total correcto
```

---

## ✅ Tecnologías Usadas

- **Framework:** Spring Boot 3.5.7
- **Testing Framework:** JUnit 5 (Jupiter)
- **HTTP Testing:** MockMvc (Spring Test)
- **Assertions:** Hamcrest Matchers
- **JSON:** Jackson ObjectMapper
- **Multipart:** MockMultipartFile
- **DB Prueba:** H2 In-Memory

---

## 📝 Notas Importantes

### Autenticación en Tests
Los tests simulan autenticación usando:
```java
request.setUserPrincipal(() -> "juan@example.com")
```
Esto permite testear endpoints protegidos sin un JWT real.

### Limpieza de Base de Datos
Cada test está aislado:
```java
@BeforeEach
void setup() {
    usuarioRepository.deleteAll();  // Limpia antes de cada test
}
```

### Upload de Imágenes en Tests
Se usa `MockMultipartFile` para simular uploads sin archivos reales.

---

## 🎯 Próximos Pasos

Después de verificar que los tests pasen:

1. ✅ Ejecutar tests y revisar resultados
2. ▶️ Implementar PedidoController (4 endpoints)
3. ▶️ Crear tests para PedidoController
4. ▶️ Implementar búsqueda avanzada
5. ▶️ Implementar Admin Dashboard

---

## 💡 Consejos de Uso

### Para ver solo el resultado final
```powershell
.\run-tests.ps1 -TestType todos
```

### Para debugging detallado
```powershell
.\run-tests.ps1 -TestType perfil -Verbose
```

### Para ejecutar un test específico
```powershell
cd backend
.\mvnw.cmd test -Dtest=UsuarioControllerTest#testGetPerfilAutenticado
```

---

## ❓ Preguntas Frecuentes

**P: ¿Cuánto tiempo tarda ejecutar los tests?**
R: Entre 30-60 segundos aproximadamente (incluye startup de Spring Boot)

**P: ¿Necesito una base de datos configurada?**
R: No, usa H2 en memoria automáticamente en tests

**P: ¿Se pueden ejecutar en paralelo?**
R: Sí, Maven soporta ejecución paralela con `-T` flag

**P: ¿Qué pasa con las imágenes subidas?**
R: Se guardan en `./uploads/reviews/` en el directorio de ejecución (pueden ser eliminadas después)

---

## 📞 Soporte

Si encuentras problemas ejecutando los tests:

1. Verifica que estés en la carpeta correcta: `MilSabores-SpringBoot-1`
2. Asegúrate de tener Java 17+ instalado: `java -version`
3. Revisa que Maven está disponible: `.\mvnw.cmd -v`
4. Limpia cachés: `.\mvnw.cmd clean`
5. Vuelve a compilar: `.\mvnw.cmd compile`

---

**¡Listos para testear!** 🚀✨
