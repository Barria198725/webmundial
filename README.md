# Mundo Fútbol 2026 — Manual de despliegue y uso

**Equipo de desarrollo:**
- Irving Barria
- Angelica Gaitán
- Rene Vega
- Alejandro Castillo

Este repositorio contiene una plataforma web completa para el Mundial 2026.
Incluye un frontend Django que muestra las secciones de inicio, partidos, sedes, leyendas y noticias,
además de una API REST en Node.js/TypeScript que sirve datos de partidos, grupos y goleadores.

## Qué hace este proyecto

- Muestra una página principal con el calendario del Mundial, la sección de predicciones y estadios.
- Consume una API propia para obtener y renderizar partidos, grupos y goleadores.
- Incluye una interfaz de login básica, perfil de usuario y un área de apuesta/predicción.
- Tiene rutas de sedes para países anfitriones como USA, México y Canadá.
- Usa MySQL para mantener datos de equipos, partidos, usuarios y estadísticas.

## Tecnologías usadas

- Backend API: Node.js, Express, TypeScript, MySQL.
- Frontend: Django, HTML, CSS, JavaScript.
- Contenedores: Docker y Docker Compose.
- Estilos y scripts: archivos en `web/core/static/css/` y `web/core/static/js/`.

## Estructura del proyecto

- `docker-compose.yml`: orquesta los servicios `db`, `api` y `web`.
- `api/`: API REST.
  - `Dockerfile`
  - `package.json`
  - `tsconfig.json`
  - `src/`: lógica de la API y repositorios.
  - `db/init.sql`: esquema y datos iniciales.
- `web/`: aplicación Django.
  - `Dockerfile`
  - `requirements.txt`
  - `manage.py`
  - `config/`: configuración de Django.
  - `core/`: vistas, templates, estáticos y lógica del frontend.

## URLs principales

- Frontend Django: `http://127.0.0.1:8000/`
- API: `http://127.0.0.1:3000`
- Endpoint salud: `http://127.0.0.1:3000/health`
- Inicio: `http://127.0.0.1:8000/`
- Partidos: `http://127.0.0.1:8000/partidos/`
- Login: `http://127.0.0.1:8000/login/`
- Perfil: `http://127.0.0.1:8000/profile/`
- Historial: `http://127.0.0.1:8000/history/`
- Noticias: `http://127.0.0.1:8000/noticias/`
- Leyendas: `http://127.0.0.1:8000/legends/`
- Sedes:
  - `http://127.0.0.1:8000/sedes/USA`
  - `http://127.0.0.1:8000/sedes/MEX`
  - `http://127.0.0.1:8000/sedes/CAN`
- API de partidos: `http://127.0.0.1:3000/api/matches`
- API de grupos: `http://127.0.0.1:3000/api/groups`
- API de goleadores: `http://127.0.0.1:3000/api/scorers`
- API de catálogo: `http://127.0.0.1:3000/api/catalogo`
- Login API: `http://127.0.0.1:3000/auth/login`

## Mapa de la página

```text
Inicio
├── Página principal
│   ├── Calendario del Mundial
│   ├── Sección de predicciones
│   └── Estadios y sedes
├── Partidos
│   └── Listado de partidos y grupos
├── Sedes
│   ├── USA
│   ├── México
│   └── Canadá
├── Leyendas
│   └── Información complementaria del torneo
├── Noticias
│   └── Contenido informativo y actualizaciones
└── Usuario
    ├── Login
    └── Perfil y predicciones
```

## Requisitos

- Docker Desktop o Docker Engine con Docker Compose v2.
- Opcional: Node.js y Python 3.13 si se quiere correr localmente sin Docker.

## Ejecución recomendada con Docker

1. En la raíz del proyecto:

```bash
docker compose up --build -d
```

2. Verificar contenedores:

```bash
docker ps
```

3. Abrir el frontend:

```text
http://127.0.0.1:8000
```

4. Detener y eliminar contenedores:

```bash
docker compose down -v
```

## Ejecución alternativa sin Docker

### API

```bash
cd api
npm install
npm run build
node dist/app.js
```

### Frontend

```bash
cd web
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

## Uso y características principales

- Login de usuario y perfil básico.
- Página de predicciones con partidos iniciales y entradas de score.
- Tabla de goleadores estática y datos de partidos consumidos por la API.
- Navegación entre secciones principales del Mundial.
- Diseño responsive con estilos actualizados para el tema del sitio.

## Verificaciones recomendadas

- `GET http://127.0.0.1:3000/health` responde 200.
- `GET http://127.0.0.1:3000/api/matches` devuelve partidos.
- `GET http://127.0.0.1:3000/api/groups` devuelve grupos.
- `GET http://127.0.0.1:3000/api/scorers` devuelve goleadores.
- El frontend muestra la página principal en `http://127.0.0.1:8000/`.
- La ruta de partidos se carga en `http://127.0.0.1:8000/partidos/`.
- Las páginas de sedes, noticias, login y perfil están disponibles en sus URLs correspondientes.

## Arquitectura y detalles

- `api/` usa un repositorio MySQL y capas de dominio, infra y presentación.
- `web/` usa templates Django (`web/core/templates/`) y assets estáticos (`web/core/static/`).
- El frontend consume `window.API_BASE_URL` para conectar con la API.
- La base de datos inicializa tablas y datos básicos en `api/db/init.sql`.

## Equipo de trabajo

- Irving Barria
- Angelica Gaitán
- Rene Vega
- Alejandro Castillo

## Funcionalidades pendientes

- Mejorar el flujo de login para validación completa con backend.
- Agregar guardado real de apuestas en una API `POST /api/predictions`.
- Implementar un dashboard de usuario con historial de predicciones.
- Añadir autenticación y autorización completa para rutas privadas.
- Agregar filtros y búsqueda en la sección de partidos.

## Contribución

Si quieres colaborar con el proyecto:

1. Crea una rama basada en `main`.
2. Implementa funcionalidades o correcciones en `api/` y `web/`.
3. Verifica el comportamiento con Docker o ejecución local.
4. Envía un resumen de cambios con los archivos modificados.

Final Web Mundial 