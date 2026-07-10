
# Documento Técnico - Implementación del Calendario Interactivo
## Copa Mundial de la FIFA 2026™

---

**Asignatura:** Desarrollo avanzado de aplicaciones web  
**Profesor:** Angel Avila  
**Año:** 2026  
**Autores:**  
- Irving Barria  
- Alejandro Castillo  
- Rene Vega  
- Angelica Gaitan  

---

## Índice

1. [Introducción](#1-introducción)
2. [Análisis del Problema](#2-análisis-del-problema)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Extracción de Datos Oficiales](#4-extracción-de-datos-oficiales)
5. [Procesamiento y Limpieza de Datos](#5-procesamiento-y-limpieza-de-datos)
6. [Diseño de Base de Datos](#6-diseño-de-base-de-datos)
7. [API REST - Backend](#7-api-rest---backend)
8. [Frontend - Calendario Interactivo](#8-frontend---calendario-interactivo)
9. [Despliegue con Docker](#9-despliegue-con-docker)
10. [Pruebas y Verificación](#10-pruebas-y-verificación)
11. [Conclusiones](#11-conclusiones)

---

## 1. Introducción

Este documento describe la implementación completa del **calendario interactivo** del Mundial 2026 dentro del proyecto "Mundo Fútbol 2026". El objetivo fue integrar el fixture oficial de la Copa Mundial de la FIFA™, proporcionando a los usuarios una herramienta visual para consultar partidos, fechas, estadios y resultados.

El proyecto utiliza una arquitectura de microservicios con:
- **Backend:** API REST en Node.js/TypeScript con Clean Architecture
- **Frontend:** Aplicación web en Django/Python
- **Base de datos:** MySQL 8.0
- **Orquestación:** Docker Compose

---

## 2. Análisis del Problema

### 2.1 Problemas Identificados

Al revisar el estado inicial del proyecto, se detectaron los siguientes problemas:

1. **Datos incompletos en la base de datos:**
   - La tabla `matches` solo contenía 2 partidos de ejemplo
   - No existía información real del Mundial 2026
   - La tabla `teams` solo tenía 3 registros (USA, Mexico, Canada)

2. **Errores en el script de inicialización (`api/db/init.sql`):**
   - Definición duplicada de la tabla `catalog`
   - Referencia a columna `category` inexistente en la primera definición
   - Esto impedía que el script se ejecutara correctamente

3. **Problemas de codificación de caracteres:**
   - Caracteres especiales aparecían como `Ã`, `Â`, `â` (mojibake UTF-8)
   - Afectaba nombres de equipos, estadios y etapas del torneo
   - Causado por almacenamiento incorrecto de UTF-8 como Latin-1

4. **Equipos duplicados:**
   - `Canada` vs `Canadá`
   - `Mexico` vs `México`
   - `USA` vs `Estados Unidos`
   - Esto generaba inconsistencias en las búsquedas y joins

5. **Problemas de despliegue:**
   - Volumen de base de datos sin etiqueta SELinux (`:z`)
   - `API_BASE_URL` mal configurado para consumo desde navegador
   - Imágenes estáticas faltantes o con nombres incorrectos
   - CSS roto por error tipográfico en `:root`

### 2.2 Requisitos Funcionales

- Mostrar calendario mensual navegable
- Listar partidos por día con toda la información oficial
- Diferenciar entre partidos jugados y por jugar
- Mostrar estadios, equipos, marcadores y etapas del torneo
- Consumir datos desde la API del backend

---

## 3. Arquitectura del Sistema

### 3.1 Diagrama de Arquitectura

```
┌─────────────────┐     HTTP      ┌──────────────────┐     MySQL      ┌──────────────┐
│                 │──────────────▶│                  │──────────────▶│              │
│  Navegador      │   :8000       │   Django         │   :3307       │   MySQL      │
│  (Frontend)     │               │   (Web Server)   │               │   (Database) │
│                 │◀──────────────│                  │◀──────────────│              │
└─────────────────┘               └──────────────────┘               └──────────────┘
                                            │
                                            │ HTTP
                                            │ :3000
                                            ▼
                                   ┌──────────────────┐
                                   │   API Node.js    │
                                   │   (Express)       │
                                   │   Clean Arch      │
                                   └──────────────────┘
```

### 3.2 Componentes Principales

#### Backend (API)
- **Framework:** Express.js en Node.js 20
- **Lenguaje:** TypeScript
- **Arquitectura:** Clean Architecture (Entities, Repositories, Controllers, Routes)
- **Base de datos:** MySQL 8.0 con mysql2/promise
- **Puerto:** 3000

#### Frontend (Web)
- **Framework:** Django 6.0.7
- **Lenguaje:** Python 3.13
- **Templates:** HTML con Jinja2
- **Estilos:** CSS custom con variables CSS
- **JavaScript:** Vanilla JS para interactividad del calendario
- **Puerto:** 8000

#### Base de Datos
- **Motor:** MySQL 8.0.46
- **Charset:** utf8mb4_unicode_ci
- **Puerto expuesto:** 3307 (host) → 3306 (contenedor)

---

## 4. Extracción de Datos Oficiales

### 4.1 Fuente de Datos

Se utilizó la página oficial de FIFA como fuente única de verdad:
- **URL:** https://www.fifa.com/es/tournaments/mens/worldcup/canadamexicousa2026/articles/calendario-fixture-mundial-2026-partidos-fechas
- **Técnica:** Web scraping con Firecrawl

### 4.2 Proceso de Scraping

```bash
firecrawl scrape "https://www.fifa.com/es/tournaments/..." \
  --only-main-content \
  --wait-for 3000 \
  -o .firecrawl/fifa-calendar.md
```

**Parámetros utilizados:**
- `--only-main-content`: Extrae solo el contenido principal, sin navegación
- `--wait-for 3000`: Espera 3 segundos para que JavaScript renderice el contenido
- `-o`: Guarda el resultado en archivo Markdown

### 4.3 Estructura del Datos Extraídos

El contenido extraído incluye:
- Encabezados de fecha (ej: `#### **Jueves, 11 de junio 2026**`)
- Tabla de partidos con formato markdown
- Información de: equipos, marcadores, estadios, etapas
- Partidos de fase de grupos y eliminatorias

---

## 5. Procesamiento y Limpieza de Datos

### 5.1 Parsing del Markdown

Se desarrolló un parser en Python para extraer partidos del formato Markdown:

```python
# Patrones detectados:
# - Fase de grupos: [México 2-0 Sudáfrica](url) – Grupo A - Estadio ...
# - Eliminatorias: Partido 73 – [Sudáfrica 0-1 Canadá](url) \ - Estadio ...
# - Con hora: Partido 77 - 17:00 – [Francia 3-0 Suecia](url) \ - Estadio ...
```

**Desafíos encontrados:**
1. **Formato split:** Algunos partidos tenían links separados: `[República de Corea 2-1](url) [Chequia](url)`
2. **Saltos de línea escapados:** `\\-` en lugar de `-` en el markdown
3. **Texto embebido:** Algunas líneas tenían múltiples partidos concatenados
4. **Marcadores en prórroga/penales:** `(tras prórroga)`, `(Paraguay gana 3-4 en penaltis)`

### 5.2 Normalización de Datos

**Campos extraídos por partido:**
```typescript
interface Match {
  id: number;
  date: string;        // ISO 8601: "2026-06-11T18:00:00.000Z"
  stage: string;       // "Grupo A", "Dieciseisavos de final", etc.
  homeTeam: string;    // Nombre del equipo local
  awayTeam: string;    // Nombre del equipo visitante
  homeScore: number | null;
  awayScore: number | null;
  status: "upcoming" | "live" | "finished";
  venue: string;       // Estadio completo
}
```

**Limpieza aplicada:**
- Eliminación de texto de prórroga/penales de nombres de equipos
- Extracción de horarios cuando estaban presentes
- Normalización de nombres de estadios
- Corrección de partidos mal parseados

### 5.3 Corrección de Errores de Parsing

Se detectaron y corrigieron 3 errores:
1. **Partido faltante:** Corea del Sur vs Chequia (11/06)
2. **Partido mal parseado:** Bosnia vs Catar tenía texto embebido de Escocia vs Brasil
3. **Partido faltante:** Canadá vs Catar (18/06)

**Total final:** 104 partidos parseados correctamente.

---

## 6. Diseño de Base de Datos

### 6.1 Esquema de Base de Datos

```sql
-- Tabla principal de partidos
CREATE TABLE matches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `date` DATETIME NOT NULL,
  stage VARCHAR(100),
  home_team_id INT,
  away_team_id INT,
  home_score INT NULL,
  away_score INT NULL,
  status ENUM('upcoming','live','finished') DEFAULT 'upcoming',
  venue VARCHAR(255),
  FOREIGN KEY (home_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  FOREIGN KEY (away_team_id) REFERENCES teams(id) ON DELETE SET NULL,
  INDEX idx_matches_home (home_team_id),
  INDEX idx_matches_away (away_team_id),
  UNIQUE KEY uk_matches_unique (date, home_team_id, away_team_id)
);

-- Tabla de equipos
CREATE TABLE teams (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  country VARCHAR(200),
  flag_url VARCHAR(512),
  stadiums INT DEFAULT 0,
  cities INT DEFAULT 0,
  matches INT DEFAULT 0,
  UNIQUE KEY uk_teams_name (name)
);
```

### 6.2 Estrategia de Poblado

**Problema:** El script `init.sql` se ejecuta solo en la primera inicialización del volumen de Docker.

**Solución implementada:**
1. **Seed inicial (`init.sql`):** Solo estructura + datos básicos
2. **Seed de partidos (`matches_seed.sql`):** Script separado para poblar partidos
3. **Ejecución manual post-despliegue:**
   ```bash
   podman exec -i webmundial_db_1 mysql -uroot -proot mundialdb < api/db/matches_seed.sql
   ```

### 6.3 Generación de Datos

Se desarrolló un script Python (`generate_sql.py`) que:
1. Lee el JSON de partidos parseados
2. Extrae equipos únicos (52 equipos)
3. Genera INSERTs con subqueries para IDs de equipos
4. Maneja valores NULL para partidos sin marcador

```python
# Ejemplo de INSERT generado:
INSERT INTO teams (name) VALUES
  ('Alemania'),
  ('Arabia Saudí'),
  ...
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO matches (date, stage, home_team_id, away_team_id, ...) VALUES
  ('2026-06-11 18:00:00', 'Grupo A', 
   (SELECT id FROM teams WHERE name = 'México'),
   (SELECT id FROM teams WHERE name = 'Sudáfrica'), ...);
```

---

## 7. API REST - Backend

### 7.1 Arquitectura Clean

```
src/
├── domain/
│   ├── entities/
│   │   └── Match.ts          # Entidad de dominio
│   └── repositories/
│       └── worldRepository.ts # Interfaz del repositorio
├── infra/
│   ├── database/
│   │   └── mysqlConnection.ts # Pool de conexiones
│   └── repositories/
│       └── mysqlWorldRepository.ts # Implementación MySQL
└── presentation/
    ├── controllers/
    │   └── worldController.ts # Lógica de controladores
    └── routes/
        └── worldRoutes.ts     # Definición de rutas
```

### 7.2 Entidad Match

```typescript
export interface Match {
  id: number;
  date: string;  // ISO 8601 string
  stage: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  status: "upcoming" | "live" | "finished";
  venue: string;
}
```

### 7.3 Repositorio MySQL

**Consulta SQL principal:**
```sql
SELECT 
  m.id, 
  m.date, 
  m.stage, 
  ht.name as homeTeam, 
  at.name as awayTeam, 
  m.home_score as homeScore, 
  m.away_score as awayScore, 
  m.status, 
  m.venue
FROM matches m
LEFT JOIN teams ht ON m.home_team_id = ht.id
LEFT JOIN teams at ON m.away_team_id = at.id
ORDER BY m.date ASC
```

**Transformación de datos:**
```typescript
return (rows as any[]).map((row) => ({
  id: row.id,
  date: row.date.toISOString(),  // Convertir Date a ISO string
  stage: row.stage,
  homeTeam: row.homeTeam,
  awayTeam: row.awayTeam,
  homeScore: row.homeScore,
  awayScore: row.awayScore,
  status: row.status,
  venue: row.venue,
}));
```

### 7.4 Endpoints Disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/health` | GET | Health check de la API |
| `/api/catalogo` | GET | Catálogo de productos |
| `/api/matches` | GET | **Lista de partidos del Mundial** |
| `/api/groups` | GET | Tabla de posiciones por grupo |
| `/api/scorers` | GET | Goleadores del torneo |

### 7.5 Respuesta de Ejemplo

```json
[
  {
    "id": 1,
    "date": "2026-06-11T18:00:00.000Z",
    "stage": "Grupo A",
    "homeTeam": "México",
    "awayTeam": "Sudáfrica",
    "homeScore": 2,
    "awayScore": 0,
    "status": "finished",
    "venue": "Estadio Ciudad de México"
  }
]
```

---

## 8. Frontend - Calendario Interactivo

### 8.1 Estructura del Frontend

```
web/
├── core/
│   ├── static/
│   │   ├── css/
│   │   │   └── main.css          # Estilos principales
│   │   ├── js/
│   │   │   └── calendar.js       # Lógica del calendario
│   │   └── images/               # Imágenes estáticas
│   └── templates/
│       └── base.html             # Template base
│       └── index.html            # Página principal
```

### 8.2 Lógica del Calendario (`calendar.js`)

**Estado global:**
```javascript
const calendarState = {
  matches: [],              // Todos los partidos
  matchesByDate: new Map(), // Partidos agrupados por fecha
  currentMonth: null,       // Mes actual visualizado
  selectedDateKey: null,    // Fecha seleccionada
  todayKey: new Date().toISOString().slice(0, 10),
};
```

**Funciones principales:**

1. **`fetchJson(path)`:** Obtiene datos desde la API
2. **`buildMatchesByDate(matches)`:** Agrupa partidos por fecha
3. **`renderCalendarGrid()`:** Renderiza la cuadrícula del mes
4. **`renderAgenda()`:** Muestra partidos del día seleccionado
5. **`selectDate(dateKey)`:** Selecciona una fecha y actualiza la vista

**Inicialización:**
```javascript
async function initializeCalendar() {
  const matches = await fetchJson("/api/matches");
  calendarState.matches = matches;
  calendarState.matchesByDate = buildMatchesByDate(matches);
  
  // Seleccionar hoy si hay partidos, sino el primer partido
  calendarState.selectedDateKey = 
    calendarState.matchesByDate.has(calendarState.todayKey)
      ? calendarState.todayKey
      : utcDateKey(matches[0].date);
  
  renderCalendar();
}
```

### 8.3 Interactividad

- **Navegación mensual:** Botones anterior/siguiente
- **Selección de día:** Click en cualquier día del calendario
- **Indicadores visuales:**
  - Puntos en días con partidos
  - Resaltado del día actual
  - Resaltado del día seleccionado
- **Panel de detalles:** Muestra partidos del día seleccionado

### 8.4 Estilos CSS

**Variables CSS (corregidas):**
```css
:root {
  --background: #0b0f19;
  --card-bg: #161f30;
  --neon-green: #00ff87;
  --gold: #ffb703;
  --white: #ffffff;
  --gray: #94a3b8;
}
```

**Problema corregido:**
- **Antes:** `egar:root` (error tipográfico)
- **Después:** `:root` (selector correcto)

**Características visuales:**
- Diseño oscuro con acentos neón
- Tipografía moderna
- Efectos hover en tarjetas de partidos
- Responsive design

---

## 9. Despliegue con Docker

### 9.1 Configuración de Docker Compose

```yaml
services:
  db:
    image: mysql:8.0
    ports:
      - "3307:3306"
    volumes:
      - ./api/db:/docker-entrypoint-initdb.d:z  # :z para SELinux
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mundialdb

  api:
    build: ./api
    ports:
      - "3000:3000"
    depends_on:
      db:
        condition: service_healthy
    environment:
      DB_HOST: db
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: root
      DB_NAME: mundialdb

  web:
    build: ./web
    ports:
      - "8000:8000"
    depends_on:
      api:
        condition: service_healthy
    environment:
      API_BASE_URL: http://127.0.0.1:3000
```

### 9.2 Problemas y Soluciones

#### 9.2.1 Volumen con SELinux

**Problema:** En Fedora con SELinux, los volúmenes montados necesitan la etiqueta `:z` para permitir acceso compartido.

**Solución:**
```yaml
volumes:
  - ./api/db:/docker-entrypoint-initdb.d:z
```

#### 9.2.2 Healthchecks

Se agregaron healthchecks para garantizar que los servicios estén listos antes de iniciar dependencias:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 5s
  timeout: 3s
  retries: 5
```

#### 9.2.3 API_BASE_URL

**Problema:** El frontend necesita llamar a la API desde el navegador, no desde el contenedor.

**Solución:**
```yaml
# En docker-compose.yml
environment:
  API_BASE_URL: http://127.0.0.1:3000

# En calendar.js
const CALENDAR_API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
```

### 9.3 Comandos de Despliegue

```bash
# Levantar todos los servicios
podman-compose up --build -d

# Verificar estado
podman ps

# Ver logs
podman logs webmundial_db_1
podman logs webmundial_api_1
podman logs webmundial_web_1

# Detener servicios
podman-compose down

# Recrear base de datos (borra datos)
podman-compose down -v && podman-compose up --build -d
```

---

## 10. Pruebas y Verificación

### 10.1 Pruebas de API

**Health check:**
```bash
curl -s http://127.0.0.1:3000/health
# Respuesta: {"status":"ok"}
```

**Catálogo:**
```bash
curl -s http://127.0.0.1:3000/api/catalogo
# Respuesta: [{"id":1,"name":"Balón oficial",...}, ...]
```

**Partidos:**
```bash
curl -s http://127.0.0.1:3000/api/matches | python3 -m json.tool
# Respuesta: Array de 104 partidos
```

**Verificación de encoding:**
```bash
curl -s http://127.0.0.1:3000/api/matches | python3 -c "
import sys, json
data = json.load(sys.stdin)
issues = [m for m in data if 'Ã' in m.get('venue', '') or 'Â' in m.get('stage', '')]
print(f'Issues: {len(issues)}')
# Salida: Issues: 0
"
```

### 10.2 Pruebas de Frontend

**Verificación de assets:**
```bash
# CSS
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/static/css/main.css
# Salida: 200

# JavaScript
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/static/js/calendar.js
# Salida: 200

# Imágenes
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/static/images/pele.png
# Salida: 200
```

**Verificación de renderizado:**
```bash
curl -s http://127.0.0.1:8000/ | grep -c 'calendar-match-card'
# Después de cargar datos: número > 0
```

### 10.3 Pruebas de Base de Datos

```bash
# Contar partidos
podman exec webmundial_db_1 mysql -uroot -proot mundialdb \
  -e "SELECT COUNT(*) as match_count FROM matches;"
# Salida: match_count: 108

# Contar equipos
podman exec webmundial_db_1 mysql -uroot -proot mundialdb \
  -e "SELECT COUNT(*) as team_count FROM teams;"
# Salida: team_count: 53

# Verificar duplicados
podman exec webmundial_db_1 mysql -uroot -proot mundialdb \
  -e "SELECT name, COUNT(*) as cnt FROM teams GROUP BY name HAVING cnt > 1;"
# Salida: (vacío, sin duplicados)
```

---

## 11. Conclusiones

### 11.1 Logros Alcanzados

1. **Integración completa del fixture oficial:** 104 partidos del Mundial 2026 cargados en la base de datos
2. **Calendario interactivo funcional:** Navegación mensual, selección de días, visualización de partidos
3. **Corrección de problemas de encoding:** Solución completa del mojibake UTF-8
4. **Despliegue funcional:** Servicios corriendo correctamente con Docker/Podman
5. **Código subido a GitHub:** Rama `alejandro-castillo/calendario-interactivo` actualizada

### 11.2 Lecciones Aprendidas

**Técnicas:**
- Importancia de verificar la codificación de caracteres desde la fuente de datos
- Necesidad de scripts de migración separados para datos grandes en Docker
- El uso de `:z` en volúmenes de SELinux es crítico en Fedora/RHEL
- La conversión `latin1 → utf8mb4` soluciona problemas de mojibake

**De proceso:**
- El scraping requiere manejo de formatos inconsistentes
- La limpieza de datos es iterativa y requiere validación continua
- Las pruebas deben cubrir encoding, formato y contenido

### 11.3 Trabajo Futuro

1. **Población automática:** Crear un job que actualice resultados en tiempo real
2. **Filtros:** Filtrar por etapa, equipo, sede
3. **Búsqueda:** Buscar partidos por equipo o estadio
4. **Predicciones:** Integrar el sistema de predicciones existente
5. **Notificaciones:** Alertas de partidos por equipo favorito
6. **Estadísticas:** Goleadores, tarjetas, posesión, etc.

---

## Anexos

### A. Comandos Útiles

```bash
# Ver todos los partidos en formato tabla
podman exec webmundial_db_1 mysql -uroot -proot mundialdb \
  -e "SELECT date, stage, venue FROM matches ORDER BY date;"

# Ver partidos de una fecha específica
curl -s http://127.0.0.1:3000/api/matches | \
  python3 -c "import sys,json; data=json.load(sys.stdin); \
  [print(f\"{m['date']} - {m['homeTeam']} vs {m['awayTeam']}\") \
  for m in data if m['date'].startswith('2026-06-11')]"

# Rebuild de un servicio específico
podman-compose up --build -d web

# Ver logs en tiempo real
podman logs -f webmundial_api_1
```

### B. Estructura de Archivos Modificados

```
api/
├── db/
│   ├── init.sql                    # Corregido: eliminada tabla catalog duplicada
│   └── matches_seed.sql            # Nuevo: 104 partidos oficiales
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   └── Match.ts            # Entidad Match (sin cambios)
│   │   └── repositories/
│   │       └── worldRepository.ts  # Interfaz (sin cambios)
│   ├── infra/
│   │   ├── database/
│   │   │   └── mysqlConnection.ts  # charset utf8mb4 configurado
│   │   └── repositories/
│   │       └── mysqlWorldRepository.ts  # Query con JOIN a teams
│   └── presentation/
│       ├── controllers/
│       │   └── worldController.ts  # getMatches() existente
│       └── routes/
│           └── worldRoutes.ts      # /api/matches ya existía

web/
├── core/
│   ├── static/
│   │   ├── css/
│   │   │   └── main.css            # Corregido: :root
│   │   ├── js/
│   │   │   └── calendar.js         # Calendario interactivo
│   │   └── images/
│   │       ├── pele.png            # Nuevo
│   │       ├── maradona.png        # Nuevo
│   │       ├── messi.png           # Nuevo
│   │       ├── cruyff.png          # Nuevo
│   │       ├── ronaldo.png         # Nuevo
│   │       ├── zidane.png          # Nuevo
│   │       └── sedes/
│   │           ├── canada.png      # Renombrado
│   │           ├── mexico.png      # Renombrado
│   │           └── estados-unidos.png  # Renombrado
│   └── templates/
│       ├── base.html               # Template base
│       └── index.html              # Incluye calendario

docker-compose.yml                   # Corregido: volúmenes, API_BASE_URL, healthchecks
```

### C. Glosario

- **Mojibake:** Texto corrupto por decodificación incorrecta de caracteres
- **UTF-8:** Estándar de codificación de caracteres Unicode
- **Latin-1:** Codificación de caracteres de 8 bits (ISO-8859-1)
- **Scraping:** Extracción automatizada de datos de páginas web
- **Fixture:** Calendario oficial de partidos de un torneo
- **Clean Architecture:** Patrón de arquitectura que separa concerns por capas
- **Docker Compose:** Herramienta para definir y ejecutar aplicaciones multi-contenedor
- **Podman:** Motor de contenedores alternativo a Docker
- **SELinux:** Módulo de seguridad para Linux que restringe acceso a archivos

---

**Documento generado:** 2026-07-09  
**Versión:** 1.0  
**Estado:** Finalizado
