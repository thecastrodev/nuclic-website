import { Result } from "../../../shared/result/result.js";
import { ValidationError } from "../../../shared/errors/domain.error.js";
import { v4 as uuidv4 } from "uuid";

export interface NewsProps {
  id: string;
  title: string;
  content: string;
  author: string;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
}

export class News {
  private props: NewsProps;

  private constructor(props: NewsProps) {
    this.props = props;
  }

  public static create(
    props: {
      id?: string;
      title: string;
      content: string;
      author: string;
      published_at?: Date;
      created_at?: Date;
      updated_at?: Date;
    }
  ): Result<News, ValidationError> {
    if (!props.title || props.title.trim() === "") {
      return Result.fail(new ValidationError("News title is required."));
    }

    if (!props.content || props.content.trim() === "") {
      return Result.fail(new ValidationError("News content is required."));
    }

    if (!props.author || props.author.trim() === "") {
      return Result.fail(new ValidationError("News author is required."));
    }

    return Result.ok(
      new News({
        id: props.id || uuidv4(),
        title: props.title,
        content: props.content,
        author: props.author,
        published_at: props.published_at || new Date(),
        created_at: props.created_at || new Date(),
        updated_at: props.updated_at || new Date(),
      })
    );
  }

  public update(props: {
    title: string;
    content: string;
    author: string;
    published_at?: Date;
  }): Result<void, ValidationError> {
    if (!props.title || props.title.trim() === "") {
      return Result.fail(new ValidationError("News title is required."));
    }

    if (!props.content || props.content.trim() === "") {
      return Result.fail(new ValidationError("News content is required."));
    }

    if (!props.author || props.author.trim() === "") {
      return Result.fail(new ValidationError("News author is required."));
    }

    this.props.title = props.title;
    this.props.content = props.content;
    this.props.author = props.author;
    if (props.published_at) {
      this.props.published_at = props.published_at;
    }
    this.props.updated_at = new Date();

    return Result.ok();
  }

  public get id(): string {
    return this.props.id;
  }

  public get title(): string {
    return this.props.title;
  }

  public get content(): string {
    return this.props.content;
  }

  public get author(): string {
    return this.props.author;
  }

  public get published_at(): Date {
    return this.props.published_at;
  }

  public get created_at(): Date {
    return this.props.created_at;
  }

  public get updated_at(): Date {
    return this.props.updated_at;
  }

  public toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      published_at: this.published_at.toISOString(),
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
