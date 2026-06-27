import { News } from "../entities/news.js";
import { Result } from "../../../shared/result/result.js";
export class CreateNews {
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async execute(input) {
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
