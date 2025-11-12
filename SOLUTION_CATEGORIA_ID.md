# 🔧 Solución: Productos por Categoría - ID vs Nombre

## 🎯 El Problema

Tu app Android estaba enviando:
```
GET http://192.168.100.8:8080/api/productos/categoria/1
```

Con ID numérico `1`, pero el backend esperaba el **nombre de la categoría** como String. Por eso devolvía un array vacío `[]`.

---

## ✅ La Solución Implementada

He actualizado el `ProductoController` para que ahora:

1. **Acepta IDs numéricos** (como lo hace tu app): `GET /api/productos/categoria/1`
2. **Busca la categoría por ID** en la tabla `categorias`
3. **Obtiene el nombre** de esa categoría (ej: "Tortas")
4. **Busca productos** activos con ese nombre de categoría
5. **Devuelve la lista de productos**

---

## 📊 Flujo Técnico

```
Tu App Android
    ↓
GET /api/productos/categoria/1
    ↓
ProductoController.getProductosByCategoriaId(1)
    ↓
categoriaRepository.findById(1)
    ↓ [Encuentra: Categoria{id=1, nombre="Tortas"}]
    ↓
productoRepository.findByCategoriaAndEsActivoTrue("Tortas")
    ↓
[Lista de productos con categoria="Tortas"]
    ↓
Devuelve JSON con productos
    ↓
Tu App Android muestra los productos
```

---

## 🗂️ Cambios en el Código

### ProductoController.java

**Antes:**
```java
@GetMapping("/categoria/{categoriaId}") 
public List<Producto> getProductosByCategoriaId(@PathVariable String categoriaId) {
    return productoRepository.findByCategoriaAndEsActivoTrue(categoriaId);
    // ❌ Esperaba String, tu app envía número
}
```

**Ahora:**
```java
@GetMapping("/categoria/{categoriaId}") 
public List<Producto> getProductosByCategoriaId(@PathVariable Long categoriaId) {
    // Buscar la categoría por ID
    Optional<Categoria> categoriaOpt = categoriaRepository.findById(categoriaId);
    
    if (categoriaOpt.isPresent()) {
        // Obtener el nombre de la categoría
        String nombreCategoria = categoriaOpt.get().getNombre();
        // Buscar productos activos con ese nombre
        return productoRepository.findByCategoriaAndEsActivoTrue(nombreCategoria);
    }
    
    // Si no existe la categoría, devolver lista vacía
    return List.of();
}
```

---

## 🔗 URLs de Referencia

### Con ID Numérico (Lo que TÚ usas en tu app)
```
GET http://192.168.100.8:8080/api/productos/categoria/1  → Tortas
GET http://192.168.100.8:8080/api/productos/categoria/2  → Pasteles
GET http://192.168.100.8:8080/api/productos/categoria/3  → Brownies
GET http://192.168.100.8:8080/api/productos/categoria/4  → Galletas
```

### Con Query Parameter (Alternativa)
```
GET http://192.168.100.8:8080/api/productos/buscar/categoria?categoria=Tortas
GET http://192.168.100.8:8080/api/productos/buscar/categoria?categoria=Pasteles
```

---

## 📱 Cómo Funciona Ahora en tu App Android

### Lo que enviabas ANTES
```kotlin
// Esto devolvía []
val url = "http://192.168.100.8:8080/api/productos/categoria/1"
val response = apiService.get(url)  // Devolvía array vacío
```

### Lo que sucede AHORA
```kotlin
val categoriaId = 1  // ID de la categoría

// 1️⃣ Tu app envía ID numérico
val url = "http://192.168.100.8:8080/api/productos/categoria/$categoriaId"

// 2️⃣ Backend busca la categoría con ID=1
// SELECT * FROM categorias WHERE id = 1
// Resultado: Categoria{id=1, nombre="Tortas"}

// 3️⃣ Backend busca productos con esa categoría
// SELECT * FROM productos WHERE categoria = "Tortas" AND es_activo = true
// Resultado: [Producto1, Producto2, ...]

// 4️⃣ Backend devuelve los productos en JSON
val response = apiService.get(url)
val productos = response.body  // ✅ Ahora tiene datos!
```

---

## 🧪 Prueba con Postman

```bash
# Obtener productos de la categoría con ID=1 (Tortas)
GET http://localhost:8080/api/productos/categoria/1

# Respuesta esperada:
[
  {
    "id": 1,
    "nombre": "Torta de Chocolate",
    "descripcion": "Deliciosa...",
    "precio": 15.99,
    "imagenUrl": "...",
    "categoria": "Tortas",
    "stock": 10,
    "esActivo": true
  },
  ...
]
```

---

## 📋 Mapeo de IDs a Categorías (basado en tu DataLoader)

| ID | Nombre | Descripción |
|----|--------|-------------|
| 1  | Tortas | Grandes y elaboradas |
| 2  | Pasteles | Medianos y decorados |
| 3  | Brownies | Pequeños y chocolatosos |
| 4  | Galletas | Tradicionales |

---

## ✅ Verificación

### En tu app Android, intenta esto:

```kotlin
// Retrofit
interface ApiService {
    @GET("api/productos/categoria/{categoriaId}")
    suspend fun getProductosPorCategoria(
        @Path("categoriaId") categoriaId: Long
    ): Response<List<Producto>>
}

// Uso
viewModelScope.launch {
    val response = apiService.getProductosPorCategoria(1L)  // ID de categoría
    
    if (response.isSuccessful) {
        val productos = response.body ?: emptyList()
        // ✅ Ahora debe tener productos
        actualizarUI(productos)
    }
}
```

---

## 🔍 Debugging

Si aún no funciona, verifica:

1. **ID de categoría correcto:**
   ```sql
   SELECT id, nombre FROM categorias;
   -- Debe mostrar los IDs disponibles
   ```

2. **Productos con esa categoría:**
   ```sql
   SELECT id, nombre, categoria FROM productos WHERE categoria = 'Tortas';
   -- Debe mostrar productos
   ```

3. **Backend ejecutándose:**
   ```bash
   # Desde c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend
   .\mvnw.cmd spring-boot:run
   ```

4. **Probar directamente en Postman:**
   ```
   GET http://localhost:8080/api/productos/categoria/1
   # Debe devolver JSON con productos (no array vacío)
   ```

---

## 🎉 Resumen

✅ Backend ahora entiende IDs numéricos (1, 2, 3, 4)
✅ Traduce IDs a nombres de categoría automáticamente
✅ Devuelve productos correctamente
✅ Tu app Android debería funcionar sin cambios

**Próxima vez que corras tu app:**
- Debe mostrar productos por categoría ✨
- Logcat debe mostrar status 200 con datos en el body (no `[]`)

