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

function updateText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function formatSpanishDate(dateString) {
  const date = new Date(dateString);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return date.toLocaleDateString("es-ES", options);
}

function formatSpanishTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function matchStatusLabel(status) {
  if (!status) return "FINAL";
  const normalized = String(status).toLowerCase();
  if (normalized.includes("final") || normalized.includes("finished")) return "FINAL";
  if (normalized.includes("scheduled") || normalized.includes("upcoming")) return "UPCOMING";
  return String(status).toUpperCase();
}

function populateTicker(matchItems) {
  const tickerTrack = document.querySelector("#ticker .ticker__track");
  if (!tickerTrack) return;

  const items = matchItems.slice(0, 6).map((match) => {
    const home = match.homeTeam || "Equipo A";
    const away = match.awayTeam || "Equipo B";
    const score = match.homeScore != null && match.awayScore != null ? `${match.homeScore}–${match.awayScore}` : "vs";
    const stage = match.stage || "Match";
    return `<div class="ticker-item">${home} ${score} ${away} • ${stage}</div>`;
  });

  tickerTrack.innerHTML = items.join("");
}

async function renderDashboard() {
  const matches = await fetchJson("/api/matches");
  if (!matches || !Array.isArray(matches)) return;

  const now = new Date();
  const finishedMatches = matches
    .filter((match) => {
      if (!match.date) return false;
      const date = new Date(match.date);
      return date <= now || ["final", "finished", "ended"].some((flag) => String(match.status || "").toLowerCase().includes(flag));
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const upcomingMatches = matches
    .filter((match) => {
      if (!match.date) return false;
      const date = new Date(match.date);
      return date > now && !["final", "finished", "ended"].some((flag) => String(match.status || "").toLowerCase().includes(flag));
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const lastMatch = finishedMatches[0] || matches[0];
  const nextMatch = upcomingMatches[0] || matches[0];

  if (lastMatch) {
    updateText("lastMatchStatus", matchStatusLabel(lastMatch.status));
    updateText("lastHomeTeam", lastMatch.homeTeam || "Home");
    updateText("lastAwayTeam", lastMatch.awayTeam || "Away");
    updateText("lastHomeScore", lastMatch.homeScore != null ? lastMatch.homeScore : "-");
    updateText("lastAwayScore", lastMatch.awayScore != null ? lastMatch.awayScore : "-");
    updateText("lastMatchVenue", lastMatch.venue || "Estadio");
    updateText("lastMatchDate", lastMatch.date ? formatSpanishDate(lastMatch.date) : "Fecha");
    updateText("lastMatchTime", lastMatch.date ? `${formatSpanishTime(lastMatch.date)} UTC` : "Hora");
    updateText("lastMatchMVP", lastMatch.mvp ? `MVP: ${lastMatch.mvp}` : "MVP: TBD");
  }

  if (nextMatch) {
    updateText("nextHomeTeam", nextMatch.homeTeam || "Home");
    updateText("nextAwayTeam", nextMatch.awayTeam || "Away");
    updateText("nextMatchCity", nextMatch.city || "Ciudad");
    updateText("nextMatchVenue", nextMatch.venue || "Estadio");
    updateText("nextMatchDate", nextMatch.date ? formatSpanishDate(nextMatch.date) : "Fecha");
    updateText("nextMatchTime", nextMatch.date ? `${formatSpanishTime(nextMatch.date)} UTC` : "Hora");
    if (window.updateNextMatchCountdown && nextMatch.date) {
      window.updateNextMatchCountdown(nextMatch.date);
    }
  }

  const finalMatch = matches.find((match) => {
    if (!match.stage || !match.date) return false;
    return String(match.stage).toLowerCase().includes("final") || String(match.status || "").toLowerCase().includes("final");
  });
  if (finalMatch && finalMatch.date && window.setCountdownTarget) {
    window.setCountdownTarget(finalMatch.date);
  }

  populateTicker(matches);
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
        <div class="match-card__header"><strong>${match.stage || "Partido"}</strong><span>${match.date ? new Date(match.date).toLocaleString("es-ES") : "Fecha"}</span></div>
        <div class="match-card__teams">
          <span>${match.homeTeam || "Home"}</span>
          <strong>${match.homeScore != null ? match.homeScore : "-"} - ${match.awayScore != null ? match.awayScore : "-"}</strong>
          <span>${match.awayTeam || "Away"}</span>
        </div>
        <div class="match-card__venue">${match.venue || "Estadio"}</div>
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
  renderDashboard();
  renderMatches();
  renderGroups();
  renderScorers();
});
