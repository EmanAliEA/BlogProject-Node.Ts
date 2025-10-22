import _ from 'lodash';
import type { Request, Response, NextFunction } from 'express';
import { blogValidate, userValidate } from '../helpers/validationHelpers';

function validateBlog(req: Request, res: Response, next: NextFunction) {
  if (Object.keys(req.body).length === 0)
    return res.status(400).send('No data provided');
  const { error } = blogValidate({
    ..._.pick(req.body, ['title', 'content', 'category']),
    user_id: (req as any).user,
  });
  console.log('Blog Validation Result:', { error });
  if (error) return res.status(400).send(error.details[0]?.message);
  return next();
}
function validateUser(req: Request, res: Response, next: NextFunction) {
  // prefer req.path, fallback to req.originalUrl
  const path = (req.path || req.originalUrl).toLowerCase();
  console.log('Request path:', path);
  const isLogin = path.match(/\/login$/) !== null;
  // Debug
  // req.user is not set on login, use req.body
  console.log('req.body:', req.body);
  const { error } = userValidate(req.body, isLogin);
  if (error) return res.status(400).send(error.details[0]?.message);
  return next();
}

export { validateBlog, validateUser };
