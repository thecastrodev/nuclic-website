import { Result } from "../../../shared/result/result.js";
import { ValidationError } from "../../../shared/errors/domain.error.js";
import { v4 as uuidv4 } from "uuid";

export interface ProductProps {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_total: number;
  stock_withdrawn: number;
  img: string;
  created_at: Date;
  updated_at: Date;
}

export class Product {
  private props: ProductProps;

  private constructor(props: ProductProps) {
    this.props = props;
  }

  public static create(
    props: {
      id?: string;
      name: string;
      description: string;
      price: number;
      stock_total?: number;
      stock_withdrawn?: number;
      img?: string;
      created_at?: Date;
      updated_at?: Date;
    }
  ): Result<Product, ValidationError> {
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

    return Result.ok(
      new Product({
        id: props.id || uuidv4(),
        name: props.name,
        description: props.description ?? "",
        price: props.price,
        stock_total,
        stock_withdrawn,
        img: props.img ?? "",
        created_at: props.created_at || new Date(),
        updated_at: props.updated_at || new Date(),
      })
    );
  }

  public update(props: {
    name: string;
    description: string;
    price: number;
    stock_total: number;
    stock_withdrawn: number;
  }): Result<void, ValidationError> {
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

  public consumeStock(quantity: number): Result<void, ValidationError> {
    if (quantity <= 0) {
      return Result.fail(new ValidationError("Quantity to consume must be greater than zero."));
    }

    if (this.stock_available < quantity) {
      return Result.fail(
        new ValidationError(
          `Insufficient stock. Available: ${this.stock_available}, requested: ${quantity}.`
        )
      );
    }

    this.props.stock_withdrawn += quantity;
    this.props.updated_at = new Date();
    return Result.ok();
  }

  public restock(quantity: number): Result<void, ValidationError> {
    if (quantity <= 0) {
      return Result.fail(new ValidationError("Quantity to restock must be greater than zero."));
    }

    this.props.stock_total += quantity;
    this.props.updated_at = new Date();
    return Result.ok();
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  public get price(): number {
    return this.props.price;
  }

  public get stock_total(): number {
    return this.props.stock_total;
  }

  public get stock_withdrawn(): number {
    return this.props.stock_withdrawn;
  }

  public get stock_available(): number {
    return this.props.stock_total - this.props.stock_withdrawn;
  }

  public get created_at(): Date {
    return this.props.created_at;
  }

  public get updated_at(): Date {
    return this.props.updated_at;
  }

  public get img(): string {
    return this.props.img;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock_total: this.stock_total,
      stock_withdrawn: this.stock_withdrawn,
      stock_available: this.stock_available,
      img: this.img,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString(),
    };
  }
}
