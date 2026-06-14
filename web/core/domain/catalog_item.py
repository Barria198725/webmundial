from dataclasses import dataclass

@dataclass
class CatalogItem:
    id: int
    name: str
    description: str
    price: float
