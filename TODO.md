# TODO - Leyendas del Fútbol (hasta Mundial 2026)

- [ ] Revisar y modificar `web/core/templates/index.html` para incluir:
  - [ ] Sección “Leyendas del Fútbol” con iconos/imagenes por jugador (Pelé, Maradona, Cruyff, Ronaldo, Messi, Zidane)
  - [ ] Sección “Iconos eternos” (puede ser la misma sección o un subbloque) usando imágenes estáticas/embebidas
  - [ ] Secciones de “Datos Curiosos”, incluyendo: Mayor goleada, Más títulos, Jugador con más goles, Mundial con más asistentes
  - [ ] Actualizar información para que aplique y esté alineada con el Mundial 2026 (sin inventar datos futuros: usar datos históricos reconocidos)
  - [ ] Agregar placeholders de tarjetas (si falta contenido) para que la UI quede lista

- [ ] Agregar/actualizar CSS en `web/core/static/css/main.css` (y/o nuevos CSS) para estilos de tarjetas con imágenes:
  - [ ] Clases para `.legend-card__img` / `.legend-card--player` y layout (tamaño, bordes, hover)

- [ ] Crear archivos de imágenes para el frontend en `web/core/static/images/` (o la ruta que ya use el proyecto):
  - [ ] `pele.*`, `maradona.*`, `cruyff.*`, `ronaldo.*`, `messi.*`, `zidane.*`
  - [ ] Confirmar nombres finales y referencias en la plantilla

- [ ] Verificar que el proyecto sigue corriendo:
  - [ ] Ejecutar `docker-compose up --build -d` (o comando alternativo local)
  - [ ] Validar que la vista principal renderiza correctamente las imágenes

- [ ] (Opcional) Si se requiere contenido dinámico desde la API, revisar endpoints y conectar con JS (por ahora será estático en plantilla). 

