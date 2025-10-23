import { paginate } from '../helpers/pagination';
import { getQueryParam } from '../helpers/queryParamHelper';
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

// get Blog by ID
const getBlogById = async (req: Request, res: Response) => {
  // find blog by id
  try {
    if (Object.keys(req.body).length === 0)
      return res.status(400).send('No data provided to update');
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
    const { offset, limit } = paginate(
      Number(req.query?.['page']) || 1,
      Number(req.query?.['limit']) || 3
    );
    const param = Object.keys(req.query).length && getQueryParam(req);
    if (
      param === null &&
      req.query['page'] === undefined &&
      req.query['limit'] === undefined
    ) {
      return res.status(400).send('this query is not supported');
    }
    const blogs = await Blog.find({
      user_id: (req as any).user,
      ...(param ?? {}),
    })
      .select('-user_id')
      .skip(offset)
      .limit(limit)
      .exec();

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

export { createBlog, getBlogById, updateBlog, deleteBlog, getBlogs };
