import { Request, Response } from "express";
import { MySQLWorldRepository } from "../../infra/repositories/mysqlWorldRepository";

export class WorldController {
  private repository = new MySQLWorldRepository();

  async getMatches(req: Request, res: Response): Promise<void> {
    try {
      const matches = await this.repository.getMatches();
      res.json(matches);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los partidos" });
    }
  }

  async getGroups(req: Request, res: Response): Promise<void> {
    try {
      const groups = await this.repository.getGroups();
      res.json(groups);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los grupos" });
    }
  }

  async getScorers(req: Request, res: Response): Promise<void> {
    try {
      const scorers = await this.repository.getScorers();
      res.json(scorers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los goleadores" });
    }
  }
}
