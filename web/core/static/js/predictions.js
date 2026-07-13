document.addEventListener('DOMContentLoaded', function() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const predictionSection = document.getElementById('prediction-match-list');
  const predictionMessage = document.getElementById('predictions-message');
  const loginButton = document.getElementById('predictions-login-button');

  function renderPredictionRow(match) {
    const inputsDisabled = !user || !token ? 'disabled' : '';
    return `
      <div class="prediction-row">
        <div>${match.homeTeam}</div>
        <div><input type="number" name="home_${match.id}" placeholder="0" min="0" data-match-id="${match.id}" data-team="home" ${inputsDisabled} /></div>
        <div>-</div>
        <div><input type="number" name="away_${match.id}" placeholder="0" min="0" data-match-id="${match.id}" data-team="away" ${inputsDisabled} /></div>
        <div>${match.awayTeam}</div>
      </div>
    `;
  }

  async function loadMatches() {
    const url = (window.API_BASE_URL || '') + '/api/matches';
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error al cargar partidos');
      const matches = await response.json();
      if (!Array.isArray(matches) || matches.length === 0) {
        if (predictionSection) predictionSection.innerHTML += '<p>No hay partidos disponibles.</p>';
        return;
      }

      const rows = matches.map(renderPredictionRow).join('');
      if (predictionSection) {
        predictionSection.innerHTML = `
          <div class="section-header"><span>Primeros encuentros</span><h2>Haz tu apuesta</h2></div>
          ${rows}
          <div class="predictions__footer"><span>Puntos actuales: <strong>${user?.points || 0}</strong></span></div>
        `;
      }
    } catch (err) {
      if (predictionSection) predictionSection.innerHTML = '<p>No se pudieron cargar los partidos.</p>';
    }
  }

  if (user && token) {
    if (predictionMessage) predictionMessage.textContent = 'Haz tus pronósticos y guarda tus apuestas.';
    if (loginButton) loginButton.hidden = true;
  } else {
    if (predictionMessage) predictionMessage.textContent = 'Inicia sesión para guardar tus pronósticos y sumar puntos.';
    if (loginButton) loginButton.hidden = false;
  }

  loadMatches();
});
