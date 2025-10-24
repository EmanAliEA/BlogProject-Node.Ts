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

router.put('/:id', [authMiddleware, checkOwnership], updateBlog);
router.delete('/:id', [authMiddleware, checkOwnership], deleteBlog);

router
  .route('/')
  .put((_, res) => {
    res.status(400).send('Blog ID is required for updates');
  })
  .delete((_, res) => {
    res.status(400).send('Blog ID is required for updates');
  });

export default router;
