# DDD layered Node.js + Express + TypeScript REST API

This is a production-quality backend REST API built using **Node.js, Express, and TypeScript**, adhering to **Domain-Driven Design (DDD)** and **Clean Code** principles.

## Architecture

The project follows a layered DDD architecture:

```
src/
  domain/
    product/
      entities/        # Product, StockHistory
      repositories/    # IProductRepository, IStockHistoryRepository (interfaces)
      use-cases/       # CreateProduct, ConsumeStock, RestockProduct, etc.
    news/
      entities/
      repositories/    # INewsRepository
      use-cases/       # CreateNews, ListNews, GetNews, etc.
  infrastructure/
    repositories/      # In-memory repository implementations
    http/
      middlewares/     # authMiddleware
      controllers/     # ProductController, NewsController, AuthController
      routes/          # express routers
  shared/
    errors/            # Custom Domain and Infrastructure errors
    result/            # Result<T, E> pattern helper
  main.ts              # Express App Bootstrapper
```

## Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root of the backend folder (one has already been generated for you):
```env
PORT=3000
JWT_SECRET=super_secret_admin_key_123!
```

### 3. Run in Development Mode
```bash
npm run dev
```

### 4. Build and Run Production Build
```bash
npm run build
npm start
```

## Swagger UI Documentation

Once the server is running, you can explore and test the endpoints directly from your browser using the Swagger UI interface:
*   URL: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## API Documentation & Curl Examples

Every route except authentication requires the `Authorization: Bearer <token>` header. Below are copy-pasteable `curl` examples for all endpoints.

### 1. Authentication

#### Admin Login
Authenticates and returns a JWT. Accepts hardcoded username/password `admin`.
*   **Request**:
    ```bash
    curl -X POST http://localhost:3000/auth/login \
      -H "Content-Type: application/json" \
      -d '{"username": "admin", "password": "admin"}'
    ```
*   **Expected Response (200)**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

Save this token to an environment variable in your terminal:
```bash
export JWT_TOKEN="<your_jwt_token>"
```

---

### 2. Products (`/products`)

#### Create Product
*   **Request**:
    ```bash
    curl -X POST http://localhost:3000/products \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Arduino Uno R4",
        "description": "Latest Arduino board with Renesas RA4M1 microcontroller",
        "price": 27.50,
        "stock_total": 100,
        "stock_withdrawn": 10
      }'
    ```
*   **Expected Response (201)**:
    ```json
    {
      "id": "c1f7b036-7cfa-4680-9993-9c87d46c82fa",
      "name": "Arduino Uno R4",
      "description": "Latest Arduino board with Renesas RA4M1 microcontroller",
      "price": 27.5,
      "stock_total": 100,
      "stock_withdrawn": 10,
      "stock_available": 90,
      "created_at": "2026-06-27T17:25:00.000Z",
      "updated_at": "2026-06-27T17:25:00.000Z"
    }
    ```

#### List All Products
*   **Request**:
    ```bash
    curl -X GET http://localhost:3000/products \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (200)**:
    ```json
    [
      {
        "id": "c1f7b036-7cfa-4680-9993-9c87d46c82fa",
        "name": "Arduino Uno R4",
        "description": "Latest Arduino board with Renesas RA4M1 microcontroller",
        "price": 27.5,
        "stock_total": 100,
        "stock_withdrawn": 10,
        "stock_available": 90,
        "created_at": "2026-06-27T17:25:00.000Z",
        "updated_at": "2026-06-27T17:25:00.000Z"
      }
    ]
    ```

#### Get Product by ID
*   **Request**: Replace `:id` with your created Product UUID.
    ```bash
    curl -X GET http://localhost:3000/products/:id \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (200)**: Product JSON.

