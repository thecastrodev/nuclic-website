import { Result } from "../../../shared/result/result.js";
import { ValidationError } from "../../../shared/errors/domain.error.js";
import { v4 as uuidv4 } from "uuid";
export class Product {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (!props.name || props.name.trim() === "") {
            return Result.fail(new ValidationError("Product name is required."));
        }
        if (props.price === undefined || props.price < 0) {
            return Result.fail(new ValidationError("Product price cannot be negative."));
        }
        const stock_total = props.stock_total ?? 0;
        const stock_withdrawn = props.stock_withdrawn ?? 0;
        if (stock_total < 0) {
            return Result.fail(new ValidationError("Total stock cannot be negative."));
        }
        if (stock_withdrawn < 0) {
            return Result.fail(new ValidationError("Withdrawn stock cannot be negative."));
        }
        if (stock_total - stock_withdrawn < 0) {
            return Result.fail(new ValidationError("Available stock cannot be negative."));
        }
        return Result.ok(new Product({
            id: props.id || uuidv4(),
            name: props.name,
            description: props.description ?? "",
            price: props.price,
            stock_total,
            stock_withdrawn,
            created_at: props.created_at || new Date(),
            updated_at: props.updated_at || new Date(),
        }));
    }
    update(props) {
        if (!props.name || props.name.trim() === "") {
            return Result.fail(new ValidationError("Product name is required."));
        }
        if (props.price === undefined || props.price < 0) {
            return Result.fail(new ValidationError("Product price cannot be negative."));
        }
        if (props.stock_total < 0) {
            return Result.fail(new ValidationError("Total stock cannot be negative."));
        }
        if (props.stock_withdrawn < 0) {
            return Result.fail(new ValidationError("Withdrawn stock cannot be negative."));
        }
        if (props.stock_total - props.stock_withdrawn < 0) {
            return Result.fail(new ValidationError("Available stock cannot be negative."));
        }
        this.props.name = props.name;
        this.props.description = props.description;
        this.props.price = props.price;
        this.props.stock_total = props.stock_total;
        this.props.stock_withdrawn = props.stock_withdrawn;
        this.props.updated_at = new Date();
        return Result.ok();
    }
    consumeStock(quantity) {
        if (quantity <= 0) {
            return Result.fail(new ValidationError("Quantity to consume must be greater than zero."));
        }
        if (this.stock_available < quantity) {
            return Result.fail(new ValidationError(`Insufficient stock. Available: ${this.stock_available}, requested: ${quantity}.`));
        }
        this.props.stock_withdrawn += quantity;
        this.props.updated_at = new Date();
        return Result.ok();
    }
    restock(quantity) {
        if (quantity <= 0) {
            return Result.fail(new ValidationError("Quantity to restock must be greater than zero."));
        }
        this.props.stock_total += quantity;
        this.props.updated_at = new Date();
        return Result.ok();
    }
    get id() {
        return this.props.id;
    }
    get name() {
        return this.props.name;
    }
    get description() {
        return this.props.description;
    }
    get price() {
        return this.props.price;
    }
    get stock_total() {
        return this.props.stock_total;
    }
    get stock_withdrawn() {
        return this.props.stock_withdrawn;
    }
    get stock_available() {
        return this.props.stock_total - this.props.stock_withdrawn;
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
            name: this.name,
            description: this.description,
            price: this.price,
            stock_total: this.stock_total,
            stock_withdrawn: this.stock_withdrawn,
            stock_available: this.stock_available,
            created_at: this.created_at.toISOString(),
            updated_at: this.updated_at.toISOString(),
        };
    }
}
