# Mas Mundial — Documentación completa

## 1. Descripción general

Mas Mundial es un proyecto full-stack para exponer información relacionada con la Copa Mundial, incluyendo:

- un dashboard principal con datos de partidos, resultados y un conteo regresivo,
- un catálogo de productos/servicios,
- vistas de autenticación, perfil e historial,
- integración con noticias deportivas desde NewsAPI,
- una API REST desarrollada en Node.js + TypeScript y un frontend en Django.

Este repositorio está pensado para ejecutarse de forma sencilla con Docker Compose, aunque también permite desarrollar y probar cada parte por separado.

## 2. Equipo de desarrollo

- Irving Barria
- Alejandro Castillo
- Rene Vega
- Angelica Gaitan

## 3. Tecnologías utilizadas

### Backend API
- Node.js
- TypeScript
- Express
- MySQL
- Docker

### Frontend web
- Python
- Django
- HTML/CSS/JavaScript
- Templates Django

### Infraestructura
- Docker Compose
- MySQL 8.0

## 4. Estructura del proyecto

```text
.
├── docker-compose.yml
├── README.md
├── api/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── db/
│   │   ├── init.sql
│   │   ├── migrate_add_indexes.mysql.sql
│   │   ├── migrate_add_indexes.sql
│   │   └── mundialdb_backup_*.sql
│   └── src/
│       ├── app.ts
│       ├── domain/
│       ├── infra/
│       ├── presentation/
│       └── usecases/
└── web/
    ├── Dockerfile
    ├── requirements.txt
    ├── manage.py
    ├── config/
    └── core/
        ├── static/
        ├── templates/
        ├── urls.py
        ├── views.py
        └── domain/
```

## 5. Requisitos previos

### Opción recomendada: Docker
- Docker Desktop o Docker Engine
- Docker Compose v2

### Opción alternativa para desarrollo local
- Node.js 20 o superior
- Python 3.12/3.13
- MySQL (si se desea ejecutar la API sin contenedores)

## 6. Inicio rápido con Docker Compose

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up --build -d
```

Esto levantará los servicios:

- db: base de datos MySQL en el puerto 3307
- api: backend en el puerto 3000
- web: frontend Django en el puerto 8000

### 6.1 Verificar que los servicios estén activos

```bash
docker ps
```

### 6.2 Probar la API

```bash
curl http://127.0.0.1:3000/health
```

Respuesta esperada:

```json
{ "status": "ok" }
```

### 6.3 Probar el catálogo

```bash
curl http://127.0.0.1:3000/api/catalogo
```

### 6.4 Abrir la aplicación en el navegador

- Frontend: http://127.0.0.1:8000
- API: http://127.0.0.1:3000

### 6.5 Detener y limpiar todo

```bash
docker compose down -v
```

## 7. Ejecución local sin Docker

### 7.1 Backend API

```bash
cd api
npm install
npm run build
node dist/app.js
```

Si la API necesita conectarse a una base de datos local, asegúrate de exportar o configurar las variables de entorno adecuadas:

```bash
set DB_HOST=127.0.0.1
set DB_PORT=3306
set DB_USER=root
set DB_PASSWORD=root
set DB_NAME=mundialdb
```

### 7.2 Frontend Django

```bash
cd web
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

