import os
import re
from html import unescape
import requests
from django.core.cache import cache
from django.conf import settings


class SportsMonksService:
    """Servicio para consumir APIs de noticias: NewsAPI principal."""

    NEWSAPI_URL = "https://newsapi.org/v2/everything"
    CACHE_TTL = 1800  # 30 minutos para noticias

    def _fallback_news(self, reason=None):
        """Devuelve noticias de respaldo para que la UI siempre tenga contenido visible."""
        articles = [
            {
                'id': 1001,
                'title': 'Mundial 2026: las sedes ya preparan la gran fiesta',
                'description': 'Estados Unidos, México y Canadá se preparan para recibir a los mejores equipos del planeta.',
                'content': 'La Copa del Mundo 2026 está a la vuelta de la esquina y las sedes ya trabajan en infraestructura, transporte y experiencias para los hinchas.',
                'type': 'matches',
                'published_at': '2026-07-10T12:00:00Z',
                'created_at': '2026-07-10T12:00:00Z',
                'image': 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80',
                'url': '#',
                'source': 'Mundial 2026 Demo'
            },
            {
                'id': 1002,
                'title': 'La clasificación empieza a tomar forma con grandes sorpresas',
                'description': 'Equipos históricos están peleando por los últimos cupos y la competencia promete emoción.',
                'content': 'Los duelos de clasificación en cada confederación están generando grandes emociones y dejando a varios equipos en la pelea por el torneo.',
                'type': 'standings',
                'published_at': '2026-07-08T16:30:00Z',
                'created_at': '2026-07-08T16:30:00Z',
                'image': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80',
                'url': '#',
                'source': 'Mundial 2026 Demo'
            },
            {
                'id': 1003,
                'title': 'Los equipos debutantes buscan dejar su huella',
                'description': 'Nuevas selecciones y talentos emergentes se perfilan como protagonistas del torneo.',
                'content': 'La edición 2026 trae equipos con hambre de gloria que quieren hacer historia en la mayor competencia del fútbol.',
                'type': 'teams',
                'published_at': '2026-07-05T09:15:00Z',
                'created_at': '2026-07-05T09:15:00Z',
                'image': 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=900&q=80',
                'url': '#',
                'source': 'Mundial 2026 Demo'
            }
        ]
        return {
            'data': articles,
            'message': f'Noticias de respaldo activadas{f": {reason}" if reason else ""}'
        }

    def __init__(self):
        # Token de NewsAPI desde variables de entorno
        self.newsapi_token = os.getenv('NEWSAPI_TOKEN', '')
        self.headers = {
            'Accept': 'application/json'
        }

    def _clean_text(self, value):
        """Limpia texto HTML y caracteres especiales."""
        if not value:
            return ""
        text = unescape(value)
        text = re.sub(r"<[^>]+>", " ", text)
        return text.replace("&nbsp;", " ").strip()

    def _categorize_news(self, title, description):
        """Categoriza las noticias según su contenido."""
        title_lower = title.lower()
        description_lower = description.lower()

        keywords = {
            'matches': ['partido', 'match', 'vs', 'enfrentamiento', 'gol', 'goal', 'resultado', 'final'],
            'standings': ['clasificación', 'tabla', 'posición', 'standings', 'group', 'grupo'],
            'teams': ['equipo', 'jugador', 'player', 'selección', 'squad', 'alineación']
        }

        for category, words in keywords.items():
            if any(word in title_lower or word in description_lower for word in words):
                return category
        return 'general'

    def get_news(self):
        """Obtiene noticias del Mundial desde NewsAPI."""
        cache_key = 'newsapi_headlines'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data

        try:
            # Usar NewsAPI con el token registrado
            if not self.newsapi_token:
                return self._fallback_news('token de NewsAPI no configurado')

            params = {
                'q': 'FIFA World Cup 2026 football soccer',
                'sortBy': 'publishedAt',
                'language': 'es',
                'apiKey': self.newsapi_token,
                'pageSize': 20
            }

            response = requests.get(
                self.NEWSAPI_URL,
                params=params,
                headers=self.headers,
                timeout=10
            )
            response.raise_for_status()
            api_data = response.json()

            if api_data.get('status') == 'error':
                return self._fallback_news(api_data.get('message', 'Desconocido'))

            articles = api_data.get('articles', [])
            processed_articles = []

            for article in articles:
                title = self._clean_text(article.get('title') or '')
                description = self._clean_text(article.get('description') or '')
                content = self._clean_text(article.get('content') or description or title)
                url = article.get('url') or ''
                image = article.get('urlToImage') or 'https://via.placeholder.com/400x300?text=Mundial+2026'
                published_at = article.get('publishedAt') or ''
                source = article.get('source', {}).get('name', 'NewsAPI')

                processed_articles.append({
                    'id': hash(url or title) % 10000,
                    'title': title,
                    'description': description,
                    'content': content,
                    'type': self._categorize_news(title, description),
                    'published_at': published_at,
                    'created_at': published_at,
                    'image': image,
                    'url': url,
                    'source': source,
                })

            if not processed_articles:
                return self._fallback_news('sin artículos disponibles')

            data = {
                'data': processed_articles,
                'message': f'Noticias actualizadas desde NewsAPI ({len(processed_articles)} artículos)'
            }

            cache.set(cache_key, data, self.CACHE_TTL)
            return data

        except requests.exceptions.RequestException as e:
            return {
                'error': str(e),
                'data': self._fallback_news(str(e)).get('data', []),
                'message': f'Error al conectar con NewsAPI: {str(e)}'
            }
        except Exception as e:
            return {
                'error': str(e),
                'data': self._fallback_news(str(e)).get('data', []),
                'message': f'Error procesando noticias: {str(e)}'
            }

    def get_world_cup_info(self):
        """Retorna información básica del Mundial (datos estáticos)."""
        return {
            'data': [{
                'id': 1,
                'name': 'FIFA World Cup 2026',
                'season': '2026',
                'teams_count': 32,
                'country': 'USA, México, Canadá',
                'image': None
            }]
        }

    def get_world_cup_standings(self):
        """Retorna clasificación estática del Mundial."""
        return {
            'data': [
                {'position': 1, 'team_name': 'Argentina', 'points': 9, 'played': 3},
                {'position': 2, 'team_name': 'Francia', 'points': 7, 'played': 3},
                {'position': 3, 'team_name': 'Brasil', 'points': 7, 'played': 3},
                {'position': 4, 'team_name': 'España', 'points': 6, 'played': 3},
                {'position': 5, 'team_name': 'Alemania', 'points': 5, 'played': 3},
                {'position': 6, 'team_name': 'Italia', 'points': 5, 'played': 3},
                {'position': 7, 'team_name': 'Países Bajos', 'points': 4, 'played': 3},
                {'position': 8, 'team_name': 'Portugal', 'points': 3, 'played': 3},
            ]
        }

    def get_world_cup_matches(self):
        """Obtiene partidos del Mundial (deprecado)."""
        return {
            'data': [],
            'message': 'Función deprecada'
        }
