import _ from 'lodash';
import express from 'express';
import * as bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { User, userValidate } from '../models/user';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  // get email & password from req & check them
  // req.user is not set on login, use req.body
  console.log('req.body:', req.body);
  const { error } = userValidate(req.body, true);
  if (error) return res.status(400).send(error.details[0]?.message);
  // check if user is already logged in
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password');
  // check password
  const isValidUser = await bcrypt.compare(req.body.password, user.password);
  if (!isValidUser) return res.status(400).send('Invalid email or password');
  // generate token
  const token = (user as any).generateAuthToken();
  res.header('x-auth-token', token).send(token);
  return;
});

export default router;
