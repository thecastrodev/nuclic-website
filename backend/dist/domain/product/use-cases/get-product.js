import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class GetProduct {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            return Result.fail(new NotFoundError(`Product with ID ${id} not found.`));
        }
        return Result.ok(product);
    }
}
