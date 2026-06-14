import { Router } from "express";
import { CatalogoController } from "../controllers/catalogoController";
import { GetCatalogListUseCase } from "../../usecases/getCatalogListUseCase";
import { DatabaseCatalogRepository } from "../../infra/repositories/databaseCatalogRepository";

const router = Router();
const repository = new DatabaseCatalogRepository();
const useCase = new GetCatalogListUseCase(repository);
const controller = new CatalogoController(useCase);

router.get("/catalogo", (req, res) => controller.getCatalogo(req, res));

export default router;
