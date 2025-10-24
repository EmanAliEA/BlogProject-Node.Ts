import _ from 'lodash';
import type { Request, Response, NextFunction } from 'express';
import { blogValidate, userValidate } from '../helpers/validationHelpers';

type ValidatorType = 'blog' | 'user';

function validateRequest(type: ValidatorType) {
  return (req: Request, res: Response, next: NextFunction) => {
    let error;
    if (!req.body || Object.keys(req.body).length === 0)
      return res.status(400).send('No data provided');
    if (type === 'blog') {
      ({ error } = blogValidate({
        ..._.pick(req.body, ['title', 'content', 'category']),
        user_id: (req as any).user,
      }));
    } else if (type === 'user') {
      const path = (req.path || req.originalUrl).toLowerCase();
      const isLogin = path.match(/\/login$/) !== null;
      ({ error } = userValidate(req.body, isLogin));
    }
    if (error) return res.status(400).send(error.details[0]?.message);
    return next();
  };
}

export { validateRequest };
