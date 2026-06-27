import { News } from "../entities/news.js";
import { INewsRepository } from "../repositories/news.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError } from "../../../shared/errors/domain.error.js";

export interface CreateNewsInput {
  title: string;
  content: string;
  author: string;
  published_at?: Date;
}

export class CreateNews {
  constructor(private newsRepository: INewsRepository) {}

  public async execute(input: CreateNewsInput): Promise<Result<News, DomainError>> {
    const newsResult = News.create({
      title: input.title,
      content: input.content,
      author: input.author,
      published_at: input.published_at,
    });

    if (newsResult.isFailure) {
      return Result.fail(newsResult.error);
    }

    const news = newsResult.value;
    await this.newsRepository.save(news);
    return Result.ok(news);
  }
}
