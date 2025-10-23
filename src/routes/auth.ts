import express from 'express';
// import type { Request, Response } from 'express';
import { validateRequest } from '../middleware/validation';
import { createUser, loginUser } from '../controllers/userController';
import { checkPassword } from '../middleware/checkPassword';

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
router.post('/login', [validateRequest('user'), checkPassword], loginUser);

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
router.post('/signup', validateRequest('user'), createUser);

export default router;
