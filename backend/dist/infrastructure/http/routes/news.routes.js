import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
export function createNewsRouter(newsController) {
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
