import express from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import {
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from '../controllers/blogController';
import { checkOwnership } from '../helpers/checkOwnerHelper';
// Ensure custom Express types are loaded
/// <reference path="../../types/express.d.ts" />

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Blogs
 *     description: Operations related to blog posts
 */

// create blog post
/**
 * @openapi
 * /blogs:
 *   post:
 *     tags:
 *       - Blogs
 *     summary: Create a new blog post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post.
 *                 example: "My First Blog Post"
 *               content:
 *                 type: string
 *                 description: The content of the blog post.
 *                 example: "This is the content of my first blog post."
 *               category:
 *                 type: string
 *                 description: The category of the blog post.
 *                 example: "Technology"
 *     responses:
 *       200:
 *         description: The created blog post.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized access.
 */
router.post(
  '/',
  [authMiddleware, validateRequest('blog')],
  async (req: Request, res: Response) => {
    createBlog(req, res);
    return;
  }
);
// get all blog posts
/**
 * @openapi
 * /blogs:
 *   get:
 *     tags:
 *       - Blogs
 *     summary: Get all blogs
 *     responses:
 *       200:
 *         description: A list of blogs.
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  getBlogs(req, res);
});
// update blog post by id
/**
 * @openapi
 * /blogs/{id}:
 *   put:
 *     tags:
 *       - Blogs
 *     summary: Update a blog post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog post to update
 *         schema:
 *           type: string
 *           example: "609c0b8f2f8fb814b56fa181"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the blog post.
 *                 example: "My First Blog Post"
 *               content:
 *                 type: string
 *                 description: The content of the blog post.
 *                 example: "This is the content of my first blog post."
 *               category:
 *                 type: string
 *                 description: The category of the blog post.
 *                 example: "Technology"
 *     responses:
 *       200:
 *         description: The updated blog post.
 *       404:
 *         description: Blog not found.
 *       403:
 *         description: You are not allowed to update this blog post.
 *       400:
 *         description: No data provided to update.
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  // check if request body is empty
  if (Object.keys(req.body).length === 0)
    return res.status(400).send('No data provided to update');
  // get blog
  const blog = await getBlogById(req, res);
  // check ownership
  if (checkOwnership(blog, (req as any).user))
    return res.status(403).send('you are not allowed to update this blog');
  // update blog
  updateBlog(req, res);
  return;
});

// delete blog post by id
/**
 * @openapi
 * /blogs/{id}:
 *   delete:
 *     tags:
 *       - Blogs
 *     summary: Delete a blog post
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the blog post to delete
 *         schema:
 *           type: string
 *           example: "609c0b8f2f8fb814b56fa181"
 *     responses:
 *       204:
 *         description: Blog post deleted successfully.
 *       400:
 *         description: Blog post not found.
 *       403:
 *         description: You are not allowed to delete this blog post.
 *       401:
 *         description: Unauthorized access.
 */
router.delete('/:id', [authMiddleware], async (req: Request, res: Response) => {
  // get blog
  const blog = await getBlogById(req, res);
  // check ownership
  if (checkOwnership(blog, (req as any).user))
    return res.status(403).send('you are not allowed to delete this blog');
  // delete blog
  deleteBlog(req, res);
  return;
});

export default router;
