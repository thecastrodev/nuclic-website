import { News } from "../entities/news.js";

export interface INewsRepository {
  save(news: News): Promise<void>;
  findById(id: string): Promise<News | null>;
  findAll(): Promise<News[]>;
  delete(id: string): Promise<boolean>;
}
