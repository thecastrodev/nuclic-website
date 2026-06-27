import { Product } from "../entities/product.js";
import { IProductRepository } from "../repositories/product.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export class GetProduct {
  constructor(private productRepository: IProductRepository) {}

  public async execute(id: string): Promise<Result<Product, DomainError>> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      return Result.fail(new NotFoundError(`Product with ID ${id} not found.`));
    }
    return Result.ok(product);
  }
}
