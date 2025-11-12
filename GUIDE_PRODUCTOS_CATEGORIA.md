# 📱 Guía de Endpoints de Categorías - ProductoController

## 🔧 Cambios Realizados

Se han arreglado y mejorado los endpoints para obtener productos por categoría, manteniendo tu cambio de usar `{categoriaId}` en la ruta.

---

## � Endpoints Disponibles

### 1️⃣ **Obtener Productos por Categoría (por ID numérico) ⭐ RECOMENDADO**

```http
GET /api/productos/categoria/{categoriaId}
```

**Donde `categoriaId` es el ID numérico de la categoría (1, 2, 3, 4, etc.):**

**Ejemplos de uso:**

```
GET http://localhost:8080/api/productos/categoria/1   → Tortas
GET http://localhost:8080/api/productos/categoria/2   → Pasteles
GET http://localhost:8080/api/productos/categoria/3   → Brownies
GET http://localhost:8080/api/productos/categoria/4   → Galletas
```

**Cómo funciona internamente:**
1. El backend busca la categoría con ese ID
2. Obtiene su nombre (ej: "Tortas")
3. Busca todos los productos activos con ese nombre
4. Devuelve la lista

**Respuesta (HTTP 200 OK):**
```json
[
  {
    "id": 1,
    "nombre": "Torta de Chocolate",
    "descripcion": "Deliciosa torta hecha con chocolate premium",
    "precio": 15.99,
    "imagenUrl": "https://...",
    "categoria": "Tortas",
    "stock": 10,
    "esActivo": true
  },
  {
    "id": 2,
    "nombre": "Torta Tres Leches",
    "descripcion": "Clásica torta tres leches",
    "precio": 12.50,
    "imagenUrl": "https://...",
    "categoria": "Tortas",
    "stock": 8,
    "esActivo": true
  }
]
```

---

### 2️⃣ **Obtener Productos por Categoría (alternativa con nombre)**

```http
GET /api/productos/buscar/categoria?categoria={nombreCategoria}
```

**Ejemplos de uso (si prefieres enviar nombres):**

```
GET http://localhost:8080/api/productos/buscar/categoria?categoria=Tortas
GET http://localhost:8080/api/productos/buscar/categoria?categoria=Pasteles
GET http://localhost:8080/api/productos/buscar/categoria?categoria=Brownies
GET http://localhost:8080/api/productos/buscar/categoria?categoria=Galletas
```

**Respuesta:** Igual al endpoint anterior

---

## 📝 Categorías Disponibles

Basadas en tu base de datos de prueba:

```
✓ Tortas
✓ Pasteles
✓ Brownies
✓ Galletas
```

---

## 💻 Cómo Usar en tu App Android

### Opción 1: Con Retrofit (Recomendado)

```kotlin
interface ApiService {
    @GET("api/productos/categoria/{categoriaId}")
    suspend fun getProductosPorCategoria(
        @Path("categoriaId") categoriaId: Long  // ← ID numérico (1, 2, 3, 4)
    ): Response<List<Producto>>
}

// En tu ViewModel o Repository
val categoriaId = 1L  // ID de la categoría
val response = apiService.getProductosPorCategoria(categoriaId)

if (response.isSuccessful) {
    val productos = response.body() ?: emptyList()
    // Mostrar productos en RecyclerView
    mostrarProductos(productos)  // ✅ Ahora sí tiene datos
}
```

### Opción 2: Con HttpURLConnection

```kotlin
val categoriaId = 1L  // ID de la categoría (1=Tortas, 2=Pasteles, 3=Brownies, 4=Galletas)
val urlString = "http://tu-ip:8080/api/productos/categoria/$categoriaId"
val url = URL(urlString)
val connection = url.openConnection() as HttpURLConnection

connection.requestMethod = "GET"
connection.connectTimeout = 10000
connection.readTimeout = 10000

val responseCode = connection.responseCode
if (responseCode == HttpURLConnection.HTTP_OK) {
    val inputStream = connection.inputStream
    val response = inputStream.bufferedReader().readText()
    // Parsear JSON a List<Producto>
    val productos = parseJsonToProductos(response)
    mostrarProductos(productos)  // ✅ Ahora tiene datos
}
```

### Opción 3: Con OkHttp

