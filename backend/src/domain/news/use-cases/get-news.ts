import { News } from "../entities/news.js";
import { INewsRepository } from "../repositories/news.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export class GetNews {
  constructor(private newsRepository: INewsRepository) {}

  public async execute(id: string): Promise<Result<News, DomainError>> {
    const news = await this.newsRepository.findById(id);
    if (!news) {
      return Result.fail(new NotFoundError(`News with ID ${id} not found.`));
    }
    return Result.ok(news);
  }
}
