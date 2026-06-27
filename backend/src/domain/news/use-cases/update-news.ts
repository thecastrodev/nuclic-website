import { News } from "../entities/news.js";
import { INewsRepository } from "../repositories/news.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export interface UpdateNewsInput {
  id: string;
  title: string;
  content: string;
  author: string;
  published_at?: Date;
}

export class UpdateNews {
  constructor(private newsRepository: INewsRepository) {}

  public async execute(input: UpdateNewsInput): Promise<Result<News, DomainError>> {
    const news = await this.newsRepository.findById(input.id);
    if (!news) {
      return Result.fail(new NotFoundError(`News with ID ${input.id} not found.`));
    }

    const updateResult = news.update({
      title: input.title,
      content: input.content,
      author: input.author,
      published_at: input.published_at,
    });

    if (updateResult.isFailure) {
      return Result.fail(updateResult.error);
    }

    await this.newsRepository.save(news);
    return Result.ok(news);
  }
}
