from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_http_methods
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

def news_view(request):
    """Vista para el página de noticias"""
    return render(request, 'noticias.html', {"api_base_url": settings.API_BASE_URL})

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