import os

API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:3000")

class WorldApiClient:
    def __init__(self, base_url: str = API_BASE_URL):
        self.base_url = base_url

    def get_matches_url(self) -> str:
        return f"{self.base_url}/api/matches"

    def get_groups_url(self) -> str:
        return f"{self.base_url}/api/groups"

    def get_scorers_url(self) -> str:
        return f"{self.base_url}/api/scorers"
