import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class GetStockHistory {
    productRepository;
    stockHistoryRepository;
    constructor(productRepository, stockHistoryRepository) {
        this.productRepository = productRepository;
        this.stockHistoryRepository = stockHistoryRepository;
    }
    async execute(productId) {
        const product = await this.productRepository.findById(productId);
        if (!product) {
            return Result.fail(new NotFoundError(`Product with ID ${productId} not found.`));
        }
        const history = await this.stockHistoryRepository.findByProductId(productId);
        return Result.ok(history);
    }
}
