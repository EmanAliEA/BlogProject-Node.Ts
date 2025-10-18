import Joi from 'joi';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { jwtPrivateKey } from '../config/config';

interface UserInt {
  [x: string]: any;
  name?: string;
  email: string;
  password: string;
  generateAuthToken?: () => string;
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 12 },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    match: /(?=.*[a-zA-Z])(?=.*\d)/,
  },
});

userSchema.methods['generateAuthToken'] = function () {
  return jwt.sign(
    { id: this['_id'] },
    jwtPrivateKey || process.env['JWT_PRIVATE_KEY']
  );
};

const User = mongoose.model<UserInt>('User', userSchema);

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

export { User, userValidate, type UserInt };
