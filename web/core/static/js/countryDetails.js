const datosMundial = {
  USA: {
    nombre: "Sedes de Estados Unidos",
    sedes: [
      {
        ciudad: "Los Ángeles",
        estado: "California",
        estadio: "Estadio SoFi (Los Angeles Stadium)",
        capacidad: "70,000",
        dato_curioso: "Es el estadio más costoso del planeta. Su megapantalla óvalo de doble vista 'The Infinity Screen' se roba todas las miradas.",
        partidos: [
          { fecha: "12 de Junio, 2026", fase: "Fase de Grupos", rivales: "Estados Unidos vs. Paraguay" },
          { fecha: "15 de Junio, 2026", fase: "Fase de Grupos", rivales: "Irán vs. Nueva Zelanda" },
          { fecha: "21 de Junio, 2026", fase: "Fase de Grupos", rivales: "Bélgica vs. Irán" },
          { fecha: "25 de Junio, 2026", fase: "Fase de Grupos", rivales: "Turquía vs. Estados Unidos" }
        ]
      },
      {
        ciudad: "Nueva York / Nueva Jersey",
        estado: "Nueva Jersey",
        estadio: "Estadio MetLife (New York New Jersey Stadium)",
        capacidad: "82,500",
        dato_curioso: "Elegido oficialmente por la FIFA para albergar la Gran Final del mundo el domingo 19 de julio de 2026.",
        partidos: [
          { fecha: "13 de Junio, 2026", fase: "Fase de Grupos", rivales: "Brasil vs. Marruecos" },
          { fecha: "16 de Junio, 2026", fase: "Fase de Grupos", rivales: "Francia vs. Senegal" },
          { fecha: "25 de Junio, 2026", fase: "Fase de Grupos", rivales: "Ecuador vs. Alemania" }
        ]
      },
      {
        ciudad: "Miami Gardens",
        estado: "Florida",
        estadio: "Estadio Hard Rock (Miami Stadium)",
        capacidad: "64,760",
        dato_curioso: "Tiene una estructura de techo translúcida diseñada para proteger del sol extremo y las tormentas de Florida.",
        partidos: [
          { fecha: "15 de Junio, 2026", fase: "Fase de Grupos", rivales: "Arabia Saudita vs. Uruguay" },
          { fecha: "21 de Junio, 2026", fase: "Fase de Grupos", rivales: "Uruguay vs. Cabo Verde" },
          { fecha: "24 de Junio, 2026", fase: "Fase de Grupos", rivales: "Escocia vs. Brasil" }
        ]
      },
      {
        ciudad: "Arlington",
        estado: "Texas",
        estadio: "Estadio AT&T (Dallas Stadium)",
        capacidad: "80,000",
        dato_curioso: "Es el estadio con el mayor número de partidos asignados para este torneo (9 encuentros en total).",
        partidos: [
          { fecha: "14 de Junio, 2026", fase: "Fase de Grupos", rivales: "Croacia vs. Clasificado Playoff" },
          { fecha: "17 de Junio, 2026", fase: "Fase de Grupos", rivales: "Países Bajos vs. Chile" }
        ]
      },
      {
        ciudad: "Kansas City",
        estado: "Misuri",
        estadio: "Estadio Arrowhead (Kansas City Stadium)",
        capacidad: "76,416",
        dato_curioso: "Tiene el récord Guiness oficial como el estadio abierto más ruidoso del mundo debido al diseño de su estructura.",
        partidos: [
          { fecha: "16 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Houston",
        estado: "Texas",
        estadio: "Estadio NRG (Houston Stadium)",
        capacidad: "72,220",
        dato_curioso: "Fue el primer estadio de la NFL de fútbol americano en contar con un techo completamente retráctil.",
        partidos: [
          { fecha: "17 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Atlanta",
        estado: "Georgia",
        estadio: "Estadio Mercedes-Benz (Atlanta Stadium)",
        capacidad: "71,000",
        dato_curioso: "Su techo retráctil se abre de forma geométrica inspirada en el ojo de un halcón.",
        partidos: [
          { fecha: "15 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Foxborough",
        estado: "Massachusetts",
        estadio: "Estadio Gillette (Boston Stadium)",
        capacidad: "65,878",
        dato_curioso: "Ubicado en las afueras de Boston, cuenta con un icónico faro en una de sus cabeceras que da la bienvenida a los fans.",
        partidos: [
          { fecha: "13 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Philadelphia",
        estado: "Pensilvania",
        estadio: "Lincoln Financial Field (Philadelphia Stadium)",
        capacidad: "69,796",
        dato_curioso: "El estadio genera parte de su propia electricidad gracias a paneles solares y turbinas eólicas instaladas en el recinto.",
        partidos: [
          { fecha: "14 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Seattle",
        estado: "Washington",
        estadio: "Lumen Field (Seattle Stadium)",
        capacidad: "69,000",
        dato_curioso: "Su gradería en forma de herradura está diseñada para atrapar el sonido y generar un ambiente ensordecedor.",
        partidos: [
          { fecha: "15 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Santa Clara",
        estado: "California",
        estadio: "Estadio Levi's (San Francisco Bay Area Stadium)",
        capacidad: "68,500",
        dato_curioso: "Es uno de los estadios más ecológicos del mundo, con certificación LEED Oro y un techo verde transitable.",
        partidos: [
          { fecha: "13 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      }
    ]
  },
  MEX: {
    nombre: "Sedes de México",
    sedes: [
      {
        ciudad: "Ciudad de México",
        estado: "CDMX",
        estadio: "Estadio Azteca",
        capacidad: "83,264",
        dato_curioso: "Se convertirá en el único estadio del planeta en inaugurar tres Copas del Mundo de la FIFA (1970, 1986 y 2026).",
        partidos: [
          { fecha: "11 de Junio, 2026", fase: "Partido Inaugural", rivales: "México vs. Rival por confirmar" },
          { fecha: "17 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" },
          { fecha: "24 de Junio, 2026", fase: "Fase de Grupos", rivales: "México vs. Rival por confirmar" }
        ]
      },
      {
        ciudad: "Guadalajara",
        estado: "Jalisco",
        estadio: "Estadio Akron (Guadalajara Stadium)",
        capacidad: "48,071",
        dato_curioso: "Su hermoso diseño exterior simula la forma de un volcán coronado por una nube, integrándose de forma limpia con el entorno urbano.",
        partidos: [
          { fecha: "11 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" },
          { fecha: "18 de Junio, 2026", fase: "Fase de Grupos", rivales: "México vs. Rival por confirmar" }
        ]
      },
      {
        ciudad: "Monterrey",
        estado: "Nuevo León",
        estadio: "Estadio BBVA (Monterrey Stadium)",
        capacidad: "53,500",
        dato_curioso: "Es conocido como 'El Gigante de Acero' y ofrece desde la tribuna una de las vistas panorámicas más espectaculares del Cerro de la Silla.",
        partidos: [
          { fecha: "14 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" },
          { fecha: "20 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      }
    ]
  },
  CAN: {
    nombre: "Sedes de Canadá",
    sedes: [
      {
        ciudad: "Toronto",
        estado: "Ontario",
        estadio: "BMO Field (Toronto Stadium)",
        capacidad: "45,000",
        dato_curioso: "Para este certamen se le añadieron graderías superiores temporales con el fin de cumplir con el aforo reglamentario de la FIFA.",
        partidos: [
          { fecha: "12 de Junio, 2026", fase: "Debut de Canadá", rivales: "Canadá vs. Rival por confirmar" },
          { fecha: "17 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" }
        ]
      },
      {
        ciudad: "Vancouver",
        estado: "Columbia Británica",
        estadio: "BC Place (Vancouver Stadium)",
        capacidad: "54,500",
        dato_curioso: "Posee una de las estructuras de cables de soporte de techo retráctil más grandes y complejas de la ingeniería moderna.",
        partidos: [
          { fecha: "13 de Junio, 2026", fase: "Fase de Grupos", rivales: "Clasificado vs. Clasificado" },
          { fecha: "18 de Junio, 2026", fase: "Fase de Grupos", rivales: "Canadá vs. Rival por confirmar" }
        ]
      }
    ]
  }
};

function buildCountryDetails(countryCode) {
  const country = datosMundial[countryCode];
  if (!country) {
    return `<div class="country-detail-empty">Información no disponible para este país.</div>`;
  }

  const cards = country.sedes
    .map((sede) => {
      const partidos = sede.partidos
        .map(
          (partido) => `
            <li>
              <span class="partido-fecha">${partido.fecha}</span>
              <span class="partido-fase">${partido.fase}</span>
              <strong class="partido-rivales">${partido.rivales}</strong>
            </li>`
        )
        .join("");

      return `
        <article class="detalle-card">
          <div class="detalle-card__header">
            <span class="badge-estado">${sede.estado}</span>
            <h3 class="titulo-estadio">${sede.estadio}</h3>
            <p class="ciudad-estadio">${sede.ciudad}</p>
          </div>
          <p class="curiosidad-box">${sede.dato_curioso}</p>
          <div class="detalles-compactos">
            <span><strong>Capacidad:</strong> ${sede.capacidad}</span>
          </div>
          <div class="detalle-partidos">
            <h4>Partidos en esta sede</h4>
            <ul class="lista-partidos">${partidos}</ul>
          </div>
        </article>`;
    })
    .join("");

  return `
    <section class="country-detail-panel">
      <div class="country-detail-header">
        <div>
          <span class="country-detail-label">Detalles de sede</span>
          <h2>${country.nombre}</h2>
        </div>
      </div>
      <div class="detalle-grid">${cards}</div>
    </section>`;
}

function renderCountryDetails(countryCode) {
  const titleElement = document.getElementById("nombre-pais-seleccionado");
  const container = document.getElementById("contenedor-info");
  if (!container || !titleElement) return;

  const country = datosMundial[countryCode];
  titleElement.textContent = country ? country.nombre : "Selecciona una sede para ver más";
  container.innerHTML = buildCountryDetails(countryCode);
  document.getElementById("detalle-sedes").scrollIntoView({ behavior: "smooth", block: "start" });
}

function setupCountryCards() {
  const cards = document.querySelectorAll(".host-card[data-country]");
  cards.forEach((card) => {
    if (card.tagName.toLowerCase() === "a" && card.hasAttribute("href")) {
      return;
    }

    const countryCode = card.dataset.country;
    card.addEventListener("click", () => renderCountryDetails(countryCode));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        renderCountryDetails(countryCode);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupCountryCards();
});
