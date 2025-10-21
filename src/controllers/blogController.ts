import { Blog } from '../models/blog';
import { Request, Response } from 'express';

// create Blog
const createBlog = async (req: Request, res: Response) => {
  // create new blog
  const newBlog = new Blog({ ...req.body, user_id: (req as any).user });
  // save it in DB
  await newBlog.save();
  // return 200
  return res
    .status(200)
    .send({ message: 'Blog successfully created', blog: newBlog });
};
// check ownership
const checkOwnership = (blog: any, userId: string) => {
  console.log('Checking ownership:', blog.user_id?.toString(), 'vs', userId);
  return blog.user_id?.toString() !== userId;
};

// get Blog by ID
const getBlogById = async (req: Request, res: Response) => {
  // find blog by id
  const blog = await Blog.findById(req.params['id']);
  if (!blog) return res.status(400).send('this blog not found');
  return blog;
};
// update Blog
const updateBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params['id'] },
    req.body,
    { new: true }
  );
  if (!blog) {
    return res.status(400).send('this blog not found');
  }
  return res
    .status(200)
    .send({ message: 'Blog successfully updated', blog: blog });
};
// get Blogs
const getBlogs = async (req: Request, res: Response) => {
  console.log('req.user: GET Blogs', (req as any).user);
  const filterBy = req.query['category'] ? req.query['category'] : null;
  const blogs = await Blog.find({
    user_id: (req as any).user,
    ...(filterBy && { category: filterBy }),
  }).select('-user_id');
  if (!blogs.length) return res.status(400).send('no blogs found');
  return res.status(200).send({ blogs: blogs });
};
// delete Blog
const deleteBlog = async (req: Request, res: Response) => {
  const blog = await Blog.findByIdAndDelete(req.params['id']);
  if (!blog) return res.status(400).send('this blog not found');
  return res.status(200).send('Blog successfully Deleted');
};

export {
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogs,
  checkOwnership,
};
