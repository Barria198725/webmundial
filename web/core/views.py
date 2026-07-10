from django.conf import settings
from django.shortcuts import render
from django.http import Http404
from .data.country_data import COUNTRY_SEDES


def index(request):
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
