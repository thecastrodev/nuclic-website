import { Product } from "../entities/product.js";
import { IProductRepository } from "../repositories/product.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError } from "../../../shared/errors/domain.error.js";

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  stock_total?: number;
  stock_withdrawn?: number;
  img?: string;
}

export class CreateProduct {
  constructor(private productRepository: IProductRepository) {}

  public async execute(input: CreateProductInput): Promise<Result<Product, DomainError>> {
    const productResult = Product.create({
      name: input.name,
      description: input.description,
      price: input.price,
      stock_total: input.stock_total,
      stock_withdrawn: input.stock_withdrawn,
      img: input.img,
    });

    if (productResult.isFailure) {
      return Result.fail(productResult.error);
    }

    const product = productResult.value;
    await this.productRepository.save(product);
    return Result.ok(product);
  }
}
