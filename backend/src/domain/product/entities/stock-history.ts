import { Result } from "../../../shared/result/result.js";
import { ValidationError } from "../../../shared/errors/domain.error.js";
import { v4 as uuidv4 } from "uuid";

export type StockOperation = "consume" | "restock";

export interface StockHistoryProps {
  id: string;
  product_id: string;
  operation: StockOperation;
  quantity: number;
  occurred_at: Date;
}

export class StockHistory {
  private props: StockHistoryProps;

  private constructor(props: StockHistoryProps) {
    this.props = props;
  }

  public static create(
    props: {
      id?: string;
      product_id: string;
      operation: StockOperation;
      quantity: number;
      occurred_at?: Date;
    }
  ): Result<StockHistory, ValidationError> {
    if (!props.product_id || props.product_id.trim() === "") {
      return Result.fail(new ValidationError("Product ID is required."));
    }

    if (props.operation !== "consume" && props.operation !== "restock") {
      return Result.fail(
        new ValidationError("Operation must be either 'consume' or 'restock'.")
      );
    }

    if (props.quantity === undefined || props.quantity <= 0) {
      return Result.fail(new ValidationError("Quantity must be greater than zero."));
    }

    return Result.ok(
      new StockHistory({
        id: props.id || uuidv4(),
        product_id: props.product_id,
        operation: props.operation,
        quantity: props.quantity,
        occurred_at: props.occurred_at || new Date(),
      })
    );
  }

  public get id(): string {
    return this.props.id;
  }

  public get product_id(): string {
    return this.props.product_id;
  }

  public get operation(): StockOperation {
    return this.props.operation;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public get occurred_at(): Date {
    return this.props.occurred_at;
  }

  public toJSON() {
    return {
      id: this.id,
      product_id: this.product_id,
      operation: this.operation,
      quantity: this.quantity,
      occurred_at: this.occurred_at.toISOString(),
    };
  }
}
