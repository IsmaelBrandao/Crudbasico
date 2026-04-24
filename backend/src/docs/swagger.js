const swaggerJsdoc = require("swagger-jsdoc");

const port = process.env.PORT || 3001;
const baseUrl = process.env.API_BASE_URL || `http://localhost:${port}`;

const swaggerSpec = swaggerJsdoc({
  apis: [],
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Next Comercial API",
      version: "1.0.0",
      description:
        "Documentacao da API responsavel pelos cadastros de usuarios, produtos e pedidos.",
    },
    servers: [
      {
        description: "Servidor atual",
        url: baseUrl,
      },
    ],
    tags: [
      { name: "Saude", description: "Rotas de status da aplicacao" },
      { name: "Usuarios", description: "CRUD de usuarios" },
      { name: "Produtos", description: "CRUD de produtos" },
      { name: "Pedidos", description: "CRUD de pedidos" },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: "object",
          properties: {
            status: {
              example: "ok",
              type: "string",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            mensagem: {
              example: "Registro nao encontrado",
              type: "string",
            },
            erros: {
              items: {
                type: "string",
              },
              type: "array",
            },
          },
        },
        UsuarioInput: {
          required: ["nome", "email", "senha"],
          type: "object",
          properties: {
            nome: {
              example: "Ismael Brandao",
              type: "string",
            },
            email: {
              example: "ismael@example.com",
              format: "email",
              type: "string",
            },
            senha: {
              example: "123456",
              minLength: 6,
              type: "string",
            },
          },
        },
        UsuarioUpdateInput: {
          type: "object",
          properties: {
            nome: {
              example: "Ismael Brandao",
              type: "string",
            },
            email: {
              example: "ismael@example.com",
              format: "email",
              type: "string",
            },
            senha: {
              example: "654321",
              minLength: 6,
              type: "string",
            },
          },
        },
        UsuarioResponse: {
          type: "object",
          properties: {
            id: {
              example: 1,
              type: "integer",
            },
            nome: {
              example: "Ismael Brandao",
              type: "string",
            },
            email: {
              example: "ismael@example.com",
              type: "string",
            },
            createdAt: {
              example: "2026-04-24T20:45:00.000Z",
              format: "date-time",
              type: "string",
            },
            updatedAt: {
              example: "2026-04-24T20:45:00.000Z",
              format: "date-time",
              type: "string",
            },
          },
        },
        ProdutoInput: {
          required: ["nome", "preco", "estoque"],
          type: "object",
          properties: {
            nome: {
              example: "Monitor ultrawide",
              type: "string",
            },
            preco: {
              example: 1499,
              type: "number",
            },
            estoque: {
              example: 4,
              type: "integer",
            },
          },
        },
        ProdutoUpdateInput: {
          type: "object",
          properties: {
            nome: {
              example: "Monitor ultrawide",
              type: "string",
            },
            preco: {
              example: 1499,
              type: "number",
            },
            estoque: {
              example: 4,
              type: "integer",
            },
          },
        },
        ProdutoResponse: {
          type: "object",
          properties: {
            id: {
              example: 1,
              type: "integer",
            },
            nome: {
              example: "Monitor ultrawide",
              type: "string",
            },
            preco: {
              example: 1499,
              type: "number",
            },
            estoque: {
              example: 4,
              type: "integer",
            },
            createdAt: {
              example: "2026-04-24T20:45:00.000Z",
              format: "date-time",
              type: "string",
            },
            updatedAt: {
              example: "2026-04-24T20:45:00.000Z",
              format: "date-time",
              type: "string",
            },
          },
        },
        PedidoInput: {
          required: ["usuario_id", "produto_id", "quantidade"],
          type: "object",
          properties: {
            usuario_id: {
              example: 1,
              type: "integer",
            },
            produto_id: {
              example: 1,
              type: "integer",
            },
            quantidade: {
              example: 2,
              minimum: 1,
              type: "integer",
            },
          },
        },
        PedidoUpdateInput: {
          type: "object",
          properties: {
            usuario_id: {
              example: 1,
              type: "integer",
            },
            produto_id: {
              example: 1,
              type: "integer",
            },
            quantidade: {
              example: 2,
              minimum: 1,
              type: "integer",
            },
          },
        },
        PedidoResponse: {
          type: "object",
          properties: {
            id: {
              example: 1,
              type: "integer",
            },
            usuario_id: {
              example: 1,
              type: "integer",
            },
            produto_id: {
              example: 1,
              type: "integer",
            },
            quantidade: {
              example: 2,
              type: "integer",
            },
            createdAt: {
              example: "2026-04-24T20:45:00.000Z",
              format: "date-time",
              type: "string",
            },
            updatedAt: {
              example: "2026-04-24T20:45:00.000Z",
              format: "date-time",
              type: "string",
            },
            usuario: {
              $ref: "#/components/schemas/UsuarioResponse",
            },
            produto: {
              $ref: "#/components/schemas/ProdutoResponse",
            },
          },
        },
      },
    },
    paths: {
      "/health": {
        get: {
          summary: "Retorna o status da API",
          tags: ["Saude"],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/HealthResponse",
                  },
                },
              },
              description: "API online",
            },
          },
        },
      },
      "/usuarios": {
        get: {
          summary: "Lista todos os usuarios",
          tags: ["Usuarios"],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      $ref: "#/components/schemas/UsuarioResponse",
                    },
                    type: "array",
                  },
                },
              },
              description: "Lista de usuarios",
            },
          },
        },
        post: {
          summary: "Cria um usuario",
          tags: ["Usuarios"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsuarioInput",
                },
              },
            },
            required: true,
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UsuarioResponse",
                  },
                },
              },
              description: "Usuario criado com sucesso",
            },
            400: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Dados invalidos",
            },
            409: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Email ja cadastrado",
            },
          },
        },
      },
      "/usuarios/{id}": {
        get: {
          summary: "Busca um usuario por ID",
          tags: ["Usuarios"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UsuarioResponse",
                  },
                },
              },
              description: "Usuario encontrado",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Usuario nao encontrado",
            },
          },
        },
        put: {
          summary: "Atualiza um usuario por ID",
          tags: ["Usuarios"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/UsuarioUpdateInput",
                },
              },
            },
            required: true,
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/UsuarioResponse",
                  },
                },
              },
              description: "Usuario atualizado",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Usuario nao encontrado",
            },
          },
        },
        delete: {
          summary: "Remove um usuario por ID",
          tags: ["Usuarios"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: {
              description: "Usuario removido",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Usuario nao encontrado",
            },
          },
        },
      },
      "/produtos": {
        get: {
          summary: "Lista todos os produtos",
          tags: ["Produtos"],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      $ref: "#/components/schemas/ProdutoResponse",
                    },
                    type: "array",
                  },
                },
              },
              description: "Lista de produtos",
            },
          },
        },
        post: {
          summary: "Cria um produto",
          tags: ["Produtos"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProdutoInput",
                },
              },
            },
            required: true,
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProdutoResponse",
                  },
                },
              },
              description: "Produto criado com sucesso",
            },
            400: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Dados invalidos",
            },
          },
        },
      },
      "/produtos/{id}": {
        get: {
          summary: "Busca um produto por ID",
          tags: ["Produtos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProdutoResponse",
                  },
                },
              },
              description: "Produto encontrado",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Produto nao encontrado",
            },
          },
        },
        put: {
          summary: "Atualiza um produto por ID",
          tags: ["Produtos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/ProdutoUpdateInput",
                },
              },
            },
            required: true,
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ProdutoResponse",
                  },
                },
              },
              description: "Produto atualizado",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Produto nao encontrado",
            },
          },
        },
        delete: {
          summary: "Remove um produto por ID",
          tags: ["Produtos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: {
              description: "Produto removido",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Produto nao encontrado",
            },
          },
        },
      },
      "/pedidos": {
        get: {
          summary: "Lista todos os pedidos",
          tags: ["Pedidos"],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    items: {
                      $ref: "#/components/schemas/PedidoResponse",
                    },
                    type: "array",
                  },
                },
              },
              description: "Lista de pedidos",
            },
          },
        },
        post: {
          summary: "Cria um pedido",
          tags: ["Pedidos"],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PedidoInput",
                },
              },
            },
            required: true,
          },
          responses: {
            201: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PedidoResponse",
                  },
                },
              },
              description: "Pedido criado com sucesso",
            },
            400: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Dados invalidos ou estoque insuficiente",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Usuario ou produto nao encontrado",
            },
          },
        },
      },
      "/pedidos/{id}": {
        get: {
          summary: "Busca um pedido por ID",
          tags: ["Pedidos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PedidoResponse",
                  },
                },
              },
              description: "Pedido encontrado",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Pedido nao encontrado",
            },
          },
        },
        put: {
          summary: "Atualiza um pedido por ID",
          tags: ["Pedidos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          requestBody: {
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PedidoUpdateInput",
                },
              },
            },
            required: true,
          },
          responses: {
            200: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/PedidoResponse",
                  },
                },
              },
              description: "Pedido atualizado",
            },
            400: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Dados invalidos ou estoque insuficiente",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Pedido, usuario ou produto nao encontrado",
            },
          },
        },
        delete: {
          summary: "Remove um pedido por ID",
          tags: ["Pedidos"],
          parameters: [
            {
              in: "path",
              name: "id",
              required: true,
              schema: { type: "integer" },
            },
          ],
          responses: {
            204: {
              description: "Pedido removido",
            },
            404: {
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/ErrorResponse",
                  },
                },
              },
              description: "Pedido nao encontrado",
            },
          },
        },
      },
    },
  },
});

module.exports = swaggerSpec;
