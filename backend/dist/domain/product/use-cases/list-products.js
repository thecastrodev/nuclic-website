import { Result } from "../../../shared/result/result.js";
export class ListProducts {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async execute() {
        const products = await this.productRepository.findAll();
        return Result.ok(products);
    }
}
