import { Request, Response } from "express";
import { CreateNews } from "../../../domain/news/use-cases/create-news.js";
import { ListNews } from "../../../domain/news/use-cases/list-news.js";
import { GetNews } from "../../../domain/news/use-cases/get-news.js";
import { UpdateNews } from "../../../domain/news/use-cases/update-news.js";
import { DeleteNews } from "../../../domain/news/use-cases/delete-news.js";
import { NotFoundError, ValidationError } from "../../../shared/errors/domain.error.js";

export class NewsController {
  constructor(
    private createNewsUseCase: CreateNews,
    private listNewsUseCase: ListNews,
    private getNewsUseCase: GetNews,
    private updateNewsUseCase: UpdateNews,
    private deleteNewsUseCase: DeleteNews
  ) {}

  private handleError(res: Response, error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return res.status(500).json({ error: message });
  }

  public create = async (req: Request, res: Response) => {
    const { title, content, author, published_at } = req.body;

    let publishedAtDate: Date | undefined;
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

  public list = async (req: Request, res: Response) => {
    const result = await this.listNewsUseCase.execute();
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(200).json(result.value.map((n) => n.toJSON()));
  };

  public getById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.getNewsUseCase.execute(id);
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(200).json(result.value.toJSON());
  };

  public update = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, author, published_at } = req.body;

    let publishedAtDate: Date | undefined;
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

  public delete = async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await this.deleteNewsUseCase.execute(id);
    if (result.isFailure) {
      return this.handleError(res, result.error);
    }
    return res.status(204).send();
  };
}
