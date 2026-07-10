import os

import requests
from django.conf import settings
from django.shortcuts import render


def _get_news_items():
    token = getattr(settings, "NEWSAPI_TOKEN", None) or os.environ.get("NEWSAPI_TOKEN")
    if not token:
        return []

    try:
        response = requests.get(
            "https://newsapi.org/v2/top-headlines",
            params={"country": "ar", "category": "sports", "pageSize": 6, "apiKey": token},
            timeout=10,
        )
        response.raise_for_status()
        payload = response.json()
        articles = payload.get("articles", []) or []
        items = []
        for article in articles:
            title = (article.get("title") or "").strip()
            if not title:
                continue
            source = (article.get("source") or {}).get("name") or "Noticias"
            items.append(
                {
                    "title": title,
                    "description": (article.get("description") or "Sin descripción disponible").strip(),
                    "url": article.get("url") or "#",
                    "image": (article.get("urlToImage") or "").strip(),
                    "source": source,
                    "published_at": (article.get("publishedAt") or "").replace("T", " ").replace("Z", " UTC"),
                }
            )
        return items[:6]
    except requests.RequestException:
        return []


def index(request):
    news_items = _get_news_items()
    return render(
        request,
        "index.html",
        {"api_base_url": settings.API_BASE_URL, "news_items": news_items},
    )


def login(request):
    return render(request, "login.html", {"api_base_url": settings.API_BASE_URL})


def profile(request):
    return render(request, "profile.html", {"api_base_url": settings.API_BASE_URL})


def history_view(request):
    return render(request, "history.html", {"api_base_url": settings.API_BASE_URL})