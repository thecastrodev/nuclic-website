import { Product } from "../entities/product.js";
import { StockHistory } from "../entities/stock-history.js";
import { IProductRepository } from "../repositories/product.repository.js";
import { IStockHistoryRepository } from "../repositories/stock-history.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export interface RestockProductInput {
  productId: string;
  quantity: number;
}

export class RestockProduct {
  constructor(
    private productRepository: IProductRepository,
    private stockHistoryRepository: IStockHistoryRepository
  ) {}

  public async execute(input: RestockProductInput): Promise<Result<Product, DomainError>> {
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      return Result.fail(new NotFoundError(`Product with ID ${input.productId} not found.`));
    }

    const restockResult = product.restock(input.quantity);
    if (restockResult.isFailure) {
      return Result.fail(restockResult.error);
    }

    const historyResult = StockHistory.create({
      product_id: product.id,
      operation: "restock",
      quantity: input.quantity,
    });

    if (historyResult.isFailure) {
      return Result.fail(historyResult.error);
    }

    await this.productRepository.save(product);
    await this.stockHistoryRepository.save(historyResult.value);

    return Result.ok(product);
  }
}
