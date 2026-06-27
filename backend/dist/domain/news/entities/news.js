import { Result } from "../../../shared/result/result.js";
import { ValidationError } from "../../../shared/errors/domain.error.js";
import { v4 as uuidv4 } from "uuid";
export class News {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (!props.title || props.title.trim() === "") {
            return Result.fail(new ValidationError("News title is required."));
        }
        if (!props.content || props.content.trim() === "") {
            return Result.fail(new ValidationError("News content is required."));
        }
        if (!props.author || props.author.trim() === "") {
            return Result.fail(new ValidationError("News author is required."));
        }
        return Result.ok(new News({
            id: props.id || uuidv4(),
            title: props.title,
            content: props.content,
            author: props.author,
            published_at: props.published_at || new Date(),
            created_at: props.created_at || new Date(),
            updated_at: props.updated_at || new Date(),
        }));
    }
    update(props) {
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
    get id() {
        return this.props.id;
    }
    get title() {
        return this.props.title;
    }
    get content() {
        return this.props.content;
    }
    get author() {
        return this.props.author;
    }
    get published_at() {
        return this.props.published_at;
    }
    get created_at() {
        return this.props.created_at;
    }
    get updated_at() {
        return this.props.updated_at;
    }
    toJSON() {
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
