import { Product } from "../entities/product.js";
import { IProductRepository } from "../repositories/product.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError } from "../../../shared/errors/domain.error.js";

export class ListProducts {
  constructor(private productRepository: IProductRepository) {}

  public async execute(): Promise<Result<Product[], DomainError>> {
    const products = await this.productRepository.findAll();
    return Result.ok(products);
  }
}
