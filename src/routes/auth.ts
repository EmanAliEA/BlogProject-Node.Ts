import express from 'express';
import type { Request, Response } from 'express';
import { validateRequest } from '../middleware/validation';
import {
  checkPassword,
  createUser,
  getUser,
} from '../controllers/userController';

const router = express.Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication and user login/signup
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: "testuser@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login.
 *       400:
 *         description: Invalid email or password.
 */
router.post(
  '/login',
  validateRequest('user'),
  async (req: Request, res: Response) => {
    // check if user is already logged in
    const user = await getUser(req, res);
    if (!user) return res.status(400).send('Invalid email or password');
    // check password
    const isValid = await checkPassword(req, (user as any).password);
    if (!isValid) return res.status(400).send('Invalid email or password');
    // generate token
    const token = (user as any).generateAuthToken();
    res.header('x-auth-token', token).send(token);
    return;
  }
);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Sign up a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name.
 *                 example: "Test User"
 *               email:
 *                 type: string
 *                 description: The user's email.
 *                 example: "testuser@example.com"
 *               password:
 *                 type: string
 *                 description: The user's password.
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User created successfully.
 *       400:
 *         description: User already registered.
 */
router.post(
  '/signup',
  validateRequest('user'),
  async (req: Request, res: Response) => {
    try {
      // check if this user is already new or not
      const user = await getUser(req, res);
      if (user) return res.status(400).send('User already registered');
      // validated inputs -> create new User
      createUser(req, res);
      return;
    } catch (err) {
      return res.status(500).send({ message: 'Internal server error' });
    }
  }
);

export default router;
