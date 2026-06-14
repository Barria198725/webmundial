import os
import requests
from typing import Any

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:3000")

class CatalogApiClient:
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url

    def fetch_catalog(self) -> Any:
        response = requests.get(f"{self.base_url}/api/catalogo", timeout=10)
        response.raise_for_status()
        return response.json()
