import { NextFunction, Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { getUser } from '../controllers/userController';

// check if password is valid
const checkPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await getUser(req, res);
    if (!user) return res.status(400).send('Invalid email or password');
    const isValidUser = await bcrypt.compare(
      req.body.password,
      (user as any).password
    );
    if (!isValidUser) return res.status(403).send('Invalid email or password');
    return next();
  } catch (err) {
    return err;
  }
};
export { checkPassword };
