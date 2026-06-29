from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse


def index(request):
    # Rendereamos index.html y le pasamos la URL de la API
    return render(request, "index.html", {"api_base_url": settings.API_BASE_URL})

def login(request):
    return render(request, "login.html", {"api_base_url": settings.API_BASE_URL})


def profile(request):
    return render(request, "profile.html", {"api_base_url": settings.API_BASE_URL})

def history_view(request):
    return render(request, 'history.html', {"api_base_url": settings.API_BASE_URL})