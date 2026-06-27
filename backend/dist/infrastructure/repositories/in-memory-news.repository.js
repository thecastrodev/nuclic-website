export class InMemoryNewsRepository {
    newsList = new Map();
    async save(news) {
        this.newsList.set(news.id, news);
    }
    async findById(id) {
        const news = this.newsList.get(id);
        return news || null;
    }
    async findAll() {
        return Array.from(this.newsList.values());
    }
    async delete(id) {
        return this.newsList.delete(id);
    }
}
