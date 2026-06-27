import { Result } from "../../../shared/result/result.js";
import { ValidationError } from "../../../shared/errors/domain.error.js";
import { v4 as uuidv4 } from "uuid";
export class StockHistory {
    props;
    constructor(props) {
        this.props = props;
    }
    static create(props) {
        if (!props.product_id || props.product_id.trim() === "") {
            return Result.fail(new ValidationError("Product ID is required."));
        }
        if (props.operation !== "consume" && props.operation !== "restock") {
            return Result.fail(new ValidationError("Operation must be either 'consume' or 'restock'."));
        }
        if (props.quantity === undefined || props.quantity <= 0) {
            return Result.fail(new ValidationError("Quantity must be greater than zero."));
        }
        return Result.ok(new StockHistory({
            id: props.id || uuidv4(),
            product_id: props.product_id,
            operation: props.operation,
            quantity: props.quantity,
            occurred_at: props.occurred_at || new Date(),
        }));
    }
    get id() {
        return this.props.id;
    }
    get product_id() {
        return this.props.product_id;
    }
    get operation() {
        return this.props.operation;
    }
    get quantity() {
        return this.props.quantity;
    }
    get occurred_at() {
        return this.props.occurred_at;
    }
    toJSON() {
        return {
            id: this.id,
            product_id: this.product_id,
            operation: this.operation,
            quantity: this.quantity,
            occurred_at: this.occurred_at.toISOString(),
        };
    }
}
