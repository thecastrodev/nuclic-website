import { Result } from "../../../shared/result/result.js";
export class ListNews {
    newsRepository;
    constructor(newsRepository) {
        this.newsRepository = newsRepository;
    }
    async execute() {
        const newsList = await this.newsRepository.findAll();
        return Result.ok(newsList);
    }
}
