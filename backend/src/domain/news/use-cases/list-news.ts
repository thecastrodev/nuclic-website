import { News } from "../entities/news.js";
import { INewsRepository } from "../repositories/news.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError } from "../../../shared/errors/domain.error.js";

export class ListNews {
  constructor(private newsRepository: INewsRepository) {}

  public async execute(): Promise<Result<News[], DomainError>> {
    const newsList = await this.newsRepository.findAll();
    return Result.ok(newsList);
  }
}
