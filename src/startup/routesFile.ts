import auth from '../routes/auth';
import blogsRouter from '../routes/blogs';
import express from 'express';

export const routes = (app: express.Application) => {
  app.use(express.json());
  app.use('/auth', auth);
  app.use('/blogs', blogsRouter);
};