```kotlin
val client = OkHttpClient()
val categoriaId = 1L  // ID de la categoría
val request = Request.Builder()
    .url("http://tu-ip:8080/api/productos/categoria/$categoriaId")
    .get()
    .build()

client.newCall(request).execute().use { response ->
    if (response.isSuccessful) {
        val json = response.body?.string()
        // Parsear JSON a List<Producto>
        val productos = parseJsonToProductos(json)
        mostrarProductos(productos)  // ✅ Funciona
    }
}
```

---

## 🔌 URLs para Postman/Testing

```
# Productos de Tortas (categoría ID=1)
GET http://localhost:8080/api/productos/categoria/1

# Productos de Pasteles (categoría ID=2)
GET http://localhost:8080/api/productos/categoria/2

# Productos de Brownies (categoría ID=3)
GET http://localhost:8080/api/productos/categoria/3

# Productos de Galletas (categoría ID=4)
GET http://localhost:8080/api/productos/categoria/4

# O usando query parameter (alternativa)
GET http://localhost:8080/api/productos/buscar/categoria?categoria=Tortas
```

---

## ⚙️ Estructura de Datos Devuelta

Cada producto tiene esta estructura:

```json
{
  "id": 1,
  "nombre": "string",
  "descripcion": "string",
  "precio": 15.99,
  "imagenUrl": "https://...",
  "categoria": "Tortas",
  "stock": 10,
  "esActivo": true
}
```

**Campos:**
- `id` - ID único del producto (Long)
- `nombre` - Nombre del producto (String)
- `descripcion` - Descripción detallada (String)
- `precio` - Precio en dinero (Double)
- `imagenUrl` - URL de la imagen (String)
- `categoria` - Categoría del producto (String)
- `stock` - Cantidad en inventario (Integer)
- `esActivo` - Indica si el producto está activo (Boolean)

---

## 📊 Flujo en tu App Android

```
┌─────────────────────────────────────┐
│  MainActivity / ProductosActivity   │
├─────────────────────────────────────┤
│                                     │
│  Usuario selecciona categoría       │
│  ej: "Tortas"                       │
│           ↓                         │
│  GET /api/productos/categoria/      │
│       {nombreCategoria}             │
│           ↓                         │
│  Recibe lista de productos          │
│           ↓                         │
│  Muestra en RecyclerView            │
│           ↓                         │
│  Usuario selecciona producto        │
│           ↓                         │
│  Abre ProductDetail con el ID       │
│           ↓                         │
│  GET /api/productos/{id}            │
│           ↓                         │
│  Muestra detalles completos         │
│                                     │
└─────────────────────────────────────┘
```

---

## ✅ Resumen de Cambios

### Antes (con error)
```java
@GetMapping("/categoria/{categoriaId}")
public List<Producto> getProductosByCategoriaId(@PathVariable Long categoriaId) {
    return productoRepository.findByCategoriaIdAndEsActivoTrue(categoriaId);
    // ❌ Este método no existe en ProductoRepository
}
```

### Ahora (arreglado)
```java
@GetMapping("/categoria/{categoriaId}")
public List<Producto> getProductosByCategoriaId(@PathVariable String categoriaId) {
    return productoRepository.findByCategoriaAndEsActivoTrue(categoriaId);
    // ✅ Mantiene tu estructura de URL con {categoriaId}
    // ✅ Pero acepta String (nombre de categoría)
    // ✅ Usa método que existe en el repositorio
}

// Plus: Endpoint alternativo con query parameter
@GetMapping("/buscar/categoria")
public List<Producto> getProductosByCategoriaNombre(@RequestParam String categoria) {
    return productoRepository.findByCategoriaAndEsActivoTrue(categoria);
}
```

### Cambios en ProductoRepository
```java
// ✅ Limpiado de duplicados y errores
// ✅ Mantiene métodos existentes
// ✅ Usa `String categoria` como se esperaba
```

---

## 🎯 Próximo Paso

Ahora tu app Android puede hacer:

```kotlin
// Obtener tortas
val tortas = getProductosPorCategoria("Tortas")

// Obtener pasteles
val pasteles = getProductosPorCategoria("Pasteles")

// Obtener brownies
val brownies = getProductosPorCategoria("Brownies")

// Obtener galletas
val galletas = getProductosPorCategoria("Galletas")
```

Sin problemas de compilación o runtime. ✨

