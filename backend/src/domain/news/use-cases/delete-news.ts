import { INewsRepository } from "../repositories/news.repository.js";
import { Result } from "../../../shared/result/result.js";
import { DomainError, NotFoundError } from "../../../shared/errors/domain.error.js";

export class DeleteNews {
  constructor(private newsRepository: INewsRepository) {}

  public async execute(id: string): Promise<Result<void, DomainError>> {
    const deleted = await this.newsRepository.delete(id);
    if (!deleted) {
      return Result.fail(new NotFoundError(`News with ID ${id} not found.`));
    }
    return Result.ok();
  }
}
