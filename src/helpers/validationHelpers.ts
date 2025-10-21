import Joi from 'joi';
import { BlogInt } from '../models/blog';
import { UserInt } from '../models/user';

const blogValidate = function (blog: BlogInt) {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    category: Joi.string().required(),
    user_id: Joi.string().required().hex().length(24),
  });
  return schema.validate(blog);
};

const userValidate = function (user: UserInt, login: boolean) {
  const schema = Joi.object({
    ...(!login ? { name: Joi.string().min(4).max(12).required() } : {}),
    email: Joi.string().min(5).max(100).required().email(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
      .message(
        'Password must be at least 8 characters long and include at least one letter and one number'
      ),
  });
  return schema.validate(user);
};

export { blogValidate, userValidate };
