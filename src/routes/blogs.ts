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
router.get('/', authMiddleware, getBlogs);

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
router.put(
  '/:id',
  [authMiddleware, validateRequest('blog'), checkOwnership],
  updateBlog
);

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
router.delete('/:id', [authMiddleware, checkOwnership], deleteBlog);

export default router;
