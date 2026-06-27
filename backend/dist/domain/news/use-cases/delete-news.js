import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class DeleteNews {
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async execute(id) {
        const deleted = await this.newsRepository.delete(id);
        if (!deleted) {
            return Result.fail(new NotFoundError(`News with ID ${id} not found.`));
        }
        return Result.ok();
    }
}
