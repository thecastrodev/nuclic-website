import { News } from "../../domain/news/entities/news.js";
import { INewsRepository } from "../../domain/news/repositories/news.repository.js";

export class InMemoryNewsRepository implements INewsRepository {
  private newsList: Map<string, News> = new Map();

  public async save(news: News): Promise<void> {
    this.newsList.set(news.id, news);
  }

  public async findById(id: string): Promise<News | null> {
    const news = this.newsList.get(id);
    return news || null;
  }

  public async findAll(): Promise<News[]> {
    return Array.from(this.newsList.values());
  }

  public async delete(id: string): Promise<boolean> {
    return this.newsList.delete(id);
  }
}
