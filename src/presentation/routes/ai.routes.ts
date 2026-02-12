import { Router } from "express";
import { AiController } from "../controllers/ai/ai.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export class AiRoutes {
  private router: Router;

  constructor(private readonly AiController: AiController) {
    this.router = Router();
  }

  register(): Router {
    this.router.post("/chat", authMiddleware, this.AiController.chat);
    return this.router;
  }
}
