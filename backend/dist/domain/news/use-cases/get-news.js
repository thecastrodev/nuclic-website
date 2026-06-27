import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class GetNews {
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async execute(id) {
        const news = await this.newsRepository.findById(id);
        if (!news) {
            return Result.fail(new NotFoundError(`News with ID ${id} not found.`));
        }
        return Result.ok(news);
    }
}
