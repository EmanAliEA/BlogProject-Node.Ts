
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

export { User, type UserInt };
