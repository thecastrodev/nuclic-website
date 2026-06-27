import { NotFoundError, ValidationError } from "../../../shared/errors/domain.error.js";
export class ProductController {
    createProductUseCase;
    listProductsUseCase;
    getProductUseCase;
    updateProductUseCase;
    consumeStockUseCase;
    restockProductUseCase;
    deleteProductUseCase;
    getStockHistoryUseCase;
    constructor(createProductUseCase, listProductsUseCase, getProductUseCase, updateProductUseCase, consumeStockUseCase, restockProductUseCase, deleteProductUseCase, getStockHistoryUseCase) {
        this.createProductUseCase = createProductUseCase;
        this.listProductsUseCase = listProductsUseCase;
        this.getProductUseCase = getProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.consumeStockUseCase = consumeStockUseCase;
        this.restockProductUseCase = restockProductUseCase;
        this.deleteProductUseCase = deleteProductUseCase;
        this.getStockHistoryUseCase = getStockHistoryUseCase;
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
        const { name, description, price, stock_total, stock_withdrawn } = req.body;
        if (price !== undefined && typeof price !== "number") {
            return res.status(400).json({ error: "Price must be a number." });
        }
        if (stock_total !== undefined && typeof stock_total !== "number") {
            return res.status(400).json({ error: "Stock total must be a number." });
        }
        if (stock_withdrawn !== undefined && typeof stock_withdrawn !== "number") {
            return res.status(400).json({ error: "Stock withdrawn must be a number." });
        }
        const result = await this.createProductUseCase.execute({
            name,
            description,
            price,
            stock_total,
            stock_withdrawn,
        });
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(201).json(result.value.toJSON());
    };
    list = async (req, res) => {
        const result = await this.listProductsUseCase.execute();
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.map((p) => p.toJSON()));
    };
    getById = async (req, res) => {
        const { id } = req.params;
        const result = await this.getProductUseCase.execute(id);
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.toJSON());
    };
    update = async (req, res) => {
        const { id } = req.params;
        const { name, description, price, stock_total, stock_withdrawn } = req.body;
        if (typeof price !== "number") {
            return res.status(400).json({ error: "Price is required and must be a number." });
        }
        if (typeof stock_total !== "number") {
            return res.status(400).json({ error: "Stock total is required and must be a number." });
        }
        if (typeof stock_withdrawn !== "number") {
            return res.status(400).json({ error: "Stock withdrawn is required and must be a number." });
        }
        const result = await this.updateProductUseCase.execute({
            id,
            name,
            description: description ?? "",
            price,
            stock_total,
            stock_withdrawn,
        });
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.toJSON());
    };
    consume = async (req, res) => {
        const { id } = req.params;
        const { quantity } = req.body;
        if (typeof quantity !== "number") {
            return res.status(400).json({ error: "Quantity is required and must be a number." });
        }
        const result = await this.consumeStockUseCase.execute({
            productId: id,
            quantity,
        });
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.toJSON());
    };
    restock = async (req, res) => {
        const { id } = req.params;
        const { quantity } = req.body;
        if (typeof quantity !== "number") {
            return res.status(400).json({ error: "Quantity is required and must be a number." });
        }
        const result = await this.restockProductUseCase.execute({
            productId: id,
            quantity,
        });
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.toJSON());
    };
    delete = async (req, res) => {
        const { id } = req.params;
        const result = await this.deleteProductUseCase.execute(id);
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(204).send();
    };
    getHistory = async (req, res) => {
        const { id } = req.params;
        const result = await this.getStockHistoryUseCase.execute(id);
        if (result.isFailure) {
            return this.handleError(res, result.error);
        }
        return res.status(200).json(result.value.map((h) => h.toJSON()));
    };
}
