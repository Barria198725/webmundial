import requests
import os
from django.core.cache import cache
from django.conf import settings


class SportsMonksService:
    """Servicio para consumir API de SportMonks y NewsAPI"""
    
    BASE_URL = "https://api.sportmonks.com/v3/football"
    NEWSAPI_URL = "https://newsapi.org/v2/everything"
    CACHE_TTL = 1800  # 30 minutos para noticias, actualizaciones más frecuentes
    
    def __init__(self):
        self.sportmonks_token = os.getenv('SPORTMONKS_TOKEN', 'YOUR_TOKEN')
        self.newsapi_token = os.getenv('NEWSAPI_TOKEN', 'YOUR_NEWSAPI_TOKEN')
        self.headers = {
            'Accept': 'application/json'
        }
    
    def _get_with_cache(self, endpoint, cache_key, params=None):
        """Obtiene datos con caché"""
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        try:
            if params is None:
                params = {}
            
            params['api_token'] = self.sportmonks_token
            
            response = requests.get(
                f"{self.BASE_URL}{endpoint}",
                headers=self.headers,
                params=params,
                timeout=10
            )
            response.raise_for_status()
            data = response.json()
            
            cache.set(cache_key, data, self.CACHE_TTL)
            return data
            
        except requests.RequestException as e:
            return {
                'error': str(e),
                'data': [],
                'message': 'Error al conectar con SportMonks API'
            }
    
    def get_world_cup_info(self):
        """Obtiene información del Mundial FIFA"""
        return self._get_with_cache(
            '/leagues/search/FIFA World Cup',
            'sportmonks_world_cup',
            params={'include': 'teams,seasons,standings'}
        )
    
    def get_world_cup_matches(self):
        """Obtiene partidos del Mundial"""
        return self._get_with_cache(
            '/matches',
            'sportmonks_matches',
            params={
                'filters': 'league_id:5',
                'include': 'teams,scores,season'
            }
        )
    
    def get_world_cup_standings(self):
        """Obtiene la tabla de posiciones"""
        return self._get_with_cache(
            '/standings',
            'sportmonks_standings',
            params={
                'filters': 'season_id:23821',
                'include': 'group'
            }
        )
    
    def get_news(self):
        """Obtiene noticias reales del mundial desde NewsAPI"""
        cache_key = 'sportmonks_news'
        cached_data = cache.get(cache_key)
        if cached_data:
            return cached_data
        
        try:
            # Consultar noticias sobre el Mundial 2026
            params = {
                'q': 'FIFA World Cup 2026',
                'sortBy': 'publishedAt',
                'language': 'es',
                'apiKey': self.newsapi_token
            }
            
            response = requests.get(
                self.NEWSAPI_URL,
                params=params,
                timeout=10
            )
            response.raise_for_status()
            articles = response.json()
            
            # Procesar artículos para categorizar por tipo
            processed_articles = []
            for article in articles.get('articles', [])[:20]:  # Limitar a 20 noticias
                # Categorizar según el contenido
                title_lower = article['title'].lower()
                description_lower = (article.get('description', '') or '').lower()
                
                if any(word in title_lower or word in description_lower for word in ['partido', 'match', 'vs', 'enfrentamiento']):
                    news_type = 'matches'
                elif any(word in title_lower or word in description_lower for word in ['clasificación', 'tabla', 'posición', 'standings', 'group']):
                    news_type = 'standings'
                elif any(word in title_lower or word in description_lower for word in ['equipo', 'jugador', 'player', 'goles', 'goals', 'selección']):
                    news_type = 'teams'
                else:
                    news_type = 'matches'  # Por defecto
                
                processed_articles.append({
                    'id': hash(article['url']) % 10000,
                    'title': article['title'],
                    'description': article.get('description') or article.get('title'),
                    'type': news_type,
                    'published_at': article.get('publishedAt'),
                    'image': article.get('urlToImage') or 'https://via.placeholder.com/400x300?text=Mundial+2026',
                    'url': article.get('url'),
                    'source': article.get('source', {}).get('name', 'News Source')
                })
            
            data = {
                'data': processed_articles,
                'message': 'Noticias actualizadas del Mundial FIFA 2026'
            }
            
            # Guardar en caché por 30 minutos
            cache.set(cache_key, data, self.CACHE_TTL)
            return data
            
        except Exception as e:
            return {
                'error': str(e),
                'data': [],
                'message': 'Error al obtener noticias de NewsAPI'
            }

