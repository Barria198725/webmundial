from django.conf import settings
from django.shortcuts import render


def index(request):
    return render(request, "index.html", {"api_base_url": settings.API_BASE_URL})


def login(request):
    return render(request, "login.html", {"api_base_url": settings.API_BASE_URL})


def profile(request):
    return render(request, "profile.html", {"api_base_url": settings.API_BASE_URL})
