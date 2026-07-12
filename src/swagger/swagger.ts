import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Telemedicine API",
      version: "1.0.0",
      description: "Production-grade Telemedicine Backend",
    },

    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
