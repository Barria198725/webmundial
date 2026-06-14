from typing import List
from ..domain.catalog_item import CatalogItem
from ..infra.api_client import CatalogApiClient

class CatalogService:
    def __init__(self, client: CatalogApiClient):
        self.client = client

    def get_catalog_items(self) -> List[CatalogItem]:
        raw_items = self.client.fetch_catalog()
        return [
            CatalogItem(
                id=item.get("id", 0),
                name=item.get("name", ""),
                description=item.get("description", ""),
                price=float(item.get("price", 0.0)),
            )
            for item in raw_items
        ]
