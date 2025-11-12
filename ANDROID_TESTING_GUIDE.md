# 📱 INSTRUCCIONES: Cómo Probar desde Android Studio

## ✅ ANTES DE COMENZAR

1. **Servidor debe estar corriendo:**
   ```bash
   cd c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
   java -jar target\backend-0.0.1-SNAPSHOT.jar
   # Debería mostrar: "Tomcat started on port 8081"
   ```

2. **Base URL debe ser 8081 (no 8080):**
   ```kotlin
   const val BASE_URL = "http://192.168.100.8:8081/api/"
   ```

3. **Android device/emulator conectado a la misma red**

---

## 🧪 PRUEBA 1: Crear Reseña SIN Autenticación ✅ (AHORA FUNCIONA)

### Logcat esperado:
```
INFO: --> POST http://192.168.100.8:8081/api/reviews
INFO: Content-Type: application/json; charset=UTF-8
INFO: Content-Length: 221
INFO: {"usuario":"Usuario","texto":"Excelente producto","rating":5}
INFO: --> END POST
INFO: <-- 201 http://192.168.100.8:8081/api/reviews (94ms)  ← ✅ 201, NO 401
INFO: <-- END HTTP (response body)
```

### Código en Android:

```kotlin
// Retrofit service
interface ReviewService {
    @POST("reviews")
    suspend fun createReview(@Body request: ReviewRequest): Response<ReviewResponse>
}

// POJO/Data class
data class ReviewRequest(
    val usuario: String,
    val texto: String,
    val rating: Int
)

data class ReviewResponse(
    val id: Long,
    val usuario: String,
    val texto: String,
    val rating: Int,
    val imageUrl: String?,
    val fecha: String
)

// En tu Activity/Fragment:
val reviewRequest = ReviewRequest(
    usuario = "Usuario",
    texto = "Excelente, muy bueno",
    rating = 5
)

lifecycleScope.launch {
    try {
        val response = reviewService.createReview(reviewRequest)
        
        if (response.isSuccessful) {
            Log.d("Review", "✅ Reseña creada: ${response.body()}")
            // Mostrar mensaje de éxito
            Toast.makeText(this@MainActivity, "Reseña publicada", Toast.LENGTH_SHORT).show()
        } else {
            Log.e("Review", "❌ Error ${response.code()}: ${response.errorBody()?.string()}")
        }
    } catch (e: Exception) {
        Log.e("Review", "❌ Exception: ${e.message}")
    }
}
```

### Respuesta esperada (HTTP 201):
```json
{
  "id": 1,
  "usuario": "Usuario",
  "texto": "Excelente, muy bueno",
  "rating": 5,
  "imageUrl": null,
  "fecha": "2025-11-11T23:55:00.000"
}
```

---

## 🧪 PRUEBA 2: Crear Reseña CON Imagen

### Código en Android:

```kotlin
// Retrofit service
interface ReviewService {
    @Multipart
    @POST("reviews")
    suspend fun createReviewWithImage(
        @Part("usuario") usuario: RequestBody,
        @Part("texto") texto: RequestBody,
        @Part("rating") rating: RequestBody,
        @Part image: MultipartBody.Part?
    ): Response<ReviewResponse>
}

// En tu Activity/Fragment:
val usuario = RequestBody.create("text/plain".toMediaType(), "Usuario")
val texto = RequestBody.create("text/plain".toMediaType(), "Excelente producto")
val rating = RequestBody.create("text/plain".toMediaType(), "5")

// Obtener imagen del storage
val imageUri = Uri.parse("content://...")
val imageFile = File(cacheDir, "review_image.jpg")
val inputStream = contentResolver.openInputStream(imageUri)
val outputStream = FileOutputStream(imageFile)
inputStream?.copyTo(outputStream)

val imagePart = MultipartBody.Part.createFormData(
    "image",
    "review_image.jpg",
    imageFile.asRequestBody("image/jpeg".toMediaType())
)

lifecycleScope.launch {
    try {
        val response = reviewService.createReviewWithImage(
            usuario, texto, rating, imagePart
        )
        
        if (response.isSuccessful) {
            val reviewResponse = response.body()
            Log.d("Review", "✅ Con imagen: ${reviewResponse?.imageUrl}")
        }
    } catch (e: Exception) {
        Log.e("Review", "Error: ${e.message}")
    }
}
```

