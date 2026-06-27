export class InMemoryStockHistoryRepository {
    history = [];
    async save(entry) {
        this.history.push(entry);
    }
    async findByProductId(productId) {
        return this.history.filter((entry) => entry.product_id === productId);
    }
}
