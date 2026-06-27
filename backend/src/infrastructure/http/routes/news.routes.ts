import { Router } from "express";
import { NewsController } from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export function createNewsRouter(newsController: NewsController): Router {
  const router = Router();

  // Public routes
  router.get("/", newsController.list);
  router.get("/:id", newsController.getById);

  // Guard modifying news routes with authentication middleware
  router.use(authMiddleware);

  router.post("/", newsController.create);
  router.put("/:id", newsController.update);
  router.delete("/:id", newsController.delete);

  return router;
}
