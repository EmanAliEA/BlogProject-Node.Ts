import jwt from 'jsonwebtoken';
import { jwtPrivateKey } from '../config/config';
import type { Request, Response, NextFunction } from 'express';

// get token from header
// check if token is valid
// if valid -> next()
// if not valid -> return 401
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers['x-auth-token'];
    if (!token)
      return res.status(401).send('Access denied. No token provided.');
    const decodedData: any = jwt.verify(
      token as string,
      jwtPrivateKey || (process.env['JWT_PRIVATE_KEY'] as string)
    );
    if (decodedData) {
      (req as any).user = decodedData.id;
      return next();
    }
  } catch (err) {
    return res.status(401).send('Invalid token.');
  }
}
