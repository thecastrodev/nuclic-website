import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export function createProductRouter(productController: ProductController): Router {
  const router = Router();
  
  // Public routes
  router.get("/", productController.list);
  router.get("/:id", productController.getById);

  // Guard modifying product routes with authentication middleware
  router.use(authMiddleware);

  router.post("/", productController.create);
  router.put("/:id", productController.update);
  router.patch("/:id/consume", productController.consume);
  router.patch("/:id/restock", productController.restock);
  router.delete("/:id", productController.delete);
  router.get("/:id/history", productController.getHistory);

  return router;
}
