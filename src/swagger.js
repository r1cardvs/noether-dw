// swagger.js
const swaggerDocument = {
    openapi: "3.0.0",
    info: {
      title: "Noether DW API",
      version: "1.0.0",
      description: "Documentação da API da aplicação Node.js no AWS ECS",
    },
    servers: [
      {
        url: "http://3.14.72.20:3000",
        description: "Servidor AWS ECS (Fargate)",
      },
      {
        url: "http://localhost:3000",
        description: "Servidor Local",
      },
    ],
    paths: {
      "/info": {
        get: {
          summary: "Retorna informações da aplicação",
          description: "Endpoint GET para verificar o status e dados básicos do sistema.",
          responses: {
            200: {
              description: "Sucesso ao retornar as informações.",
            },
          },
        },
      },
      "/health": {
        get: {
          summary: "Verifica a saúde da aplicação",
          description: "Endpoint de health check.",
          responses: {
            200: {
              description: "Aplicação saudável.",
            },
          },
        },
      },
    },
  };
  
  module.exports = { swaggerDocument };