// check ownership
import { RequestHandler } from 'express';
import { getBlogById } from '../controllers/blogController';
const checkOwnership: RequestHandler = (req, res, next) => {
  const userId = (req as any).user.id;
  const blog = getBlogById(req as any, res);
  const isOwner = (blog as any).user_id?.toString() !== userId;
  if (isOwner)
    return res.status(403).send('you are not allowed to delete this blog');
  return next();
};

export { checkOwnership };
