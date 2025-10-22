import express from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateBlog } from '../middleware/validation';
import {
  checkOwnership,
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from '../controllers/blogController';
// Ensure custom Express types are loaded
/// <reference path="../../types/express.d.ts" />

const router = express.Router();

// create blog post
router.post(
  '/',
  [authMiddleware, validateBlog],
  async (req: Request, res: Response) => {
    createBlog(req, res);
    return;
  }
);
// get all blog posts
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  getBlogs(req, res);
});
// update blog post by id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  // check if request body is empty
  if (Object.keys(req.body).length === 0)
    return res.status(400).send('No data provided to update');
  // get blog
  const blog = await getBlogById(req, res);
  // check ownership
  if (checkOwnership(blog, (req as any).user))
    return res.status(400).send('you are not allowed to update this blog');
  // update blog
  updateBlog(req, res);
  return;
});

// delete blog post by id
router.delete('/:id', [authMiddleware], async (req: Request, res: Response) => {
  // get blog
  const blog = await getBlogById(req, res);
  // check ownership
  if (checkOwnership(blog, (req as any).user))
    return res.status(400).send('you are not allowed to delete this blog');
  // delete blog
  deleteBlog(req, res);
  return;
});

export default router;
