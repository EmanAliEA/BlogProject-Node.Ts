import express from 'express';
import * as bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import { User, userValidate } from '../models/user';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    // check if this user is already new or not
    const users = await User.find({ email: req.body.email });
    if (users.length)
      return res.status(400).send({ message: 'User already registered' });
    // invalidated inputs -> return error 400
    const { error } = userValidate(req.body, false);
    if (error) return res.status(400).send(error.details[0]?.message);
    console.log('Passed validation');
    // validated inputs -> create new User
    const newUser = new User(req.body);
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;
    // store user in DB
    await newUser.save();
    // return 200
    return res.status(200).send({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
});

export default router;
