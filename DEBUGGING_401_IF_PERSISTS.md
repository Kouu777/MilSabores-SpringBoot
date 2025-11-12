# 🔍 DEBUGGING: Aún Recibe 401 en POST /api/reviews

## Si tu app SIGUE recibiendo 401 después del fix

Sigue esta guía paso a paso para identificar el problema.

---

## Paso 1: Verifica que el servidor tiene el NEW JAR

### En Windows PowerShell:

```powershell
# Verifica qué procesos Java están corriendo
Get-Process java | Select-Object ProcessName, Handles

# Intenta ver qué puerto está escuchando
netstat -ano | findstr 8081

# Debería mostrar: PID escuchando en puerto 8081
```

### Verifica la hora de inicio del JAR:

```powershell
# Lista archivos con fecha
Get-ChildItem "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend\target\" | 
  Where-Object {$_.Name -eq "backend-0.0.1-SNAPSHOT.jar"} | 
  Select-Object Name, LastWriteTime
```

**Debe ser reciente (después de 20:00)** - Si es viejo (19:00 o antes), significa el JAR viejo está en uso.

---

## Paso 2: Detén TODOS los Java y limpia

```powershell
# Mata todos los procesos Java
taskkill /F /IM java.exe

# Espera 2 segundos
Start-Sleep -Seconds 2

# Verifica que no hay Java corriendo
Get-Process java -ErrorAction SilentlyContinue | Measure-Object

# Si retorna Count: 0, está limpio
```

---

## Paso 3: Recompila el proyecto completamente

```powershell
cd "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend"

# Elimina carpeta target
Remove-Item -Recurse -Force target -ErrorAction SilentlyContinue

# Maven clean + package sin tests
.\mvnw.cmd clean package -DskipTests -q

# Esto toma ~20 segundos
```

---

## Paso 4: Inicia el servidor NUEVO

```powershell
cd "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend"

java -jar target\backend-0.0.1-SNAPSHOT.jar
```

**Espera a ver:**
```
Tomcat started on port 8081 (http) with context path '/'
Started BackendApplication in XX seconds
```

**Nota:** El servidor quedará en primer plano. NO cierres esta ventana. Abre otra PowerShell.

---

## Paso 5: Verifica que el JwtRequestFilter tiene el fix

```powershell
# Verifica que el código fuente tiene el fix
Get-Content "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend\src\main\java\com\milsabores\backend\security\JwtRequestFilter.java" | 
  Select-String "isPublicEndpoint"

# Debería mostrar: private boolean isPublicEndpoint(String path, String method) {
```

---

## Paso 6: Prueba desde cURL primero

```powershell
# Antes de probar desde Android, prueba desde Windows

# Test 1: Crear reseña simple
curl -X POST "http://localhost:8081/api/reviews" `
  -H "Content-Type: application/json" `
  -d '{
    "usuario": "Usuario",
    "texto": "Excelente",
    "rating": 5
  }'

# Respuesta esperada: 201 Created (NO 401)
```

---

## Paso 7: Verifica los logs del servidor

Mientras el servidor está corriendo, busca logs de error:

```
# En la ventana del servidor, deberías ver:

✅ INFO ... JwtRequestFilter   : Procesando request public: POST /api/reviews
✅ INFO ... ReviewController   : Creando reseña...
✅ INFO ... Hibernate          : INSERT INTO review...
```

❌ **Si ves:**
```
ERROR ... JwtRequestFilter  : Token no válido
ERROR ... JwtAuthEntryPoint : Unauthorized
```

Significa el filtro ESTÁ validando JWT (el fix no se aplicó).

---

## Paso 8: Verifica que SecurityConfig tiene la regla

```powershell
# Busca la línea POST reviews permitAll
Select-String -Path "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend\src\main\java\com\milsabores\backend\security\SecurityConfig.java" `
  -Pattern "POST.*reviews.*permitAll"

# Debería encontrar: .requestMatchers(HttpMethod.POST, "/api/reviews").permitAll()
```

---

## Paso 9: Verifica CORS en Android

En tu logcat, busca los headers de la respuesta:

```
I okhttp: Vary: Origin
I okhttp: Vary: Access-Control-Request-Method
I okhttp: Content-Type: application/json
```

Si **falta** `Access-Control-Allow-Origin`, el problema es CORS (aunque logcat seguiría mostrando 401).

---

## Paso 10: Fuerza reload en Android

Si todo lo anterior está correcto pero la app sigue dando 401:

1. **Limpia caché de la app:**
   - Abre Settings > Apps > [Tu App] > Storage > Clear Cache
   - O desinstala y reinstala

2. **Limpia datos de Retrofit/OkHttp:**
   - Si tienes interceptor que guarda tokens, resetéalo
   - Asegúrate que NO envíes `Authorization: Bearer ...` en POST /api/reviews

3. **Verifica headers en Android:**
```kotlin
// Asegúrate que NO incluyes token para este endpoint
val request = Request.Builder()
    .url("http://192.168.100.8:8081/api/reviews")
    .post(body)
    .header("Content-Type", "application/json")
    // ❌ NO agregues: .header("Authorization", "Bearer $token")
    .build()
```

---

## Checklist de Debugging

| Paso | Verificación | Estado |
|------|--------------|--------|
| 1 | ¿Hay Java proceso en 8081? | ☐ |
| 2 | ¿JAR es reciente (después 20:00)? | ☐ |
| 3 | ¿`isPublicEndpoint` existe en código? | ☐ |
| 4 | ¿SecurityConfig tiene `permitAll` POST? | ☐ |
| 5 | ¿cURL retorna 201 desde Windows? | ☐ |
| 6 | ¿App Android no envía Authorization header? | ☐ |
| 7 | ¿Tomcat dice "started on port 8081"? | ☐ |
| 8 | ¿Logs muestran "Creando reseña..." sin error? | ☐ |

Si TODOS están ☑️, debería funcionar.

---

## Último Recurso: Rebuild y Deploy Manual

```powershell
cd "c:\Users\Marti\Desktop\MilSabores-SpringBoot-1\backend"

# 1. Mata todo
taskkill /F /IM java.exe 2>$null
Start-Sleep -Seconds 3

# 2. Limpia completamente
Remove-Item -Recurse -Force target -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ".m2/repository" -ErrorAction SilentlyContinue

# 3. Recompila desde cero
.\mvnw.cmd clean package -DskipTests

# 4. Verifica que se creó el JAR
Get-Item "target\backend-0.0.1-SNAPSHOT.jar" -ErrorAction Stop

# 5. Inicia el servidor
java -jar target\backend-0.0.1-SNAPSHOT.jar
```

---

## Contáctame si persiste el 401

Si después de TODO esto sigue habiendo 401:

1. Comparte los logs del servidor (las líneas con ERROR)
2. Comparte el logcat de Android (líneas de okhttp)
3. Verifica que estás usando puerto **8081** (no 8080)
4. Verifica que el backend es **http** (no https)

El 401 se soluciona con el JwtRequestFilter fix - si persiste, hay algo más profundo que necesita investigación.

---

**¡Buena suerte! 🚀**
