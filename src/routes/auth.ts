import express from 'express';
// import type { Request, Response } from 'express';
import { validateRequest } from '../middleware/validation';
import { createUser, loginUser } from '../controllers/userController';

const router = express.Router();

router.post('/login', validateRequest('user'), loginUser);
router.post('/signup', validateRequest('user'), createUser);

export default router;
