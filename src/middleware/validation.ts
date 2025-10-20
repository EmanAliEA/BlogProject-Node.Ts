import Joi from 'joi';
import _ from 'lodash';
import { BlogInt } from '../models/blog';
import type { Request, Response, NextFunction } from 'express';

function validateBlog(req: Request, res: Response, next: NextFunction) {
  const { error } = blogValidate({
    ..._.pick(req.body, ['title', 'content', 'category']),
    user_id: (req as any).user,
  });
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

export { validateBlog };
