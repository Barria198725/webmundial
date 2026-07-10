# Mas Mundial — Manual de despliegue y uso

**Equipo de desarrollo:**
- Irving Barria
- Alejandro Castillo
- Rene Vega
- Algelica Gaitan

Este repositorio incluye:
- `api/`: API REST con Node.js, Express y TypeScript.
- `web/`: frontend con Django que consume la API y muestra las páginas del Mundial.
- MySQL: base de datos con script de inicialización en `api/db/init.sql`.
- `docker-compose.yml`: orquesta `db`, `api` y `web`.

## Resumen

La solución expone:
- API catálogo en `http://127.0.0.1:3000/api/catalogo`
- Frontend Django en `http://127.0.0.1:8000`
- Página de partidos en `http://127.0.0.1:8000/partidos/`
- Páginas de sedes en `http://127.0.0.1:8000/sedes/USA`, `.../MEX`, `.../CAN`

## Requisitos

- Docker Desktop o Docker Engine con Docker Compose v2.
- Opcional: Node.js y Python 3.13 para ejecución local sin Docker.

## Ejecución recomendada (Docker)

1. En la raíz del proyecto, ejecutar:

```bash
docker compose up --build -d
```

2. Verificar los contenedores:

```bash
docker ps
```

3. Probar la API:

```bash
curl -s http://127.0.0.1:3000/api/catalogo
```

4. Abrir el frontend en el navegador:

```text
http://127.0.0.1:8000
```

5. Para detener y eliminar contenedores y volúmenes:

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

## Verificaciones básicas

- `GET http://127.0.0.1:3000/health` debe responder con estado 200.
- `GET http://127.0.0.1:3000/api/catalogo` debe devolver JSON con el catálogo.
- El frontend debe mostrar la página principal y permitir navegar a `/partidos/`.
- Las sedes deben mostrarse en la sección de hosts con imágenes actualizadas.

## Arquitectura del proyecto

- `api/` está organizada en capas: `domain`, `usecases`, `infra`, `presentation`.
- `web/` es una aplicación Django con vistas, servicios y plantillas.
- La base de datos MySQL se inicializa con `api/db/init.sql`.

## Estructura principal

- `docker-compose.yml`
- `api/`
  - `Dockerfile`
  - `package.json`
  - `tsconfig.json`
  - `src/`
  - `db/init.sql`
- `web/`
  - `Dockerfile`
  - `requirements.txt`
  - `manage.py`
  - `config/`
  - `core/`

## Actualizaciones recientes

### Nuevas funcionalidades

- Agregada la página de `partidos` en `web/core/templates/partidos.html`.
- Implementado un cargador limpio que usa solo `web/core/static/data/partidos.json`.
- Se eliminó el contenido de prueba y los datos predeterminados incorrectos del frontend.
- Actualizadas las imágenes de sedes en `web/core/templates/index.html` para usar los archivos correctos.
- Agregado el recorrido de sedes en `web/core/urls.py` con `country_detail` para `USA`, `MEX` y `CAN`.

### Importación de fixtures

- Creado/actualizado `web/core/scripts/import_fixtures.py` para convertir el Excel de fixtures en JSON.
- El script parsea las hojas de grupos `A` a `L` y genera `web/core/static/data/partidos.json` y `web/static/data/partidos.json`.
- Ahora los resultados de la fase de grupos se cargan con los equipos correctos y los goles correctos.

### Contenido y datos

- `web/core/static/data/partidos.json` contiene los partidos reales que se muestran en la página de `partidos`.
- Las imágenes de sede ahora usan los archivos reales en `web/core/static/images/sedes/`.
- Las páginas de detalle de sede usan portadas y vistas previas de estadio desde `web/core/data/country_data.py`.

### Correcciones visuales

- Página principal ajustada para ofrecer un diseño más limpio y ordenado.
- Se mejoró la navegación de sedes y se corrigieron los iconos/rutas de imagen.
- Se estructuró el HTML para facilitar la lectura y el mantenimiento.

## Cómo probar los cambios adicionales

1. Ejecutar el frontend:

```bash
cd web
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

2. Abrir en el navegador:

```text
http://127.0.0.1:8000
```

3. Probar rutas clave:

- `http://127.0.0.1:8000/partidos/`
- `http://127.0.0.1:8000/sedes/USA`
- `http://127.0.0.1:8000/sedes/MEX`
- `http://127.0.0.1:8000/sedes/CAN`

4. Si quieres regenerar partidos desde Excel:

```bash
python web/core/scripts/import_fixtures.py doc/Fixture-Copa-Mundial-FIFA-2026_ClasesExcel.xlsx
```

