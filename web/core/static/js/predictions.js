(function () {
  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formatDate(value) {
    if (!value) return 'Sin fecha';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function stripHtml(value) {
    return String(value || '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function renderNews(newsArray) {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) return;

    if (!newsArray || newsArray.length === 0) {
      newsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-title">No hay noticias disponibles</div>
          <p>Intenta más tarde o vuelve a cargar la página.</p>
        </div>
      `;
      return;
    }

    newsGrid.innerHTML = newsArray.map((news, index) => `
      <article class="news-card" data-index="${index}">
        <div class="news-card-image">📰</div>
        <div class="news-card-content">
          <div class="news-card-date">${formatDate(news.created_at || news.published_at)}</div>
          <h3 class="news-card-title">${escapeHtml(news.title || 'Noticia sin título')}</h3>
          <p class="news-card-description">${escapeHtml(stripHtml(news.content || news.description || 'Sin descripción disponible').slice(0, 180))}${(news.content || news.description || '').length > 180 ? '…' : ''}</p>
          <div class="news-card-meta">
            <span class="news-card-tag">${escapeHtml(news.type || 'General')}</span>
            <a href="/noticia/${news.id}/" class="news-card-read-more" onclick="event.stopPropagation();">Leer más →</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  async function loadNewsData() {
    const newsGrid = document.getElementById('news-grid');
    if (!newsGrid) {
      return;
    }

    newsGrid.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Cargando noticias...</p>
      </div>
    `;

    try {
      const response = await fetch('/api/world-cup-news/');
      const data = await response.json();
      const newsArray = Array.isArray(data?.data) ? data.data : [];

      if (newsArray.length > 0) {
        renderNews(newsArray);
      } else {
        newsGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <div class="empty-state-title">No hay noticias disponibles</div>
            <p>La API no devolvió contenido en este momento.</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('Error loading news:', error);
      newsGrid.innerHTML = `
        <div class="error-state" style="grid-column: 1 / -1;">
          <div class="error-state-title">No se pudieron cargar las noticias</div>
          <p>Comprueba tu conexión o vuelve a intentarlo más tarde.</p>
        </div>
      `;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    const newsSection = document.getElementById('news');
    const newsGrid = document.getElementById('news-grid');

    if (newsGrid) {
      loadNewsData();
    }

    if (window.location.hash === '#news' && newsSection) {
      setTimeout(function () {
        newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 120);
    }
  });
})();

