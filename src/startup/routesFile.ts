import auth from '../routes/auth';
import blogsRouter from '../routes/blogs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../config/swagger';

export const routes = (app: express.Application) => {
  app.use(express.json());
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/auth', auth);
  app.use('/blogs', blogsRouter);
};
