import { Router } from "express";
import { WorldController } from "../controllers/worldController";

const router = Router();
const controller = new WorldController();

router.get("/matches", (req, res) => controller.getMatches(req, res));
router.get("/groups", (req, res) => controller.getGroups(req, res));
router.get("/scorers", (req, res) => controller.getScorers(req, res));

export default router;
