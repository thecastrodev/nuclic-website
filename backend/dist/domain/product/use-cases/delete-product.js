import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class DeleteProduct {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(id) {
        const deleted = await this.productRepository.delete(id);
        if (!deleted) {
            return Result.fail(new NotFoundError(`Product with ID ${id} not found.`));
        }
        return Result.ok();
    }
}
