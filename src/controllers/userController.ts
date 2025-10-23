import hashPassword from '../helpers/hashPassword';
import { User } from '../models/user';
import type { Request, Response } from 'express';

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
    const user = await getUser(req, res);
    if (!user) return res.status(400).send('Invalid email or password');
    return generateToken(user, res);
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

export { createUser, loginUser, getUser };
