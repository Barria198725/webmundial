from django.shortcuts import render
from .infra.api_client import CatalogApiClient
from .services.catalog_service import CatalogService


def index(request):
    client = CatalogApiClient()
    service = CatalogService(client)
    catalog_items = []
    error = None

    try:
        catalog_items = service.get_catalog_items()
    except Exception as exc:
        error = str(exc)

    return render(request, "index.html", {"catalog_items": catalog_items, "error": error})
