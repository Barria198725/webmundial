# Proyecto IB — Manual de despliegue y uso

Este repositorio incluye:
- `api/`: API REST con Node.js, Express y TypeScript.
- `web/`: frontend con Django que consume la API.
- MySQL: base de datos con script de inicialización en `api/db/init.sql`.
- `docker-compose.yml`: orquesta `db`, `api` y `web`.

## Resumen

La solución expone un endpoint de catálogo en `http://127.0.0.1:3000/api/catalogo` y un frontend Django accesible en `http://127.0.0.1:8000`.

## Requisitos

- Docker Desktop o Docker Engine con Docker Compose v2.
- Opcional: Node.js y Python 3.13 para ejecución local sin Docker.

## Ejecución recomendada (Docker)

1. En la raíz del proyecto, ejecutar:

```bash
docker-compose up --build -d
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
docker-compose down -v
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
- El frontend debe mostrar la lista de productos desde la API.

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

#

