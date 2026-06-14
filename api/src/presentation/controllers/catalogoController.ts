import { Request, Response } from "express";
import { GetCatalogListUseCase } from "../../usecases/getCatalogListUseCase";
import { CatalogRepository } from "../../domain/repositories/catalogRepository";

export class CatalogoController {
  constructor(private useCase: GetCatalogListUseCase) {}

  async getCatalogo(req: Request, res: Response): Promise<void> {
    try {
      const items = await this.useCase.execute();
      res.json(items);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el catálogo" });
    }
  }
}
