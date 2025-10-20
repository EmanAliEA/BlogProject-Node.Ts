import express from 'express';
import type { Request, Response } from 'express';
import { validateUser } from '../middleware/validation';
import { checkPassword, createUser, getUser } from '../controllers/UserController';

const router = express.Router();

router.post('/login', validateUser,async (req: Request, res: Response) => {
  // get email & password from req & check them
  console.log('validation passed in login')
  // check if user is already logged in
  const user = await getUser(req , res , "Invalid email or password");
  // check password
  checkPassword(req , res , (user as any).password);
  // generate token
  const token = (user as any).generateAuthToken();
  res.header('x-auth-token', token).send(token);
  return;
});

router.post('/signup', validateUser, async (req: Request, res: Response) => {
  try {
    // invalidated inputs -> return error 400
    console.log('validation passed in signup')
    // check if this user is already new or not
    getUser(req , res)
    // validated inputs -> create new User
    createUser(req , res);
    return
  } catch (err) {
    return res.status(500).send({ message: 'Internal server error' });
  }
});

export default router;
