import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./infrastructure/http/swagger/swagger.config.js";

// Repositories interfaces
import { IProductRepository } from "./domain/product/repositories/product.repository.js";
import { IStockHistoryRepository } from "./domain/product/repositories/stock-history.repository.js";
import { INewsRepository } from "./domain/news/repositories/news.repository.js";

// Repository implementations
import { InMemoryProductRepository } from "./infrastructure/repositories/in-memory-product.repository.js";
import { InMemoryStockHistoryRepository } from "./infrastructure/repositories/in-memory-stock-history.repository.js";
import { InMemoryNewsRepository } from "./infrastructure/repositories/in-memory-news.repository.js";

// Use cases - Product
import { CreateProduct } from "./domain/product/use-cases/create-product.js";
import { ListProducts } from "./domain/product/use-cases/list-products.js";
import { GetProduct } from "./domain/product/use-cases/get-product.js";
import { UpdateProduct } from "./domain/product/use-cases/update-product.js";
import { ConsumeStock } from "./domain/product/use-cases/consume-stock.js";
import { RestockProduct } from "./domain/product/use-cases/restock-product.js";
import { DeleteProduct } from "./domain/product/use-cases/delete-product.js";
import { GetStockHistory } from "./domain/product/use-cases/get-stock-history.js";

// Use cases - News
import { CreateNews } from "./domain/news/use-cases/create-news.js";
import { ListNews } from "./domain/news/use-cases/list-news.js";
import { GetNews } from "./domain/news/use-cases/get-news.js";
import { UpdateNews } from "./domain/news/use-cases/update-news.js";
import { DeleteNews } from "./domain/news/use-cases/delete-news.js";

// Controllers
import { AuthController } from "./infrastructure/http/controllers/auth.controller.js";
import { ProductController } from "./infrastructure/http/controllers/product.controller.js";
import { NewsController } from "./infrastructure/http/controllers/news.controller.js";

// Routers
import { createAuthRouter } from "./infrastructure/http/routes/auth.routes.js";
import { createProductRouter } from "./infrastructure/http/routes/product.routes.js";
import { createNewsRouter } from "./infrastructure/http/routes/news.routes.js";

export function createApp(options?: {
  productRepository?: IProductRepository;
  stockHistoryRepository?: IStockHistoryRepository;
  newsRepository?: INewsRepository;
}) {
  dotenv.config();

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Initialize repositories (defaults to InMemory singletons if not provided)
  const productRepository = options?.productRepository || new InMemoryProductRepository();
  const stockHistoryRepository = options?.stockHistoryRepository || new InMemoryStockHistoryRepository();
  const newsRepository = options?.newsRepository || new InMemoryNewsRepository();

  // Initialize Use Cases
  const createProductUseCase = new CreateProduct(productRepository);
  const listProductsUseCase = new ListProducts(productRepository);
  const getProductUseCase = new GetProduct(productRepository);
  const updateProductUseCase = new UpdateProduct(productRepository);
  const consumeStockUseCase = new ConsumeStock(productRepository, stockHistoryRepository);
  const restockProductUseCase = new RestockProduct(productRepository, stockHistoryRepository);
  const deleteProductUseCase = new DeleteProduct(productRepository);
  const getStockHistoryUseCase = new GetStockHistory(productRepository, stockHistoryRepository);

  const createNewsUseCase = new CreateNews(newsRepository);
  const listNewsUseCase = new ListNews(newsRepository);
  const getNewsUseCase = new GetNews(newsRepository);
  const updateNewsUseCase = new UpdateNews(newsRepository);
  const deleteNewsUseCase = new DeleteNews(newsRepository);

  // Initialize Controllers
  const authController = new AuthController();
  const productController = new ProductController(
    createProductUseCase,
    listProductsUseCase,
    getProductUseCase,
    updateProductUseCase,
    consumeStockUseCase,
    restockProductUseCase,
    deleteProductUseCase,
    getStockHistoryUseCase
  );
  const newsController = new NewsController(
    createNewsUseCase,
    listNewsUseCase,
    getNewsUseCase,
    updateNewsUseCase,
    deleteNewsUseCase
  );

  // Register Routers
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use("/auth", createAuthRouter(authController));
  app.use("/products", createProductRouter(productController));
  app.use("/news", createNewsRouter(newsController));

  // Global Error Handler fallback
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "An unexpected error occurred on the server." });
  });

  return app;
}
