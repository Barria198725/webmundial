from django.conf import settings
from django.http import Http404, JsonResponse
from django.shortcuts import redirect, render
from django.urls import reverse
from django.views.decorators.http import require_http_methods

from .data.country_data import COUNTRY_SEDES
from .services.sports_api_service import SportsMonksService


def index(request):
    # Rendereamos index.html y le pasamos la URL de la API
    return render(request, "index.html", {"api_base_url": settings.API_BASE_URL})

def login(request):
    return render(request, "login.html", {"api_base_url": settings.API_BASE_URL})


def profile(request):
    return render(request, "profile.html", {"api_base_url": settings.API_BASE_URL})


def history_view(request):
    return render(request, 'history.html', {"api_base_url": settings.API_BASE_URL})


def partidos(request):
    return render(request, 'partidos.html', {"api_base_url": settings.API_BASE_URL})


def country_detail(request, country_code):
    country = COUNTRY_SEDES.get(country_code.upper())
    if not country:
        raise Http404("País no encontrado")
    return render(request, "country_detail.html", {
        "country": country,
        "api_base_url": settings.API_BASE_URL,
    })


def news_view(request):
    """Redirige la navegación de Noticias a la página de noticias independiente."""
    return redirect(reverse('news_page'))


@require_http_methods(["GET"])
def get_world_cup_news(request):
    """Endpoint API para obtener noticias del Mundial desde SportMonks"""
    service = SportsMonksService()
    news_data = service.get_news()
    return JsonResponse(news_data)

@require_http_methods(["GET"])
def get_world_cup_info(request):
    """Endpoint API para obtener información del Mundial"""
    service = SportsMonksService()
    info_data = service.get_world_cup_info()
    return JsonResponse(info_data)

@require_http_methods(["GET"])
def get_world_cup_standings(request):
    """Endpoint API para obtener clasificación del Mundial"""
    service = SportsMonksService()
    standings_data = service.get_world_cup_standings()
    return JsonResponse(standings_data)


@require_http_methods(["GET"])
def get_world_cup_matches(request):
    """Endpoint API para obtener partidos (deprecado)."""
    return JsonResponse({'data': [], 'message': 'Deprecado'})


def news_detail(request, news_id):
    """Muestra una noticia individual en su propia página."""
    service = SportsMonksService()
    news_data = service.get_news()
    items = news_data.get('data') or []
    # buscar por id (aseguramos comparación int)
    item = next((n for n in items if int(n.get('id') or 0) == int(news_id)), None)
    if not item:
        raise Http404("Noticia no encontrada")
    return render(request, 'noticia.html', {
        'news': item,
        'api_base_url': settings.API_BASE_URL,
    })


def news_page(request):
    """Renderiza `noticia.html` mostrando la primera noticia disponible.

    Esto permite acceder desde el menú a una página de noticia fija en `/noticia/`.
    """
    # Renderizamos la página de listado de noticias. La propia plantilla
    # (`noticias.html`) cargará las noticias vía JS desde el endpoint
    # `/api/world-cup-news/`.
    return render(request, 'noticias.html', {
        'api_base_url': settings.API_BASE_URL,
    })
