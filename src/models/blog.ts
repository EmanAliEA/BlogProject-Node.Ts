import Joi from 'joi';
import mongoose from 'mongoose';

interface BlogInt {
  title: string;
  content: string;
  category: string;
  user_id: mongoose.Schema.Types.ObjectId;
}

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Blog = mongoose.model('Blog', blogSchema);

const blogValidate = function (blog: BlogInt) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    category: Joi.string().required(),
    user_id: Joi.string().required().hex().length(24),
  });
  return schema.validate(blog);
};

export { Blog, blogValidate, type BlogInt };
