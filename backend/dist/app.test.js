import { test, describe } from "node:test";
import assert from "node:assert";
import request from "supertest";
import { createApp } from "./app.js";
describe("API Integration Tests", () => {
    const app = createApp();
    let token;
    let productId;
    let newsId;
    test("POST /auth/login - should authenticate admin and return a JWT", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ username: "admin", password: "admin" })
            .expect(200);
        assert.ok(res.body.token);
        token = res.body.token;
    });
    test("POST /auth/login - should fail with 401 on invalid credentials", async () => {
        await request(app)
            .post("/auth/login")
            .send({ username: "admin", password: "wrong_password" })
            .expect(401);
    });
    test("GET /products - should fail with 401 if unauthorized", async () => {
        await request(app)
            .get("/products")
            .expect(401);
    });
    test("POST /products - should create a new product", async () => {
        const res = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send({
            name: "Test Board",
            description: "A developer board",
            price: 15.00,
            stock_total: 10,
            stock_withdrawn: 2
        })
            .expect(201);
        assert.ok(res.body.id);
        assert.strictEqual(res.body.name, "Test Board");
        assert.strictEqual(res.body.stock_available, 8);
        productId = res.body.id;
    });
    test("PATCH /products/:id/consume - should consume stock and log to history", async () => {
        const res = await request(app)
            .patch(`/products/${productId}/consume`)
            .set("Authorization", `Bearer ${token}`)
            .send({ quantity: 3 })
            .expect(200);
        assert.strictEqual(res.body.stock_withdrawn, 5);
        assert.strictEqual(res.body.stock_available, 5);
    });
    test("PATCH /products/:id/consume - should reject if quantity is greater than stock_available", async () => {
        const res = await request(app)
            .patch(`/products/${productId}/consume`)
            .set("Authorization", `Bearer ${token}`)
            .send({ quantity: 10 })
            .expect(400);
        assert.match(res.body.error, /Insufficient stock/);
    });
    test("PATCH /products/:id/restock - should restock product and log to history", async () => {
        const res = await request(app)
            .patch(`/products/${productId}/restock`)
            .set("Authorization", `Bearer ${token}`)
            .send({ quantity: 20 })
            .expect(200);
        assert.strictEqual(res.body.stock_total, 30);
        assert.strictEqual(res.body.stock_available, 25);
    });
    test("GET /products/:id/history - should list full StockHistory for product", async () => {
        const res = await request(app)
            .get(`/products/${productId}/history`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        assert.ok(Array.isArray(res.body));
        assert.strictEqual(res.body.length, 2);
        assert.strictEqual(res.body[0].operation, "consume");
        assert.strictEqual(res.body[1].operation, "restock");
    });
    test("POST /news - should create a news post", async () => {
        const res = await request(app)
            .post("/news")
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "Platform launched!",
            content: "We are officially live.",
            author: "Admin Editor"
        })
            .expect(201);
        assert.ok(res.body.id);
        assert.strictEqual(res.body.title, "Platform launched!");
        newsId = res.body.id;
    });
    test("GET /news/:id - should retrieve news by ID", async () => {
        const res = await request(app)
            .get(`/news/${newsId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200);
        assert.strictEqual(res.body.title, "Platform launched!");
    });
    test("PUT /news/:id - should update news", async () => {
        const res = await request(app)
            .put(`/news/${newsId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "Platform launched globally!",
            content: "We are officially live everywhere.",
            author: "Admin Editor"
        })
            .expect(200);
        assert.strictEqual(res.body.title, "Platform launched globally!");
    });
    test("DELETE /news/:id - should delete news post", async () => {
        await request(app)
            .delete(`/news/${newsId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        await request(app)
            .get(`/news/${newsId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });
    test("DELETE /products/:id - should delete product", async () => {
        await request(app)
            .delete(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(204);
        await request(app)
            .get(`/products/${productId}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404);
    });
    test("GET /api-docs/ - should return Swagger UI HTML page", async () => {
        await request(app)
            .get("/api-docs/")
            .expect(200)
            .expect("Content-Type", /html/);
    });
});
