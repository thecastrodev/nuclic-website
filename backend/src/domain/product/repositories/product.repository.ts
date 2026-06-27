import { Product } from "../entities/product.js";

export interface IProductRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  delete(id: string): Promise<boolean>;
}
