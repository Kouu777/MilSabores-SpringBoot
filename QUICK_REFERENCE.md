# ⚡ QUICK REFERENCE - Una Página

## ¿QUÉ PASÓ?

```
PROBLEMA:  POST /api/reviews → 401 Unauthorized
CAUSA:     JwtRequestFilter validaba JWT para TODOS
SOLUCIÓN:  Agregado isPublicEndpoint() para saltar public endpoints
RESULTADO: POST /api/reviews → 201 Created ✅
```

---

## ✅ VERIFICAR QUE FUNCIONA

### Windows PowerShell
```powershell
$body = '{"usuario":"Usuario","texto":"Excelente","rating":5}'
Invoke-WebRequest -Uri "http://localhost:8081/api/reviews" -Method POST `
    -Headers @{"Content-Type"="application/json"} -Body $body | 
    Select-Object StatusCode

# StatusCode: 201 → ¡FUNCIONA!
# StatusCode: 401 → Ver DEBUGGING_401_IF_PERSISTS.md
```

### Android Kotlin
```kotlin
apiService.postReview(ReviewRequest("Usuario","Excelente",5))
    .enqueue(object : Callback<ReviewResponse> {
        override fun onResponse(call: Call<ReviewResponse>, response: Response<ReviewResponse>) {
            if (response.code() == 201) Log.d("✅", "¡Funciona!")
            else if (response.code() == 401) Log.d("❌", "Aún 401")
        }
    })
```

---

## 📚 DOCUMENTACIÓN (ORDEN DE LECTURA)

1. **START_HERE_READ_ME.txt** (2 min) - Resumen 60 seg
2. **STATUS_SERVIDOR_LISTO.md** (5 min) - Cómo probar
3. **SOLUTION_401_FIX_COMPLETE.md** (10 min) - Entender
4. **INSTRUCCIONES_FINALES.md** (5 min) - Qué hacer ahora
5. **DEBUGGING_401_IF_PERSISTS.md** (30 min) - Si hay problemas

---

## 🔧 EL FIX EN 10 LÍNEAS

**Archivo:** `JwtRequestFilter.java`

```java
@Override
protected void doFilterInternal(HttpServletRequest request, 
                                HttpServletResponse response,
                                FilterChain chain) throws ServletException, IOException {
    
    // ✅ NUEVO: Si es endpoint público, saltar JWT
    if (isPublicEndpoint(request.getServletPath(), request.getMethod())) {
        chain.doFilter(request, response);
        return;
    }
    
    // ... resto del código (validar JWT si NO es público)
}

private boolean isPublicEndpoint(String path, String method) {
    if (path.startsWith("/api/reviews") && method.equals("POST")) return true;
    // ... más public endpoints
    return false;
}
```

---

## 📊 ESTADO PROYECTO

| Métrica | Valor |
|---------|-------|
| Endpoints Implementados | 22/34 (64%) |
| Tests Pasando | 19/19 (100%) |
| Servidor | Puerto 8081 ✅ |
| Último Fix | POST /api/reviews |
| Documentación | 10 archivos |

---

## 🚀 PRÓXIMA TAREA

Implementar **PedidoController**
- 4 endpoints (POST, GET, GET/:id, PATCH)
- 2 entidades (Pedido, PedidoDetalle)
- 12+ tests
- Tiempo: 4-6 horas
- Ver: **FASE2_PEDIDOCONTROLLER_ROADMAP.md**

---

## 🆘 SI HAY PROBLEMAS

### Aún recibes 401?

```powershell
# 1. Mata Java
taskkill /F /IM java.exe

# 2. Rebuild
cd backend
Remove-Item -Recurse -Force target
.\mvnw.cmd clean package -DskipTests -q

# 3. Inicia
java -jar target\backend-0.0.1-SNAPSHOT.jar

# 4. Prueba
# (ver arriba: Verificar que funciona)

# 5. Si persiste
# Leer: DEBUGGING_401_IF_PERSISTS.md
```

---

## 📞 LINKS RÁPIDOS

- **Servidor:** http://192.168.100.8:8081
- **H2 Console:** http://192.168.100.8:8081/h2-console
- **Base:** jdbc:h2:mem:testdb (usuario: sa, sin pwd)
- **GitHub:** github.com/Kouu777/MilSabores-SpringBoot

---

## ✅ CHECKLIST

- [ ] Leí START_HERE_READ_ME.txt
- [ ] Probé POST /api/reviews y retorna 201
- [ ] Probé desde Android y funciona
- [ ] Entiendo qué se cambió en JwtRequestFilter
- [ ] Estoy listo para Fase 2

---

**Última actualización: 2025-11-11 20:02:25**
