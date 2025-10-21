import * as bcrypt from 'bcrypt';
import hashPassword from '../helpers/hashPassword';
import { User } from '../models/user';
import type { Request, Response } from 'express';

// get user
const getUser = async (req: Request, res: Response, message?: string) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).send(message || 'User already registered');
    return user;
  } catch (error) {
    return res.status(500).send({ message: error });
  }
};

// create new user
const createUser = async (req: Request, res: Response) => {
  try {
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

// check if password is valid
const checkPassword = async (req: Request, password: string) => {
  try {
    const isValidUser = await bcrypt.compare(req.body.password, password);
    return isValidUser;
  } catch (err) {
    return err;
  }
};

export { getUser, createUser, checkPassword };
