const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";

async function fetchJson(path) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    return null;
  }
}

async function renderMatches() {
  const container = document.getElementById("match-list");
  if (!container) return;

  const matches = await fetchJson("/api/matches");
  if (!matches) {
    container.innerHTML = "<div class='data-placeholder'>No se pudieron cargar los partidos.</div>";
    return;
  }

  const html = matches
    .map((match) => `
      <article class="match-card">
        <div class="match-card__header"><strong>${match.stage}</strong><span>${new Date(match.date).toLocaleString()}</span></div>
        <div class="match-card__teams">
          <span>${match.homeTeam}</span>
          <strong>${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}</strong>
          <span>${match.awayTeam}</span>
        </div>
        <div class="match-card__venue">${match.venue}</div>
      </article>
    `)
    .join("");

  container.innerHTML = html;
}

async function renderGroups() {
  const groupTable = document.getElementById("group-table");
  if (!groupTable) return;
  const placeholder = groupTable.querySelector(".data-placeholder");

  const groups = await fetchJson("/api/groups");
  if (placeholder) placeholder.textContent = "";

  const fallbackGroups = [
    {
      group: "A",
      teams: [
        { name: "México", points: 0, goalDiff: 0 },
        { name: "Ecuador", points: 0, goalDiff: 0 },
        { name: "Croacia", points: 0, goalDiff: 0 },
        { name: "Marruecos", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "B",
      teams: [
        { name: "Argentina", points: 0, goalDiff: 0 },
        { name: "Canadá", points: 0, goalDiff: 0 },
        { name: "Chile", points: 0, goalDiff: 0 },
        { name: "Australia", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "C",
      teams: [
        { name: "España", points: 0, goalDiff: 0 },
        { name: "Brasil", points: 0, goalDiff: 0 },
        { name: "Japón", points: 0, goalDiff: 0 },
        { name: "Sudáfrica", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "D",
      teams: [
        { name: "Francia", points: 0, goalDiff: 0 },
        { name: "Portugal", points: 0, goalDiff: 0 },
        { name: "Argelia", points: 0, goalDiff: 0 },
        { name: "Eslovenia", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "E",
      teams: [
        { name: "Alemania", points: 0, goalDiff: 0 },
        { name: "Colombia", points: 0, goalDiff: 0 },
        { name: "Corea del Sur", points: 0, goalDiff: 0 },
        { name: "Bélgica", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "F",
      teams: [
        { name: "Inglaterra", points: 0, goalDiff: 0 },
        { name: "Senegal", points: 0, goalDiff: 0 },
        { name: "Arabia Saudita", points: 0, goalDiff: 0 },
        { name: "Nueva Zelanda", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "G",
      teams: [
        { name: "Uruguay", points: 0, goalDiff: 0 },
        { name: "Serbia", points: 0, goalDiff: 0 },
        { name: "Nigeria", points: 0, goalDiff: 0 },
        { name: "Trinidad y Tobago", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "H",
      teams: [
        { name: "Holanda", points: 0, goalDiff: 0 },
        { name: "Turquía", points: 0, goalDiff: 0 },
        { name: "Cuba", points: 0, goalDiff: 0 },
        { name: "Togo", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "I",
      teams: [
        { name: "Estados Unidos", points: 0, goalDiff: 0 },
        { name: "Panamá", points: 0, goalDiff: 0 },
        { name: "Suiza", points: 0, goalDiff: 0 },
        { name: "Ghana", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "J",
      teams: [
        { name: "Polonia", points: 0, goalDiff: 0 },
        { name: "Austria", points: 0, goalDiff: 0 },
        { name: "Camerún", points: 0, goalDiff: 0 },
        { name: "Costa de Marfil", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "K",
      teams: [
        { name: "Irán", points: 0, goalDiff: 0 },
        { name: "Uzbekistán", points: 0, goalDiff: 0 },
        { name: "Rep. Checa", points: 0, goalDiff: 0 },
        { name: "China", points: 0, goalDiff: 0 },
      ],
    },
    {
      group: "L",
      teams: [
        { name: "Italia", points: 0, goalDiff: 0 },
        { name: "Venezuela", points: 0, goalDiff: 0 },
        { name: "Irlanda", points: 0, goalDiff: 0 },
        { name: "Congo", points: 0, goalDiff: 0 },
      ],
    },
  ];

  const shouldUseFallback =
    !groups || !Array.isArray(groups) || groups.length < 12;

  const groupsToRender = shouldUseFallback ? fallbackGroups : groups;

  if (!groupsToRender || groupsToRender.length === 0) {
    container.outerHTML = "<div class='groups-container'>No hay datos de grupos disponibles.</div>";
    return;
  }

  const buildTable = (group) => {
    // Orden: asume ya viene ordenado por puntos desc desde la API.
    const rows = group.teams
      .map(
        (team, idx) => {
          const pos = idx + 1;
          const topClass = pos === 1 ? "top1" : pos === 2 ? "top2" : "";
          // No tenemos GF/GA/GD desde la API actual (solo goalDiff).
          // Para mantener el formato, dejamos GF/GA como "-" y calculamos DG.
          return `
            <tr class="${topClass}">
              <td>${pos}</td>
              <td>${team.name}</td>
              <td>${team.points}</td>
              <td>-</td>
              <td>-</td>
              <td>${team.goalDiff >= 0 ? "+" + team.goalDiff : team.goalDiff}</td>
            </tr>
          `;
        }
      )
      .join("");

    return `
      <div class="group-block">
        <h3 class="group-block__title">Grupo ${group.group}</h3>
        <table class="group-table">
          <thead>
            <tr>
              <th>Pos</th>
              <th>Equipo</th>
              <th>PTS</th>
              <th>GF</th>
              <th>GA</th>
              <th>DG</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
  };

  // Mostrar todas las tablas de grupos (A, B, C...) en vez de solo la primera.
  container.outerHTML = `
    <div class="groups-container">
      ${groupsToRender.map(buildTable).join("")}

    </div>
  `;

}

async function renderScorers() {
  const container = document.querySelector("#top-scorers .data-placeholder");
  if (!container) return;
  const scorers = await fetchJson("/api/scorers");
  if (!scorers) {
    container.textContent = "No se pudo cargar la lista de goleadores.";
    return;
  }

  const rows = scorers
    .map((player) => `
      <div class="scorer-row">
        <span>${player.name}</span>
        <strong>${player.goals}</strong>
      </div>
    `)
    .join("");

  container.outerHTML = `<div class="scorer-list">${rows}</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  renderMatches();
  renderGroups();
  renderScorers();
});