#### Full Update Product
Updates all product details.
*   **Request**:
    ```bash
    curl -X PUT http://localhost:3000/products/:id \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Arduino Uno R4 Wifi",
        "description": "Arduino Uno R4 with ESP32-S3 for Wi-Fi and Bluetooth",
        "price": 38.50,
        "stock_total": 120,
        "stock_withdrawn": 15
      }'
    ```
*   **Expected Response (200)**: Updated Product JSON.

#### Consume Stock
Appends a `"consume"` record to the product's history and increments `stock_withdrawn`. Fails with `400` if `quantity > stock_available`.
*   **Request**:
    ```bash
    curl -X PATCH http://localhost:3000/products/:id/consume \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"quantity": 5}'
    ```
*   **Expected Response (200)**: Product JSON with updated `stock_withdrawn` and `stock_available`.

#### Restock Product
Appends a `"restock"` record to the product's history and increments `stock_total`.
*   **Request**:
    ```bash
    curl -X PATCH http://localhost:3000/products/:id/restock \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"quantity": 50}'
    ```
*   **Expected Response (200)**: Product JSON with updated `stock_total` and `stock_available`.

#### Get Product Stock History
*   **Request**:
    ```bash
    curl -X GET http://localhost:3000/products/:id/history \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (200)**:
    ```json
    [
      {
        "id": "e6717a6a-d2d0-4bf0-9831-294ebde04e54",
        "product_id": "c1f7b036-7cfa-4680-9993-9c87d46c82fa",
        "operation": "consume",
        "quantity": 5,
        "occurred_at": "2026-06-27T17:26:00.000Z"
      },
      {
        "id": "59cb4a52-cb40-424a-bb10-388f615967b5",
        "product_id": "c1f7b036-7cfa-4680-9993-9c87d46c82fa",
        "operation": "restock",
        "quantity": 50,
        "occurred_at": "2026-06-27T17:27:00.000Z"
      }
    ]
    ```

#### Delete Product
*   **Request**:
    ```bash
    curl -X DELETE http://localhost:3000/products/:id \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (204)**: Empty body.

---

### 3. News (`/news`)

#### Create News
*   **Request**:
    ```bash
    curl -X POST http://localhost:3000/news \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Nuclic Tech Hub Launched",
        "content": "A brand new platform to buy microcontrollers and read technology news.",
        "author": "CEO J. Doe",
        "published_at": "2026-06-27T14:20:00.000Z"
      }'
    ```
*   **Expected Response (201)**:
    ```json
    {
      "id": "a9ef784a-10f8-410e-8fb8-ee2b542013f9",
      "title": "Nuclic Tech Hub Launched",
      "content": "A brand new platform to buy microcontrollers and read technology news.",
      "author": "CEO J. Doe",
      "published_at": "2026-06-27T14:20:00.000Z",
      "created_at": "2026-06-27T17:28:00.000Z",
      "updated_at": "2026-06-27T17:28:00.000Z"
    }
    ```

#### List All News
*   **Request**:
    ```bash
    curl -X GET http://localhost:3000/news \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (200)**: Array of news JSONs.

#### Get News by ID
*   **Request**: Replace `:id` with your created News UUID.
    ```bash
    curl -X GET http://localhost:3000/news/:id \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (200)**: News JSON.

#### Full Update News
*   **Request**:
    ```bash
    curl -X PUT http://localhost:3000/news/:id \
      -H "Authorization: Bearer $JWT_TOKEN" \
      -H "Content-Type: application/json" \
      -d '{
        "title": "Nuclic Tech Hub Launched Globally",
        "content": "Our platform is now open worldwide for orders.",
        "author": "CEO J. Doe",
        "published_at": "2026-06-27T15:00:00.000Z"
      }'
    ```
*   **Expected Response (200)**: Updated News JSON.

#### Delete News
*   **Request**:
    ```bash
    curl -X DELETE http://localhost:3000/news/:id \
      -H "Authorization: Bearer $JWT_TOKEN"
    ```
*   **Expected Response (204)**: Empty body.