### Respuesta esperada:
```json
{
  "id": 2,
  "usuario": "Usuario",
  "texto": "Excelente producto",
  "rating": 5,
  "imageUrl": "/uploads/reviews/1699768200000-a1b2c3d4-review_image.jpg",
  "fecha": "2025-11-11T23:56:00.000"
}
```

---

## 🧪 PRUEBA 3: Listar Reseñas de un Producto

### Código en Android:

```kotlin
interface ReviewService {
    @GET("productos/{productoId}/reviews")
    suspend fun getReviewsByProduct(@Path("productoId") productoId: Long): Response<List<ReviewResponse>>
}

// En tu Activity/Fragment:
lifecycleScope.launch {
    try {
        val response = reviewService.getReviewsByProduct(productoId = 7)
        
        if (response.isSuccessful) {
            val reviews = response.body() ?: emptyList()
            Log.d("Review", "✅ ${reviews.size} reseñas encontradas")
            
            reviews.forEach { review ->
                Log.d("Review", "- ${review.usuario} (${review.rating}⭐): ${review.texto}")
            }
        }
    } catch (e: Exception) {
        Log.e("Review", "Error: ${e.message}")
    }
}
```

### Respuesta esperada (HTTP 200):
```json
[
  {
    "id": 1,
    "usuario": "Usuario1",
    "texto": "Excelente",
    "rating": 5,
    "imageUrl": null,
    "fecha": "2025-11-11T23:55:00"
  },
  {
    "id": 2,
    "usuario": "Usuario2",
    "texto": "Muy bueno",
    "rating": 4,
    "imageUrl": "/uploads/reviews/...",
    "fecha": "2025-11-11T23:56:00"
  }
]
```

---

## 🧪 PRUEBA 4: Obtener Perfil (CON Autenticación)

### Primero: Login

```kotlin
data class LoginRequest(
    val email: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val usuario: UsuarioData
)

interface AuthService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
}

lifecycleScope.launch {
    try {
        val response = authService.login(LoginRequest(
            email = "usuario@duocuc.cl",
            password = "12345"
        ))
        
        if (response.isSuccessful) {
            val token = response.body()?.token
            Log.d("Auth", "✅ Token: $token")
            
            // Guardar token para próximas requests
            SharedPreferences.saveToken(token)
        }
    } catch (e: Exception) {
        Log.e("Auth", "Error: ${e.message}")
    }
}
```

### Luego: Obtener Perfil

```kotlin
data class PerfilDTO(
    val id: Long,
    val nombre: String,
    val apellido: String,
    val email: String,
    val fechaNacimiento: String?,
    val edad: Int?,
    val isDuoc: Boolean?,
    val hasFelices50: Boolean?,
    val preferencias: String?,
    val fechaRegistro: String
)

interface UsuarioService {
    @GET("usuarios/perfil")
    suspend fun getPerfil(
        @Header("Authorization") token: String
    ): Response<PerfilDTO>
}

lifecycleScope.launch {
    try {
        val token = SharedPreferences.getToken()  // Obtener token guardado
        val response = usuarioService.getPerfil("Bearer $token")
        
        if (response.isSuccessful) {
            val perfil = response.body()
            Log.d("Perfil", "✅ ${perfil?.nombre} ${perfil?.apellido}")
        } else if (response.code() == 401) {
            Log.e("Perfil", "❌ Token expirado o inválido")
        }
    } catch (e: Exception) {
        Log.e("Perfil", "Error: ${e.message}")
    }
}
```

