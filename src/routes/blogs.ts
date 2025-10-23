import express from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createBlog,
  deleteBlog,
  getBlogs,
  updateBlog,
} from '../controllers/blogController';
import { checkOwnership } from '../middleware/ownerShip';

const router = express.Router();
router.post('/', [authMiddleware, validateRequest('blog')], createBlog);

router.get('/', authMiddleware, getBlogs);

router.put(
  '/:id',
  [authMiddleware, validateRequest('blog'), checkOwnership],
  updateBlog
);

router.delete('/:id', [authMiddleware, checkOwnership], deleteBlog);

export default router;
