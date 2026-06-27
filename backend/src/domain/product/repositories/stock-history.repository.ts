import { StockHistory } from "../entities/stock-history.js";

export interface IStockHistoryRepository {
  save(history: StockHistory): Promise<void>;
  findByProductId(productId: string): Promise<StockHistory[]>;
}
