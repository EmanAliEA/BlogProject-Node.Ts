import express from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateBlog } from '../middleware/validation';
import { createBlog, deleteBlog, getBlogs, updateBlog } from '../controllers/blogController';
// Ensure custom Express types are loaded
/// <reference path="../../types/express.d.ts" />

const router = express.Router();

// create blog post
router.post(
  '/',
  [authMiddleware, validateBlog],
  async (req: Request, res: Response) => {
    console.log('req.user: CREATE Blog', (req as any).user);
    // create new blog
    createBlog(req, res);
    return ;
  }
);
// get all blog posts
router.get('/', [authMiddleware ], async (req: Request, res: Response) => {
 getBlogs(req, res);
});
// update blog post by id
router.put('/:id', [authMiddleware , validateBlog], async (req: Request, res: Response) => {
  // update blog 
  updateBlog(req, res);
  return ;
});

// delete blog post by id
router.delete('/:id', [authMiddleware], async (req: Request, res: Response) => {
  // delete blog
  deleteBlog(req, res);
  return ;
});

export default router;
