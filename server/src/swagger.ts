import swaggerJSDoc from "swagger-jsdoc";

/**
 * Reusable OpenAPI schemas. Centralising them here keeps the per-route
 * annotations short (they just `$ref` these) and gives Swagger UI rich,
 * populated models and example request/response bodies.
 */
const schemas = {
  LeadStatus: {
    type: "string",
    enum: ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"],
    example: "NEW",
  },
  Lead: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid", example: "b83ecc7e-bf28-43e6-8a15-d8197018a905" },
      name: { type: "string", example: "Ava Thompson" },
      company: { type: "string", nullable: true, example: "Northwind Traders" },
      email: { type: "string", nullable: true, example: "ava@northwind.com" },
      phone: { type: "string", nullable: true, example: "555-0101" },
      source: { type: "string", nullable: true, example: "Website Form" },
      status: { $ref: "#/components/schemas/LeadStatus" },
      notes: { type: "string", nullable: true, example: "Requested a demo." },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  LeadInput: {
    type: "object",
    required: ["name"],
    properties: {
      name: { type: "string", example: "Ava Thompson" },
      company: { type: "string", example: "Northwind Traders" },
      email: { type: "string", format: "email", example: "ava@northwind.com" },
      phone: { type: "string", example: "555-0101" },
      source: { type: "string", example: "Website Form" },
      status: { $ref: "#/components/schemas/LeadStatus" },
      notes: { type: "string", example: "Requested a demo." },
    },
  },
  PaginatedLeads: {
    type: "object",
    properties: {
      data: { type: "array", items: { $ref: "#/components/schemas/Lead" } },
      total: { type: "integer", example: 10 },
      page: { type: "integer", example: 1 },
      pageSize: { type: "integer", example: 5 },
      totalPages: { type: "integer", example: 2 },
    },
  },
  StatusCounts: {
    type: "object",
    properties: {
      NEW: { type: "integer", example: 3 },
      CONTACTED: { type: "integer", example: 2 },
      QUALIFIED: { type: "integer", example: 2 },
      WON: { type: "integer", example: 2 },
      LOST: { type: "integer", example: 1 },
    },
  },
  DashboardStats: {
    type: "object",
    properties: {
      total: { type: "integer", example: 10 },
      byStatus: { $ref: "#/components/schemas/StatusCounts" },
    },
  },
  ReportData: {
    type: "object",
    properties: {
      total: { type: "integer", example: 10 },
      open: { type: "integer", example: 7 },
      won: { type: "integer", example: 2 },
      lost: { type: "integer", example: 1 },
      winRate: { type: "integer", nullable: true, example: 67, description: "Won / (Won + Lost), as a percentage" },
      conversion: { type: "integer", nullable: true, example: 20, description: "Won / Total, as a percentage" },
      byStatus: { $ref: "#/components/schemas/StatusCounts" },
      bySource: {
        type: "array",
        items: {
          type: "object",
          properties: {
            source: { type: "string", example: "Website Form" },
            count: { type: "integer", example: 3 },
          },
        },
      },
    },
  },
  Settings: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      userId: { type: "string", format: "uuid" },
      theme: { type: "string", enum: ["light", "dark"], example: "light" },
      pageSize: { type: "integer", example: 5 },
      showAvatars: { type: "boolean", example: true },
      confirmBeforeDelete: { type: "boolean", example: true },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  SettingsInput: {
    type: "object",
    properties: {
      theme: { type: "string", enum: ["light", "dark"], example: "dark" },
      pageSize: { type: "integer", example: 10 },
      showAvatars: { type: "boolean", example: true },
      confirmBeforeDelete: { type: "boolean", example: true },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email", example: "admin@example.com" },
      password: { type: "string", format: "password", example: "12345" },
    },
  },
  LoginResponse: {
    type: "object",
    properties: {
      token: { type: "string", description: "JWT — pass as `Authorization: Bearer <token>`" },
      user: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          email: { type: "string", format: "email", example: "admin@example.com" },
        },
      },
    },
  },
  Error: {
    type: "object",
    properties: {
      error: { description: "Error message or validation detail" },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Lead Management API",
      version: "1.0.0",
      description:
        "REST API for managing sales leads. Authenticate via `POST /api/auth/login`, " +
        "then click **Authorize** and paste the returned token to call the protected endpoints.",
    },
    servers: [{ url: "http://localhost:4000", description: "Local (Docker) server" }],
    tags: [
      { name: "Auth", description: "Login and token issuance" },
      { name: "Leads", description: "Lead CRUD, search/filter/pagination, and aggregate stats" },
      { name: "Settings", description: "Per-user preferences persisted in the database" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
      },
      schemas,
    },
  },
  apis: ["./src/routes/*.ts"],
});
