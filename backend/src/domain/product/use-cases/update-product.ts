import { Product } from "../entities/product.js";
import { IProductRepository } from "../repositories/product.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export interface UpdateProductInput {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_total: number;
  stock_withdrawn: number;
}

export class UpdateProduct {
  constructor(private productRepository: IProductRepository) {}

  public async execute(input: UpdateProductInput): Promise<Result<Product, DomainError>> {
    const product = await this.productRepository.findById(input.id);
    if (!product) {
      return Result.fail(new NotFoundError(`Product with ID ${input.id} not found.`));
    }

    const updateResult = product.update({
      name: input.name,
      description: input.description,
      price: input.price,
      stock_total: input.stock_total,
      stock_withdrawn: input.stock_withdrawn,
    });

    if (updateResult.isFailure) {
      return Result.fail(updateResult.error);
    }

    await this.productRepository.save(product);
    return Result.ok(product);
  }
}
