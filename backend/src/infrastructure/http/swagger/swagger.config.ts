export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Nuclic API",
    version: "1.0.0",
    description: "Production-ready DDD Node.js + Express + TypeScript REST API documentation.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stock_total: { type: "number" },
          stock_withdrawn: { type: "number" },
          stock_available: { type: "number" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      StockHistory: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          product_id: { type: "string", format: "uuid" },
          operation: { type: "string", enum: ["consume", "restock"] },
          quantity: { type: "number" },
          occurred_at: { type: "string", format: "date-time" },
        },
      },
      News: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          content: { type: "string" },
          author: { type: "string" },
          published_at: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
    },
  },
  paths: {
    "/auth/login": {
      post: {
        summary: "Admin login",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "admin" },
                  password: { type: "string", example: "admin" },
                },
                required: ["username", "password"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Successful login",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Missing username or password" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/products": {
      get: {
        summary: "List all products",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of products",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
      post: {
        summary: "Create product",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock_total: { type: "number" },
                  stock_withdrawn: { type: "number" },
                },
                required: ["name", "price"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "Product created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/products/{id}": {
      get: {
        summary: "Get product by ID",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Product details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },
      put: {
        summary: "Full update product details",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number" },
                  stock_total: { type: "number" },
                  stock_withdrawn: { type: "number" },
                },
                required: ["name", "price", "stock_total", "stock_withdrawn"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },
      delete: {
        summary: "Delete product",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          204: { description: "Product deleted successfully" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },
    },
    "/products/{id}/consume": {
      patch: {
        summary: "Consume stock of a product",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  quantity: { type: "number" },
                },
                required: ["quantity"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Stock consumed successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Validation error / Insufficient stock" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },
    },
    "/products/{id}/restock": {
      patch: {
        summary: "Restock a product",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  quantity: { type: "number" },
                },
                required: ["quantity"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Product restocked successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },
    },
    "/products/{id}/history": {
      get: {
        summary: "List stock transactional history for product",
        tags: ["Products"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Stock history entries list",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/StockHistory" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "Product not found" },
        },
      },
    },
    "/news": {
      get: {
        summary: "List all news articles",
        tags: ["News"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: "List of news articles",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/News" },
                },
              },
            },
          },
          401: { description: "Unauthorized" },
        },
      },
      post: {
        summary: "Create news article",
        tags: ["News"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  author: { type: "string" },
                  published_at: { type: "string", format: "date-time" },
                },
                required: ["title", "content", "author"],
              },
            },
          },
        },
        responses: {
          201: {
            description: "News article created successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/News" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
        },
      },
    },
    "/news/{id}": {
      get: {
        summary: "Get news article by ID",
        tags: ["News"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "News article details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/News" },
              },
            },
          },
          401: { description: "Unauthorized" },
          404: { description: "News article not found" },
        },
      },
      put: {
        summary: "Update news article",
        tags: ["News"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  author: { type: "string" },
                  published_at: { type: "string", format: "date-time" },
                },
                required: ["title", "content", "author"],
              },
            },
          },
        },
        responses: {
          200: {
            description: "News article updated successfully",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/News" },
              },
            },
          },
          400: { description: "Validation error" },
          401: { description: "Unauthorized" },
          404: { description: "News article not found" },
        },
      },
      delete: {
        summary: "Delete news article",
        tags: ["News"],
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          204: { description: "News article deleted successfully" },
          401: { description: "Unauthorized" },
          404: { description: "News article not found" },
        },
      },
    },
  },
};
