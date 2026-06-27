import { Request, Response } from "express";
import { CreateProduct } from "../../../domain/product/use-cases/create-product.js";
import { ListProducts } from "../../../domain/product/use-cases/list-products.js";
import { GetProduct } from "../../../domain/product/use-cases/get-product.js";
import { UpdateProduct } from "../../../domain/product/use-cases/update-product.js";
import { ConsumeStock } from "../../../domain/product/use-cases/consume-stock.js";
import { RestockProduct } from "../../../domain/product/use-cases/restock-product.js";
import { DeleteProduct } from "../../../domain/product/use-cases/delete-product.js";
import { GetStockHistory } from "../../../domain/product/use-cases/get-stock-history.js";
import { NotFoundError, ValidationError } from "../../../shared/errors/domain.error.js";

export class ProductController {
  constructor(
    private createProductUseCase: CreateProduct,
    private listProductsUseCase: ListProducts,
    private getProductUseCase: GetProduct,
    private updateProductUseCase: UpdateProduct,
    private consumeStockUseCase: ConsumeStock,
    private restockProductUseCase: RestockProduct,
    private deleteProductUseCase: DeleteProduct,
    private getStockHistoryUseCase: GetStockHistory
  ) {}

  private handleError(res: Response, error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: message });
  }

  public create = async (req: Request, res: Response) => {
    const { name, description, price, stock_total, stock_withdrawn } = req.body;

    if (price !== undefined && typeof price !== "number") {
      return res.status(400).json({ error: "Price must be a number." });
    }
    if (stock_total !== undefined && typeof stock_total !== "number") {
      return res.status(400).json({ error: "Stock total must be a number." });
    }
    if (stock_withdrawn !== undefined && typeof stock_withdrawn !== "number") {
      return res.status(400).json({ error: "Stock withdrawn must be a number." });
    }

    const result = await this.createProductUseCase.execute({
      name,
      description,
      price,
      stock_total,
      stock_withdrawn,
    });

    if (result.isFailure) {
      return this.handleError(res, result.error);
    }

    return res.status(201).json(result.value.toJSON());
  };

  public list = async (req: Request, res: Response) => {
    const result = await this.listProductsUseCase.execute();
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(200).json(result.value.map((p) => p.toJSON()));
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.getProductUseCase.execute(id);
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(200).json(result.value.toJSON());
  };

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, stock_total, stock_withdrawn } = req.body;

    if (typeof price !== "number") {
      return res.status(400).json({ error: "Price is required and must be a number." });
    }
    if (typeof stock_total !== "number") {
      return res.status(400).json({ error: "Stock total is required and must be a number." });
    }
    if (typeof stock_withdrawn !== "number") {
      return res.status(400).json({ error: "Stock withdrawn is required and must be a number." });
    }

    const result = await this.updateProductUseCase.execute({
      id,
      name,
      description: description ?? "",
      price,
      stock_total,
      stock_withdrawn,
    });

    if (result.isFailure) {
      return this.handleError(res, result.error);
    }

    return res.status(200).json(result.value.toJSON());
  };

  public consume = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number") {
      return res.status(400).json({ error: "Quantity is required and must be a number." });
    }

    const result = await this.consumeStockUseCase.execute({
      productId: id,
      quantity,
    });

    if (result.isFailure) {
      return this.handleError(res, result.error);
    }

    return res.status(200).json(result.value.toJSON());
  };

  public restock = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== "number") {
      return res.status(400).json({ error: "Quantity is required and must be a number." });
    }

    const result = await this.restockProductUseCase.execute({
      productId: id,
      quantity,
    });

    if (result.isFailure) {
      return this.handleError(res, result.error);
    }

    return res.status(200).json(result.value.toJSON());
  };

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.deleteProductUseCase.execute(id);
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(204).send();
  };

  public getHistory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.getStockHistoryUseCase.execute(id);
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(200).json(result.value.map((h) => h.toJSON()));
  };
}
