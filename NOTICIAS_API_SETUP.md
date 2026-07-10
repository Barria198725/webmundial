# Configuración de Noticias del Mundial - API SportMonks

## ✅ Lo que se implementó

He agregado una página completa de noticias del Mundial FIFA 2026 que se integra con la API de SportMonks. La implementación incluye:

### 1. **Página de Noticias** (`/noticias/`)
- Hero section personalizado
- Sidebar con información del torneo y clasificación
- Grid de noticias con tarjetas interactivas
- Modal para ver detalles de noticias
- Sistema de filtros (Todas, Partidos, Clasificación, Equipos)
- Diseño responsive

### 2. **Servicios Backend**
- **`core/services/sports_api_service.py`**: Servicio para conectar con SportMonks API
  - Caché de 1 hora para optimizar solicitudes
  - Métodos para obtener: noticias, información del mundial, clasificación, partidos

### 3. **Endpoints API**
- `GET /api/world-cup-news/` - Obtiene noticias del mundial
- `GET /api/world-cup-info/` - Información general del torneo
- `GET /api/world-cup-standings/` - Tabla de clasificación

### 4. **Menú Actualizado**
- El enlace "Noticias" en la navegación ahora apunta a `/noticias/`

## 🔧 Configuración Requerida

### 1. Obtener API Token de SportMonks

1. Visita: https://www.sportmonks.com/
2. Crea una cuenta (hay plan gratuito disponible)
3. Genera un token de API en la configuración de tu cuenta
4. Copia el token

### 2. Configurar Variables de Entorno

En el archivo `web/.env` (o crear si no existe), agrega:

```env
SPORTMONKS_TOKEN=YOUR_TOKEN_HERE
```

Reemplaza `YOUR_TOKEN_HERE` con tu token de SportMonks.

### 3. Ejemplo de Token (para referencia)
```
SPORTMONKS_TOKEN=abc123def456ghi789jkl012mno345pqr
```

## 📋 Archivos Creados/Modificados

### Nuevos Archivos:
- `web/core/services/sports_api_service.py` - Servicio para SportMonks API
- `web/core/services/__init__.py` - Package init
- `web/core/templates/noticias.html` - Template completo de noticias
- `web/.env.example` - Ejemplo de configuración

### Archivos Modificados:
- `web/core/views.py` - Agregadas vistas para noticias y endpoints API
- `web/core/urls.py` - Agregadas rutas para noticias
- `web/core/templates/base.html` - Actualizado enlace a noticias
- `web/config/settings.py` - Agregada configuración de caché

## 🚀 Uso

Una vez configurado el token:

1. Accede a: http://127.0.0.1:8000/noticias/
2. La página cargará automáticamente:
   - Información del mundial
   - Tabla de clasificación
   - Últimas noticias

3. Puedes:
   - Filtrar noticias por tipo
   - Hacer clic en una noticia para ver detalles completos
   - Ver la información del torneo en el sidebar

## 📚 Estructura de la API de SportMonks

### Endpoints utilizados:
- `GET /v3/football/leagues/search/FIFA World Cup` - Info del mundial
- `GET /v3/football/matches` - Partidos del mundial
- `GET /v3/football/standings` - Clasificación
- `GET /v3/football/news` - Noticias

### Documentación:
https://docs.sportmonks.com/

## 🔄 Caché

La aplicación implementa caché de 1 hora para:
- Reducir solicitudes a la API
- Mejorar performance
- Evitar límites de rate limiting

El caché se limpia automáticamente después de 1 hora.

## 💡 Notas Importantes

1. **Plan Gratuito de SportMonks**: Incluye suficientes solicitudes para desarrollo
2. **Rate Limiting**: SportMonks tiene límites según el plan. El caché ayuda a respetarlos
3. **Datos en Tiempo Real**: Los datos se actualizan cada hora (configurable)
4. **Modo Fallback**: Si la API no está disponible, la app mostrará un mensaje de error

## 🐛 Solución de Problemas

### Las noticias no cargan
- Verifica que el token de SportMonks esté correcto en `web/.env`
- Revisa los logs: `docker compose logs web`
- Asegúrate de que SportMonks API esté disponible

### Error 404 en los endpoints API
- Confirma que Docker esté ejecutando: `docker compose ps`
- Reinicia el contenedor web: `docker compose restart web`

### Caché no funciona
- Verifica que `CACHES` esté configurado en `settings.py`
- Los datos se cacheaban con LocMemCache (en memoria)

## 📝 Personalización

### Cambiar tiempo de caché
En `sports_api_service.py`:
```python
CACHE_TTL = 3600  # Cambiar este valor (en segundos)
```

### Agregar más filtros
Edita el HTML en `noticias.html` y agrega nuevos botones de filtro.

### Personalizar estilos
El CSS está incluido al final del archivo `noticias.html`.

---

**¡Ya puedes acceder a las noticias del mundial en tu aplicación!** 🌟⚽
