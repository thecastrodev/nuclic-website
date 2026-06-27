import { StockHistory } from "../entities/stock-history.js";
import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class RestockProduct {
    productRepository;
    stockHistoryRepository;
    constructor(productRepository, stockHistoryRepository) {
        this.productRepository = productRepository;
        this.stockHistoryRepository = stockHistoryRepository;
    }
    async execute(input) {
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
