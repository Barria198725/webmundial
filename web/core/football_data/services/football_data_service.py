import os
from typing import Optional
import requests

API_BASE_URL = "https://api.football-data.org/v4"
API_KEY = os.environ.get("FOOTBALL_DATA_API_KEY", "")

class FootballDataService:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or API_KEY
        if not self.api_key:
            raise ValueError("FOOTBALL_DATA_API_KEY no está configurada en el entorno")

    def get_wc_matches(self):
        url = f"{API_BASE_URL}/competitions/WC/matches"
        headers = {"X-Auth-Token": self.api_key}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return response.json()
