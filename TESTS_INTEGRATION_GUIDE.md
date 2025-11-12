# Tests de Integración - Perfil y Reseñas

## Resumen de Implementación

Se han creado dos archivos de tests de integración para validar los endpoints implementados:

### 1. UsuarioControllerTest.java
**Ubicación:** `backend/src/test/java/com/milsabores/backend/controller/UsuarioControllerTest.java`

**Endpoints testeados:**
- `GET /api/usuarios/perfil` - Obtener perfil del usuario autenticado
- `PUT /api/usuarios/perfil` - Actualizar datos del perfil
- `PATCH /api/usuarios/perfil/password` - Cambiar contraseña
- `PUT /api/usuarios/perfil/email` - Cambiar email del usuario

**Total de test cases: 8**

#### Test Cases Detallados:

1. **testGetPerfilAutenticado()**
   - Valida que un usuario autenticado pueda obtener su perfil completo
   - Verifica campos: nombre, apellido, email, edad, isDuoc, preferencias
   - Expected: HTTP 200 OK

2. **testGetPerfilNoAutenticado()**
   - Valida que sin autenticación se reciba error 401
   - Expected: HTTP 401 Unauthorized

3. **testActualizarPerfilAutenticado()**
   - Valida actualización de múltiples campos del perfil
   - Campos actualizables: nombre, apellido, fechaNacimiento, edad, isDuoc, hasFelices50, preferencias
   - Expected: HTTP 200 OK con datos actualizados

4. **testCambiarContrasenaExito()**
   - Valida cambio exitoso de contraseña
   - Verifica coincidencia de nuevas contraseñas
   - Expected: HTTP 200 OK con mensaje de éxito

5. **testCambiarContrasenaIncorrectaActual()**
   - Valida rechazo de contraseña actual incorrecta
   - Expected: HTTP 400 Bad Request con mensaje de error

6. **testCambiarContrasenaNoCoinciden()**
   - Valida que las nuevas contraseñas coincidan
   - Expected: HTTP 400 Bad Request si no coinciden

7. **testCambiarContrasenaCorta()**
   - Valida requisito mínimo de 6 caracteres
   - Expected: HTTP 400 Bad Request si es menor a 6 caracteres

8. **testCambiarEmailExito()** y **testCambiarEmailDuplicado()**
   - Valida cambio de email y rechazo de emails duplicados
   - Expected: HTTP 200 para éxito, HTTP 400 para duplicado

---

### 2. ReviewControllerTest.java
**Ubicación:** `backend/src/test/java/com/milsabores/backend/controller/ReviewControllerTest.java`

**Endpoints testeados:**
- `GET /api/productos/{productoId}/reviews` - Listar reseñas de un producto
- `POST /api/productos/{productoId}/reviews` - Crear reseña (JSON)
- `POST /api/productos/{productoId}/reviews` - Crear reseña con imagen (multipart/form-data)
- `DELETE /api/reviews/{id}` - Eliminar una reseña

**Total de test cases: 11**

#### Test Cases Detallados:

1. **testListarResenasProducto()**
   - Valida listar todas las reseñas de un producto
   - Verifica campos: productoId, usuario, texto, rating, fecha
   - Expected: HTTP 200 OK con array de reseñas

2. **testListarResenasProductoSinResennas()**
   - Valida que para un producto sin reseñas devuelve lista vacía
   - Expected: HTTP 200 OK con array vacío

3. **testCrearResennaJSON()**
   - Valida crear reseña usando Content-Type: application/json
   - Campos requeridos: usuario, texto, rating
   - Expected: HTTP 201 Created

4. **testCrearResennaAnonimo()**
   - Valida que si no se proporciona usuario, se guarda como "Anónimo"
   - Expected: HTTP 201 Created con usuario = "Anónimo"

5. **testCrearResennaConImagen()**
   - Valida subida de reseña con imagen
   - Verifica que la imagen se guarda en `./uploads/reviews/`
   - Verifica que imageUrl contiene ruta `/uploads/reviews/`
   - Expected: HTTP 201 Created con imageUrl poblado

6. **testCrearResennaMultipartSinImagen()**
   - Valida crear reseña multipart sin archivo de imagen
   - Expected: HTTP 201 Created con imageUrl vacío/nulo

7. **testListarResenasConImagenes()**
   - Valida que las reseñas con imágenes devuelven el imageUrl correcto
   - Expected: HTTP 200 OK con imageUrl en respuesta

8. **testEliminarResennaExito()**
   - Valida eliminación exitosa de una reseña
   - Expected: HTTP 204 No Content

9. **testEliminarResennaNoExistente()**
   - Valida que eliminar ID no existente devuelve 404
   - Expected: HTTP 404 Not Found

10. **testResenasOrdenPorFecha()**
    - Valida que las reseñas se devuelven ordenadas descendente por fecha
    - Verifica que la más reciente está en índice 0
    - Expected: HTTP 200 OK con orden correcto

11. **testMultiplesResenasProducto()**
    - Valida que se pueden agregar múltiples reseñas al mismo producto
    - Expected: HTTP 201 Created para cada POST, HTTP 200 con todas en GET

---

## Cómo Ejecutar los Tests

### Ejecutar todos los tests de Perfil:
```powershell
cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
.\mvnw.cmd test -Dtest=UsuarioControllerTest
```

### Ejecutar todos los tests de Reseñas:
```powershell
cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
.\mvnw.cmd test -Dtest=ReviewControllerTest
```

### Ejecutar todos los tests del proyecto:
```powershell
cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
.\mvnw.cmd test
```

### Ejecutar test específico:
```powershell
cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
.\mvnw.cmd test -Dtest=UsuarioControllerTest#testGetPerfilAutenticado
```

---

## Notas Técnicas

### Tecnologías Utilizadas:
- **Framework:** Spring Boot 3.5.7
- **Testing:** JUnit 5 (Jupiter), Spring Test, MockMvc
- **Mocking:** MockMultipartFile para archivos de imagen
- **Assertions:** Hamcrest matchers

### Setup de Tests:
- Uso de `@SpringBootTest` para tests de integración completos
- `@AutoConfigureMockMvc` para auto-configurar MockMvc
- Limpieza de BD antes de cada test con `@BeforeEach`
- Simulación de autenticación con `request.setUserPrincipal()`

### Cobertura:
- **UsuarioController:** 8 test cases cubriendo happy path y edge cases
- **ReviewController:** 11 test cases cubriendo CRUD, multipart upload, ordenamiento

### Próximos Pasos:
- [ ] Ejecutar tests y verificar resultados
- [ ] Implementar PedidoController con sus endpoints
- [ ] Agregar tests para PedidoController
- [ ] Implementar búsqueda avanzada y paginación
- [ ] Agregar tests para búsqueda y paginación

---

## Estado de Compilación ✅

El proyecto compila exitosamente con ambos archivos de test:

```
Compilation SUCCESS
```

**Archivos creados/modificados:**
- ✅ `UsuarioControllerTest.java` - 8 test cases
- ✅ `ReviewControllerTest.java` - 11 test cases
- ✅ `UsuarioController.java` - actualizado para soportar perfil completo
- ✅ `PerfilDTO.java` - actualizado sin telefono/direccion
- ✅ `ReviewController.java` - fix en constructor ReviewResponse

Total: **19 test cases** listos para ejecutar.
