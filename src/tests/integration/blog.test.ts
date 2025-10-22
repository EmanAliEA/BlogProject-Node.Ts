import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../index';
import { Blog } from '../../models/blog';
import { User } from '../../models/user';
let server: any;

describe('/blogs', () => {
  let user: InstanceType<typeof User>;
  let token: string;
  let blog: any;

  beforeEach(() => {
    server = app.listen(3001);
    user = new User({
      _id: new mongoose.Types.ObjectId().toHexString(),
      name: 'test_user',
      email: 'testuser@example.com',
      password: 'Password1',
    });
    token =
      typeof user.generateAuthToken === 'function'
        ? user.generateAuthToken()
        : '';
  });
  afterEach(async () => {
    await server.close();
    await Blog.deleteMany({});
    await User.deleteMany({});
  });

  describe('GET /', () => {
    let query: string = '';
    const exec = () => {
      return request(server).get(`/blogs${query}`).set('x-auth-token', token);
    };
    beforeEach(async () => {
      await Blog.collection.insertMany([
        {
          title: 'blog1',
          content: 'content1',
          category: 'Technology',
          user_id: user._id,
        },
        {
          title: 'blog2',
          content: 'content2',
          category: 'sport',
          user_id: user._id,
        },
      ]);
    });
    afterEach(async () => {
      await Blog.deleteMany({});
    });
    it('should return 200 if blogs exist and for correct user', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.blogs.length).toBe(2);
    });
    it('should return 400 if no blogs found for the user', async () => {
      await Blog.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe('no blogs found');
    });
    it('should return 401 if no token provided', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
      expect(res.text).toBe('Access denied. No token provided.');
    });
    it('should return filtered blogs when add category query', async () => {
      query = '?category=Technology';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.blogs.length).toBe(1);
      expect(
        res.body.blogs.some((b: any) => b.category === 'Technology')
      ).toBeTruthy();
    });
    it('should return filtered blogs when add title query', async () => {
      query = '?title=blog1';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.blogs.length).toBe(1);
      expect(res.body.blogs.some((b: any) => b.title === 'blog1')).toBeTruthy();
    });
    it('should return filtered blogs when add content query', async () => {
      query = '?content=content1';
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.blogs.length).toBe(1);
      expect(
        res.body.blogs.some((b: any) => b.content === 'content1')
      ).toBeTruthy();
    });
    it('should return 400 for unsupported query', async () => {
      query = '?sortBy=title';
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe('this query is not supported');
    });
  });

  describe('POST /', () => {
    beforeEach(() => {
      blog = new Blog({
        title: 'blog1',
        content: 'content1',
        category: 'category1',
        user_id: user._id,
      });
    });
    const exec = async () => {
      return await request(server)
        .post('/blogs')
        .set('x-auth-token', token)
        .send(blog);
    };

    it('should return 401 if client is not logged in ', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it('should return 400 if no data is provided', async () => {
      blog = {};
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('No data provided');
    });
    it('should return 400 if blog title is not provided', async () => {
      blog.title = '';
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('"title" is required');
    });
  });

  describe('PUT /:id', () => {
    beforeEach(async () => {
      blog = new Blog({
        title: 'blog1',
        content: 'content1',
        category: 'category1',
        user_id: user._id,
      });
      await blog.save();
    });
    const exec = () => {
      return request(server)
        .put(`/blogs/${blog._id}`)
        .set('x-auth-token', token)
        .send(blog);
    };
    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it('should return 400 if no data is provided', async () => {
      blog = {};
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('No data provided to update');
    });
    it('should return 400 if the blog does not exist', async () => {
      blog._id = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('this blog not found');
    });
    it('should return 400 if the user is not the owner of the blog', async () => {
      user._id = new mongoose.Types.ObjectId();
      token =
        typeof user.generateAuthToken === 'function'
          ? user.generateAuthToken()
          : '';

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('you are not allowed to update this blog');
    });
    it('should return 200 if the blog is updated successfully', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('message', 'Blog successfully updated');
      expect(res.body).toHaveProperty('blog');
    });
  });

  describe('DELETE /:id', () => {
    beforeEach(async () => {
      blog = new Blog({
        title: 'blog1',
        content: 'content1',
        category: 'category1',
        user_id: user._id,
      });
      await blog.save();
    });
    const exec = () => {
      return request(server)
        .delete(`/blogs/${blog._id}`)
        .set('x-auth-token', token);
    };
    it('should return 400 if blog does not exist', async () => {
      blog._id = new mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.text).toBe('this blog not found');
    });
    it('should return 400 if the user is not the owner of the blog', async () => {
      user._id = new mongoose.Types.ObjectId();
      token =
        typeof user.generateAuthToken === 'function'
          ? user.generateAuthToken()
          : '';

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.text).toBe('you are not allowed to delete this blog');
    });
    it('should return 200 if the blog is deleted successfully', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.text).toBe('Blog successfully Deleted');
    });
  });
});
