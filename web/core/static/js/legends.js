document.addEventListener("DOMContentLoaded", () => {
  // Legends data -> trayectoria futbolística histórica completa
  const legends = {
    pele: {
      title: "Pelé",
      subtitle: "El Rey del Fútbol • 3 Copas del Mundo",
      img: "/static/IMG/futbolistas/pele.png",
      stats: { mundiales: 4, goles: 12, titulos: 3, debut: 1957, retiro: 1977 },
      clubs: ["Santos (1956–1974)", "New York Cosmos (1975–1977)"],
      body: [
        "🇧🇷 <strong>Edson Arantes do Nascimento</strong> es el único jugador en ganar 3 Copas del Mundo (1958, 1962, 1970).",
        "⚽ Es el máximo goleador de la historia del Santos FC con 643 goles y anotó más de 1000 goles en su carrera profesional.",
        "🏆 En el Mundial de 1958 debutó con 17 años anotando un hat-trick en semifinales y dos goles en la final.",
        "🌍 Su gol 1000 llegó en 1969 en el Maracaná, un momento que paralizó Brasil. Fue declarado 'Atleta del Siglo' por el COI.",
        "📊 12 goles en Mundiales, 77 goles con Brasil, 4 Mundiales disputados (58, 62, 66, 70).",
      ],
    },
    maradona: {
      title: "Diego Maradona",
      subtitle: "Mago del Balón • Campeón 1986",
      img: "/static/IMG/futbolistas/maradona.png",
      stats: { mundiales: 4, goles: 8, titulos: 1, debut: 1976, retiro: 1997 },
      clubs: ["Argentinos Juniors (1976–1981)", "Boca Juniors (1981–1982)", "FC Barcelona (1982–1984)", "Napoli (1984–1991)", "Sevilla (1992–1993)", "Newell's Old Boys (1993)", "Boca Juniors (1995–1997)"],
      body: [
        "🇦🇷 <strong>Diego Armando Maradona</strong> lideró a Argentina al título en México 1986 con actuaciones legendarias.",
        "⚽ En cuartos de final ante Inglaterra marcó el 'Gol del Siglo' (regate a 6 jugadores en 60 metros) y el polémico 'Mano de Dios' en el mismo partido.",
        "🏆 Llevó al Napoli de la Serie C a ganar 2 Scudettos (1987, 1990), la Copa UEFA (1989) y la Copa Italia, convirtiéndose en un ídolo eterno.",
        "🌟 Su habilidad con el balón pegado al pie, los regates en espacios reducidos y su visión lo convirtieron en un genio irrepetible.",
        "📊 8 goles en Mundiales, 34 goles con Argentina, 4 Mundiales disputados (82, 86, 90, 94).",
      ],
    },
    cruyff: {
      title: "Johan Cruyff",
      subtitle: "Arquitecto del Fútbol Total • 3 Balones de Oro",
      img: "/static/IMG/futbolistas/cruyff.png",
      stats: { mundiales: 2, goles: 3, titulos: 1, debut: 1964, retiro: 1984 },
      clubs: ["Ajax (1964–1973)", "FC Barcelona (1973–1978)", "Los Angeles Aztecs (1979–1980)", "Washington Diplomats (1980–1981)", "Levante (1981)", "Ajax (1981–1983)", "Feyenoord (1983–1984)"],
      body: [
        "🇳🇱 <strong>Hendrik Johannes Cruijff</strong> revolucionó el fútbol como jugador y entrenador con el 'Fútbol Total' del Ajax y Países Bajos.",
        "⚽ Icono del número 14, ganó 3 Balones de Oro (1971, 1973, 1974) y llevó a Países Bajos a la final del Mundial 1974 con un fútbol deslumbrante.",
        "🏆 Como jugador ganó 8 Eredivisies, 3 Copas de Europa consecutivas (1971–1973) y 1 Copa Intercontinental con el Ajax.",
        "🌍 Como entrenador creó la 'Dream Team' del Barcelona que ganó la primera Champions del club en 1992 y sentó las bases del estilo Barça.",
        "📊 3 goles en Mundiales, 33 goles con Países Bajos, 2 Mundiales disputados (74 como subcampeón).",
      ],
    },
    ronaldo: {
      title: "Ronaldo Nazário",
      subtitle: "El Fenómeno • 2 Copas del Mundo",
      img: "/static/IMG/futbolistas/ronaldo.png",
      stats: { mundiales: 4, goles: 15, titulos: 2, debut: 1993, retiro: 2011 },
      clubs: ["Cruzeiro (1993–1994)", "PSV Eindhoven (1994–1996)", "FC Barcelona (1996–1997)", "Inter de Milán (1997–2002)", "Real Madrid (2002–2007)", "AC Milan (2007–2008)", "Corinthians (2009–2011)"],
      body: [
        "🇧🇷 <strong>Ronaldo Luís Nazário de Lima</strong> fue el delantero más completo de su generación: velocidad, potencia y definición letal.",
        "⚽ Ganó el Balón de Oro 3 veces (1996, 1997, 2002) y fue el máximo goleador de los Mundiales con 15 tantos hasta ser superado por Klose.",
        "🏆 En 2002 lideró a Brasil al pentacampeonato con 8 goles, incluyendo 2 en la final contra Alemania, y ganó la Bota de Oro.",
        "💪 Superó dos lesiones gravísimas de rodilla que casi terminan su carrera y regresó para ser el mejor del mundo en 2002.",
        "📊 15 goles en Mundiales (récord), 62 goles con Brasil, 4 Mundiales disputados (94, 98, 02, 06).",
      ],
    },
    messi: {
      title: "Lionel Messi",
      subtitle: "El GOAT • 1 Copa del Mundo • 8 Balones de Oro",
      img: "/static/IMG/futbolistas/messi.png",
      stats: { mundiales: 5, goles: 13, titulos: 1, debut: 2004, retiro: "Activo" },
      clubs: ["FC Barcelona (2004–2021)", "Paris Saint-Germain (2021–2023)", "Inter Miami (2023–presente)"],
      body: [
        "🇦🇷 <strong>Lionel Andrés Messi</strong> es el futbolista más laureado de la historia con 44 títulos oficiales.",
        "⚽ Máximo goleador histórico del FC Barcelona (672 goles) y de la selección argentina (106 goles). Ganó 8 Balones de Oro (récord).",
        "🏆 En 2022 cumplió su mayor sueño: ganar la Copa del Mundo en Qatar, siendo MVP del torneo con 7 goles y 3 asistencias.",
        "🌟 Su regate en corto, visión de juego, precisión en el pase y capacidad goleadora lo hacen único. Es el máximo asistidor de la historia.",
        "📊 13 goles en Mundiales (récord argentino), 106 goles con Argentina, 5 Mundiales disputados (06, 10, 14, 18, 22).",
      ],
    },
    zidane: {
      title: "Zinedine Zidane",
      subtitle: "Maestro del Balón • Campeón 1998 • Leyenda UEFA",
      img: "/static/IMG/futbolistas/zidane.png",
      stats: { mundiales: 3, goles: 5, titulos: 1, debut: 1989, retiro: 2006 },
      clubs: ["Cannes (1989–1992)", "Bordeaux (1992–1996)", "Juventus (1996–2001)", "Real Madrid (2001–2006)"],
      body: [
        "🇫🇷 <strong>Zinedine Yazid Zidane</strong> es sinónimo de elegancia, control y clase. Su técnica con el balón era poesía en movimiento.",
        "⚽ En el Mundial 1998 marcó dos goles de cabeza en la final contra Brasil, llevando a Francia a su primer título mundial.",
        "🏆 Ganó la Champions League 2002 con un gol espectacular de volea ante el Leverkusen. Como entrenador ganó 3 Champions seguidas (2016–2018).",
        "🌟 Su 'roulette' (giro de 360°) y su control orientado eran marca registrada. Balón de Oro 1998 y Mejor Jugador FIFA 3 veces.",
        "📊 5 goles en Mundiales, 31 goles con Francia, 3 Mundiales disputados (98, 02, 06), subcampeón 2006.",
      ],
    },
    "cristiano-ronaldo": {
      title: "Cristiano Ronaldo",
      subtitle: "Máquina de Récords • 5 Balones de Oro • Leyenda UEFA",
      img: "/static/IMG/futbolistas/cristiano ronaldo.png",
      stats: { mundiales: 5, goles: 8, titulos: 0, debut: 2002, retiro: "Activo" },
      clubs: ["Sporting CP (2002–2003)", "Manchester United (2003–2009)", "Real Madrid (2009–2018)", "Juventus (2018–2021)", "Manchester United (2021–2022)", "Al-Nassr (2023–presente)"],
      body: [
        "🇵🇹 <strong>Cristiano Ronaldo dos Santos Aveiro</strong> es el máximo goleador de la historia del fútbol (más de 900 goles oficiales).",
        "⚽ Ganó 5 Balones de Oro (2008, 2013, 2014, 2016, 2017) y es el máximo goleador histórico de la Champions League con 140 goles.",
        "🏆 Con el Real Madrid ganó 4 Champions League (2014, 2016, 2017, 2018) y con Portugal la Eurocopa 2016 y la Nations League 2019.",
        "💪 Su disciplina física, determinación y capacidad goleadora son legendarias. Es el jugador con más partidos internacionales de la historia.",
        "📊 8 goles en Mundiales, 130+ goles con Portugal (récord mundial), 5 Mundiales disputados (06, 10, 14, 18, 22).",
      ],
    },
    ronaldinho: {
      title: "Ronaldinho Gaúcho",
      subtitle: "El Último Mago • Sonrisa del Fútbol • Campeón 2002",
      img: "/static/IMG/futbolistas/ronaldinho.png",
      stats: { mundiales: 2, goles: 2, titulos: 1, debut: 1998, retiro: 2015 },
      clubs: ["Grêmio (1998–2001)", "Paris Saint-Germain (2001–2003)", "FC Barcelona (2003–2008)", "AC Milan (2008–2011)", "Flamengo (2011–2012)", "Atlético Mineiro (2012–2014)", "Querétaro (2014–2015)"],
      body: [
        "🇧🇷 <strong>Ronaldo de Assis Moreira</strong> fue el jugador más alegre y habilidoso del fútbol. Su sonrisa y su magia con el balón enamoraron al mundo.",
        "⚽ Ganó el Balón de Oro 2005 y la FIFA World Player 2004 y 2005. Es famoso por sus elásticas, sombreros, chilenas y su gol sin ángulo ante el Chelsea.",
        "🏆 Fue clave en el Brasil pentacampeón 2002 y llevó al Barcelona a ganar la Champions 2006 y 2 Ligas, devolviendo la grandeza al club.",
        "🌟 Su 'jogo bonito' combinaba alegría, creatividad y técnica. Inventó jugadas que nadie había visto antes en un campo de fútbol.",
        "📊 2 goles en Mundiales, 33 goles con Brasil, 2 Mundiales disputados (02, 06), máximo artífice del 'Barcelona renacentista'.",
      ],
    },
  };

  const cards = document.querySelectorAll(".legend-card[data-player]");
  const detail = document.getElementById("legend-detail");
  const titleEl = document.getElementById("legend-detail-title");
  const subtitleEl = document.getElementById("legend-detail-subtitle");
  const imgEl = document.getElementById("legend-detail-img");
  const bodyEl = document.getElementById("legend-detail-body");

  if (cards.length && detail && titleEl && subtitleEl && imgEl && bodyEl) {
    function setActiveCard(playerKey) {
      cards.forEach((c) => {
        c.classList.toggle("is-selected", c.dataset.player === playerKey);
      });
    }

    function renderLegend(playerKey) {
      const data = legends[playerKey];
      if (!data) return;

      setActiveCard(playerKey);
      titleEl.textContent = data.title;
      subtitleEl.textContent = data.subtitle;
      imgEl.src = data.img;
      imgEl.alt = data.title;

      const statsHtml = `
        <div class="legend-stats">
          <span class="legend-stat"><strong>${data.stats.mundiales}</strong> Mundiales</span>
          <span class="legend-stat"><strong>${data.stats.goles}</strong> Goles</span>
          <span class="legend-stat"><strong>${data.stats.titulos}</strong> Títulos</span>
        </div>
      `;

      const clubsHtml = `
        <div class="legend-clubs">
          <span class="legend-clubs__label">🏟️ Trayectoria:</span>
          <div class="legend-clubs__list">${data.clubs.join(' <span class="legend-club-arrow">→</span> ')}</div>
        </div>
      `;

      const bodyHtml = data.body.map((p) => `<p>${p}</p>`).join("");

      bodyEl.innerHTML = statsHtml + clubsHtml + bodyHtml;
    }

    cards.forEach((card) => {
      const playerKey = card.dataset.player;
      card.addEventListener("click", () => renderLegend(playerKey));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          renderLegend(playerKey);
        }
      });
    });
  }
});