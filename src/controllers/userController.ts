import hashPassword from '../helpers/hashPassword';
import { User } from '../models/user';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';

// get user
const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    return user;
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

const generateToken = (user: any, res: Response) => {
  const token = (user as any).generateAuthToken();
  return res.header('x-auth-token', token).send(token);
};

const checkPassword = async (password: string, user: any, res: Response) => {
  try {
    const isValidUser = await bcrypt.compare(password, (user as any).password);
    if (!isValidUser) return res.status(403).send('Invalid email or password');
    return true;
  } catch (err) {
    return false;
  }
};

// create new user
const createUser = async (req: Request, res: Response) => {
  try {
    // check if user already exists
    const user = await getUser(req, res);
    if (user) return res.status(400).send('User already registered');
    // create new user
    const newUser = new User(req.body);
    // hash password
    newUser.password = await hashPassword(newUser.password);
    // save user to DB
    await newUser.save();
    // return 200
    return res.status(200).send({ message: 'User registered successfully' });
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

//
const loginUser = async (req: Request, res: Response) => {
  try {
    console.log('Login request body:', req.body);
    const user = await getUser(req, res);
    if (user === null || !user)
      return res.status(400).send('Invalid email or password');
    const isValidPassword = await checkPassword(req.body.password, user, res);
    if (isValidPassword !== true) return;
    return generateToken(user, res);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export { createUser, loginUser, getUser, checkPassword };
