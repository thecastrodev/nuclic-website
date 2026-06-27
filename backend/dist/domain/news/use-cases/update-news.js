import { Result } from "../../../shared/result/result.js";
import { NotFoundError } from "../../../shared/errors/domain.error.js";
export class UpdateNews {
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async execute(input) {
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
