import Joi from 'joi';
import _ from 'lodash';
import { BlogInt } from '../models/blog';
import type { Request, Response, NextFunction } from 'express';
import { UserInt } from '../models/user';

function validateBlog(req: Request, res: Response, next: NextFunction) {
  if (Object.keys(req.body).length === 0)
    return res.status(400).send('No data provided to update');
  const { error } = blogValidate({
    ..._.pick(req.body, ['title', 'content', 'category']),
    user_id: (req as any).user,
  });
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

const blogValidate = function (blog: BlogInt) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    category: Joi.string().required(),
    user_id: Joi.string().required().hex().length(24),
  });
  return schema.validate(blog);
};

const userValidate = function (user: UserInt, login: boolean) {
  const schema = Joi.object({
    ...(!login ? { name: Joi.string().min(4).max(12).required() } : {}),
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
      .message(
        'Password must be at least 8 characters long and include at least one letter and one number'
      ),
  });
  return schema.validate(user);
};

export { validateBlog, validateUser };
