import { Product } from "../entities/product.js";
import { Result } from "../../../shared/result/result.js";
export class CreateProduct {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute(input) {
        const productResult = Product.create({
            name: input.name,
            description: input.description,
            price: input.price,
            stock_total: input.stock_total,
            stock_withdrawn: input.stock_withdrawn,
        });
        if (productResult.isFailure) {
            return Result.fail(productResult.error);
        }
        const product = productResult.value;
        await this.productRepository.save(product);
        return Result.ok(product);
    }
}
