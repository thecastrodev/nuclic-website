export class InMemoryProductRepository {
    products = new Map();
    async save(product) {
        this.products.set(product.id, product);
    }
    async findById(id) {
        const product = this.products.get(id);
        return product || null;
    }
    async findAll() {
        return Array.from(this.products.values());
    }
    async delete(id) {
        return this.products.delete(id);
    }
}
