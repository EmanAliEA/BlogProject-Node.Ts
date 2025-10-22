import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'My API Documentation',
      version: '1.0.0',
      description:
        'API documentation for my Express.js application with MongoDB',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Adjust port if needed
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // Path to your API routes and models
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
