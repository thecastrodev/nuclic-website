import { StockHistory } from "../../domain/product/entities/stock-history.js";
import { IStockHistoryRepository } from "../../domain/product/repositories/stock-history.repository.js";

export class InMemoryStockHistoryRepository implements IStockHistoryRepository {
  private history: StockHistory[] = [];

  public async save(entry: StockHistory): Promise<void> {
    this.history.push(entry);
  }

  public async findByProductId(productId: string): Promise<StockHistory[]> {
    return this.history.filter((entry) => entry.product_id === productId);
  }
}
