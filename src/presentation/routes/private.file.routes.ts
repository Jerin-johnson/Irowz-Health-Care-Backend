import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { ViewPrivateFileController } from "../controllers/viewPrivateFile/ViewPrivateFile";

export class ViewPrivateFileRoutes {
  private router: Router;

  constructor(private readonly _ViewPrivateFileController: ViewPrivateFileController) {
    this.router = Router();
  }

  register(): Router {
    this.router.get(
      "/get-signed-url",
      authMiddleware,
      this._ViewPrivateFileController.GetSignedUrlForPrivateFile
    );
    return this.router;
  }
}
