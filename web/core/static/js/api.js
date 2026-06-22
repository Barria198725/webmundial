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
  const container = document.querySelector("#group-table .data-placeholder");
  if (!container) return;
  const groups = await fetchJson("/api/groups");
  if (!groups) {
    container.textContent = "No se pudo cargar la tabla de grupos.";
    return;
  }

  const group = groups[0];
  const rows = group.teams
    .map((team) => `
      <tr>
        <td>${team.name}</td>
        <td>${team.played}</td>
        <td>${team.points}</td>
        <td>${team.goalDiff}</td>
      </tr>
    `)
    .join("");

  container.outerHTML = `
    <table class="score-table">
      <thead>
        <tr><th>Equipo</th><th>J</th><th>P</th><th>DG</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
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
