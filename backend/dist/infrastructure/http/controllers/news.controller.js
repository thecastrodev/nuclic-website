import { NotFoundError, ValidationError } from "../../../shared/errors/domain.error.js";
export class NewsController {
    createNewsUseCase;
    listNewsUseCase;
    getNewsUseCase;
    updateNewsUseCase;
    deleteNewsUseCase;
    constructor(createNewsUseCase, listNewsUseCase, getNewsUseCase, updateNewsUseCase, deleteNewsUseCase) {
        this.createNewsUseCase = createNewsUseCase;
        this.listNewsUseCase = listNewsUseCase;
        this.getNewsUseCase = getNewsUseCase;
        this.updateNewsUseCase = updateNewsUseCase;
        this.deleteNewsUseCase = deleteNewsUseCase;
    }
    handleError(res, error) {
        if (error instanceof NotFoundError) {
            return res.status(404).json({ error: error.message });
        }
        if (error instanceof ValidationError) {
            return res.status(400).json({ error: error.message });
        }
        const message = error instanceof Error ? error.message : "Internal Server Error";
        return res.status(500).json({ error: message });
    }
    create = async (req, res) => {
        const { title, content, author, published_at } = req.body;
        let publishedAtDate;
        if (published_at) {
            publishedAtDate = new Date(published_at);
            if (isNaN(publishedAtDate.getTime())) {
                return res.status(400).json({ error: "Invalid published_at date format." });
            }
        }
        const result = await this.createNewsUseCase.execute({
            title,
            content,
            author,
            published_at: publishedAtDate,
        });
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(201).json(result.value.toJSON());
    };
    list = async (req, res) => {
        const result = await this.listNewsUseCase.execute();
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.map((n) => n.toJSON()));
    };
    getById = async (req, res) => {
        const { id } = req.params;
        const result = await this.getNewsUseCase.execute(id);
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.toJSON());
    };
    update = async (req, res) => {
        const { id } = req.params;
        const { title, content, author, published_at } = req.body;
        let publishedAtDate;
        if (published_at) {
            publishedAtDate = new Date(published_at);
            if (isNaN(publishedAtDate.getTime())) {
                return res.status(400).json({ error: "Invalid published_at date format." });
            }
        }
        const result = await this.updateNewsUseCase.execute({
            id,
            title,
            content,
            author,
            published_at: publishedAtDate,
        });
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.toJSON());
    };
    delete = async (req, res) => {
        const { id } = req.params;
        const result = await this.deleteNewsUseCase.execute(id);
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(204).send();
    };
}
