import { CatalogRepository } from "../domain/repositories/catalogRepository";
import { CatalogItem } from "../domain/entities/catalogItem";

export class GetCatalogListUseCase {
  constructor(private repository: CatalogRepository) {}

  async execute(): Promise<CatalogItem[]> {
    return this.repository.getAll();
  }
}
