/// <reference path="../types/express.d.ts" />
import _ from 'lodash';
import express from 'express';
import type { Request, Response } from 'express';
import { Blog, blogValidate } from '../models/blog';
import { authMiddleware } from '../middleware/auth';
// Ensure custom Express types are loaded
/// <reference path="../../types/express.d.ts" />

const router = express.Router();

// create blog post
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  // check inputs
  console.log('req.user:', req.body);
  const { error } = blogValidate({
    ..._.pick(req.body, ['title', 'content', 'category']),
    user_id: (req as any).user,
  });
  if (error) return res.status(400).send(error.details[0]?.message);

  // create new blog
  const newBlog = new Blog({ ...req.body, user_id: (req as any).user });

  // save it in DB
  await newBlog.save();

  // return 200
  return res
    .status(200)
    .send({ message: 'Blog successfully created', blog: newBlog });
});
// get all blog posts
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  console.log('req.user: GET Blogs', (req as any).user);
  const filterBy = req.query['category'] ? req.query['category'] : null;
  const blogs = await Blog.find({
    user_id: (req as any).user,
    ...(filterBy && { category: filterBy }),
  }).select('-user_id');
  if (!blogs.length) return res.status(400).send('no blogs found');
  return res.status(200).send({ blogs: blogs });
});
// update blog post by id
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  // find blog by id
  let blog = await Blog.findById(req.params['id']);
  if (blog?.user_id?.toString() !== (req as any).user) {
    return res.status(400).send('you are not allowed to update this blog');
  }
  blog?.updateOne(req.body);

  if (!blog) return res.status(400).send('this blog not found');
  return res
    .status(200)
    .send({ message: 'Blog successfully updated', blog: blog });
});

// delete blog post by id
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  // get blog and delete it
  const blog = await Blog.findById(req.params['id']);
  if (blog?.user_id?.toString() !== (req as any).user) {
    return res.status(400).send('you are not allowed to delete this blog');
  }
  if (!blog) return res.status(400).send('error: this blog is not found');
  await blog.deleteOne();
  return res.status(200).send('Blog successfully Deleted');
});

export default router;
