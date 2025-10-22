import { getFirstQueryParam } from '../helpers/getQuerys';
import { Blog } from '../models/blog';
import { Request, Response } from 'express';

// create Blog
const createBlog = async (req: Request, res: Response) => {
  try {
    // create new blog
    const newBlog = new Blog({ ...req.body, user_id: (req as any).user });
    // save it in DB
    await newBlog.save();
    // return 200
    return res
      .status(200)
      .send({ message: 'Blog successfully created', blog: newBlog });
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};
// check ownership
const checkOwnership = (blog: any, userId: string) => {
  return blog.user_id?.toString() !== userId;
};

// get Blog by ID
const getBlogById = async (req: Request, res: Response) => {
  // find blog by id
  try {
    const blog = await Blog.findById(req.params['id']);
    if (!blog) return res.status(400).send('this blog not found');
    return blog;
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};
// update Blog
const updateBlog = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

// get Blogs
const getBlogs = async (req: Request, res: Response) => {
  try {
    const param = getFirstQueryParam(req);
    if (!param) {
      return res.status(400).send('this query is not supported');
    }
    const { key, value } = param;
    const blogs = await Blog.find({
      user_id: (req as any).user,
      [key]: new RegExp(String(value), 'i'),
    }).select('-user_id');
    if (!blogs.length) return res.status(400).send('no blogs found');
    return res.status(200).send({ blogs: blogs });
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};
// delete Blog
const deleteBlog = async (req: Request, res: Response) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params['id']);
    if (!blog) return res.status(400).send('this blog not found');
    return res.status(200).send('Blog successfully Deleted');
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
};

export {
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogs,
  checkOwnership,
};
