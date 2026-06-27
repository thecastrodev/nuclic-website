import { Router } from "express";
import { NewsController } from "../controllers/news.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export function createNewsRouter(newsController: NewsController): Router {
  const router = Router();

  // Guard all news routes with authentication middleware
  router.use(authMiddleware);

  router.post("/", newsController.create);
  router.get("/", newsController.list);
  router.get("/:id", newsController.getById);
  router.put("/:id", newsController.update);
  router.delete("/:id", newsController.delete);

  return router;
}
