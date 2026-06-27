import { Product } from "../../domain/product/entities/product.js";
import { IProductRepository } from "../../domain/product/repositories/product.repository.js";

export class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  public async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }

  public async findById(id: string): Promise<Product | null> {
    const product = this.products.get(id);
    return product || null;
  }

  public async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  public async delete(id: string): Promise<boolean> {
    return this.products.delete(id);
  }
}
