import { StockHistory } from "../entities/stock-history.js";
import { IProductRepository } from "../repositories/product.repository.js";
import { IStockHistoryRepository } from "../repositories/stock-history.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export class GetStockHistory {
  constructor(
    private productRepository: IProductRepository,
    private stockHistoryRepository: IStockHistoryRepository
  ) {}

  public async execute(productId: string): Promise<Result<StockHistory[], DomainError>> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return Result.fail(new NotFoundError(`Product with ID ${productId} not found.`));
    }

    const history = await this.stockHistoryRepository.findByProductId(productId);
    return Result.ok(history);
  }
}