### Respuesta esperada (HTTP 200):
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "usuario@duocuc.cl",
  "fechaNacimiento": "1990-05-15",
  "edad": 34,
  "isDuoc": true,
  "hasFelices50": false,
  "preferencias": "Panadería, Tortas",
  "fechaRegistro": "2025-11-10T10:00:00"
}
```

---

## 📊 TABLA DE ENDPOINTS LISTOS

| Endpoint | Método | Autenticación | Estado | Prueba |
|----------|--------|---|--------|--------|
| `/api/auth/login` | POST | ❌ No | ✅ Funciona | Login |
| `/api/auth/registro` | POST | ❌ No | ✅ Funciona | Registro |
| `/api/reviews` | POST | ❌ **No (AHORA FUNCIONA)** | ✅ **201 Created** | PRUEBA 1 |
| `/api/reviews` | POST | Multipart | ❌ No | ✅ Funciona | PRUEBA 2 |
| `/api/productos/{id}/reviews` | GET | ❌ No | ✅ Funciona | PRUEBA 3 |
| `/api/usuarios/perfil` | GET | ✅ Sí | ✅ Funciona | PRUEBA 4 |
| `/api/productos` | GET | ❌ No | ✅ Funciona | - |
| `/api/productos/{id}` | GET | ❌ No | ✅ Funciona | - |
| `/api/categorias` | GET | ❌ No | ✅ Funciona | - |

---

## 🔧 DEBUGGING

### Si recibes 401 aún:

1. **Verifica el puerto:**
   ```kotlin
   // ✅ CORRECTO
   const val BASE_URL = "http://192.168.100.8:8081/api/"
   
   // ❌ INCORRECTO
   const val BASE_URL = "http://192.168.100.8:8080/api/"
   ```

2. **Verifica que el servidor esté corriendo:**
   ```bash
   # En PowerShell
   Get-NetTCPConnection -LocalPort 8081 | Select-Object -ExpandProperty State
   # Debería mostrar: Listening
   ```

3. **Verifica el logcat:**
   ```
   <-- 401 http://192.168.100.8:8081/api/reviews
   {"error":"Unauthorized","message":"Full authentication is required"}
   ```
   Si ves esto → El servidor tiene la vieja versión. Reinicia.

4. **Reinicia el servidor:**
   ```bash
   taskkill /F /IM java.exe
   cd backend
   java -jar target\backend-0.0.1-SNAPSHOT.jar
   ```

---

## ✅ ESPERADO vs INCORRECTO

### ✅ CORRECTO (Nuevo)
```
Request:
POST http://192.168.100.8:8081/api/reviews
{"usuario":"Usuario","texto":"...","rating":5}

Response:
201 Created
{"id":1,"usuario":"Usuario",...}

Logcat:
<-- 201 http://192.168.100.8:8081/api/reviews
```

### ❌ INCORRECTO (Viejo - Si ves esto, reinicia servidor)
```
Request:
POST http://192.168.100.8:8081/api/reviews
{"usuario":"Usuario","texto":"...","rating":5}

Response:
401 Unauthorized
{"error":"Full authentication is required"}

Logcat:
<-- 401 http://192.168.100.8:8081/api/reviews
```

---

## 📋 PASOS PARA PROBAR

1. **Asegúrate que el servidor está corriendo:**
   ```bash
   # En PowerShell
   java -jar target\backend-0.0.1-SNAPSHOT.jar
   # Espera a ver: "Tomcat started on port 8081"
   ```

2. **En Android Studio, ejecuta la app:**
   ```
   Run → Run 'app'
   ```

3. **Navega a la sección de reviews:**
   ```
   Ver productos → Seleccionar producto → Ver/Crear reseña
   ```

4. **Intenta crear una reseña:**
   ```
   Llenar formulario → Click "Publicar"
   ```

5. **Verifica en logcat:**
   ```
   Buscar: "201" o "Unauthorized"
   ```

---

## 🎯 RESULTADO ESPERADO

```
✅ App puede crear reseña SIN login
✅ App ve respuesta 201 Created (no 401)
✅ Reseña aparece en listado
✅ Si subes imagen, se guarda en servidor
✅ Si intentas acceder perfil, pide login primero
```

¡Ahora sí debería funcionar todo! 🚀
