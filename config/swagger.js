const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dorado API',
      version: '1.0.0',
      description: 'API documentation for the Dorado project',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/dorado', // Adjust this based on your actual API base path
        description: 'Development server',
      },
    ],
  },
  apis: ['./app/api/dorado/**/*.js'], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;