> En Windows PowerShell, si el script de activación es bloqueado por la política de ejecución, puedes usar:
>
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> ```

## 8. Variables de entorno

### API
La API carga valores desde variables de entorno y también desde un archivo .env si existe.

Variables esperadas:

- DB_HOST
- DB_PORT
- DB_USER
- DB_PASSWORD
- DB_NAME
- PORT (opcional, por defecto 3000)

### Frontend Django
El proyecto Django lee lo siguiente:

- API_BASE_URL: URL base de la API para que el frontend consuma correctamente los servicios.
- NEWSAPI_TOKEN: token opcional para mostrar noticias desde NewsAPI.

Ejemplo:

```env
API_BASE_URL=http://localhost:3000
NEWSAPI_TOKEN=tu_token_aqui
```

## 9. Endpoints disponibles

### API REST

- GET /health
  - Devuelve un estado de salud de la API.

- GET /api/catalogo
  - Devuelve el catálogo de productos/servicios.

- GET /api/matches
  - Devuelve información de partidos.

- GET /api/groups
  - Devuelve información de grupos.

- GET /api/scorers
  - Devuelve información de goleadores.

- POST /auth/login
  - Endpoint de autenticación.

### Vistas del frontend Django

- /
  - Página principal del dashboard.

- /login/
  - Vista para iniciar sesión.

- /profile/
  - Perfil del usuario.

- /history/
  - Historial de actividades o resultados.

## 10. Funcionalidades principales

### Dashboard principal
El frontend muestra un panel principal con:

- conteo regresivo hacia eventos relevantes,
- último resultado,
- próximo partido,
- ticker de noticias y actualizaciones,
- bloques visuales con información del torneo.

### Catálogo
La API expone un catálogo que puede usarse tanto para mostrar información en el frontend como para integraciones futuras.

### Autenticación básica
El backend incluye un endpoint de autenticación para operaciones de login.

## 11. Base de datos

La base de datos se levanta con MySQL 8.0 mediante Docker Compose.

### Servicios de base de datos
- Contenedor: db
- Puerto expuesto: 3307 (host) -> 3306 (contenedor)
- Base de datos: mundialdb
- Usuario: root
- Contraseña: root

Los scripts SQL iniciales se encuentran en:

- api/db/init.sql
- api/db/migrate_add_indexes.mysql.sql
- api/db/migrate_add_indexes.sql

## 12. Verificaciones básicas

Después de levantar el proyecto, puedes comprobar lo siguiente:

- http://127.0.0.1:3000/health responde con estado 200.
- http://127.0.0.1:3000/api/catalogo devuelve un JSON válido.
- http://127.0.0.1:8000 carga correctamente la interfaz principal.
- Si se configuró NEWSAPI_TOKEN, se muestran noticias en la pantalla principal.

## 13. Troubleshooting

### El contenedor de la API no inicia
Revisa los logs:

```bash
docker compose logs -f api
```

### La base de datos aún no está lista
El servicio api puede tardar un poco en encontrar la base de datos. Espera unos segundos y vuelve a verificar.

### El puerto ya está ocupado
Si 3000 o 8000 ya están siendo usados, cambia los puertos en docker-compose.yml o detén los servicios que ocupan esos puertos.

### No aparecen noticias en la interfaz
La app muestra noticias solo si la variable NEWSAPI_TOKEN está configurada correctamente.

### Problemas al activar el entorno virtual de Python en Windows
Usa este comando:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## 14. Cambios recientes en la interfaz

Se ha mejorado el diseño del dashboard principal en los archivos:

- web/core/templates/index.html
- web/core/static/css/main.css

Entre los cambios principales se incluyen:

- diseño más compacto y proporcional para el conteo regresivo y los paneles,
- reducción del alto de las tarjetas para aprovechar mejor el ancho,
- alineación más limpia hacia la izquierda,
- incorporación de iconos de bandera en el ticker de partidos,
- uniformidad visual entre resultados y el bloque de próximo partido.

## 15. Cómo probar los cambios visuales

1. Levanta el frontend:

```bash
cd web
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

2. Abre en el navegador:

```text
http://127.0.0.1:8000
```

3. Revisa que el dashboard principal muestre:

- el conteo regresivo y los paneles en una distribución compacta,
- el último resultado y el próximo partido alineados visualmente,
- las noticias del ticker con banderas junto al texto.

## 16. Notas de desarrollo

- Si cambias archivos del frontend, puedes recargar la página directamente en el navegador para ver los cambios.
- Si modificas el backend, reinicia el servicio de la API con:

```bash
docker compose restart api
```

- Si el cambio afecta a la base de datos, revisa primero los scripts SQL y los volúmenes persistidos de Docker.

