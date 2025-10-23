import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

export function setupSwagger(app: import('express').Express) {
  const swaggerPath = path.join(__dirname, '../docs/swagger.yaml');
  const swaggerDocument = YAML.load(swaggerPath);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
