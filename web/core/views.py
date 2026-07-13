from django.conf import settings
from django.shortcuts import render
from django.http import Http404, JsonResponse
from django.views.decorators.http import require_http_methods

from .data.country_data import COUNTRY_SEDES


def index(request):
    """Vista de inicio"""
    return render(request, "index.html", {"api_base_url": settings.API_BASE_URL})


def login(request):
    """Vista de login"""
    return render(request, "login.html", {"api_base_url": settings.API_BASE_URL})


def profile(request):
    """Vista de perfil"""
    return render(request, "profile.html", {"api_base_url": settings.API_BASE_URL})


def history_view(request):
    """Vista del historial"""
    return render(request, 'history.html', {"api_base_url": settings.API_BASE_URL})


def partidos(request):
    """Vista de partidos"""
    return render(request, 'partidos.html', {"api_base_url": settings.API_BASE_URL})


def country_detail(request, country_code):
    """Vista de detalle de país"""
    country = COUNTRY_SEDES.get(country_code.upper())
    if not country:
        raise Http404("País no encontrado")
    return render(request, "country_detail.html", {
        "country": country,
        "api_base_url": settings.API_BASE_URL,
    })


def legends_view(request):
    """Vista independiente para la página de Leyendas"""
    return render(request, 'legends.html', {"api_base_url": settings.API_BASE_URL})


def news_view(request):
    """Vista para la página de noticias"""
    return render(request, 'noticias.html', {"api_base_url": settings.API_BASE_URL})


@require_http_methods(["GET"])
def get_world_cup_news(request):
    """Endpoint API para obtener noticias del Mundial"""
    try:
        from .services.sports_api_service import SportsMonksService
        service = SportsMonksService()
        news_data = service.get_news()
        return JsonResponse(news_data)
    except Exception as e:
        return JsonResponse({"error": str(e), "data": [], "message": "Error interno al obtener noticias"}, status=500)


@require_http_methods(["GET"])
def get_world_cup_info(request):
    """Endpoint API para obtener información del Mundial"""
    try:
        from .services.sports_api_service import SportsMonksService
        service = SportsMonksService()
        info_data = service.get_world_cup_info()
        return JsonResponse(info_data)
    except Exception as e:
        return JsonResponse({"error": str(e), "data": {}, "message": "Error interno al obtener info"}, status=500)


@require_http_methods(["GET"])
def get_world_cup_standings(request):
    """Endpoint API para obtener clasificación del Mundial"""
    try:
        from .services.sports_api_service import SportsMonksService
        service = SportsMonksService()
        standings_data = service.get_world_cup_standings()
        return JsonResponse(standings_data)
    except Exception as e:
        return JsonResponse({"error": str(e), "data": [], "message": "Error interno al obtener standings"}, status=500)
