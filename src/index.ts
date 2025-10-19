import express from 'express';
import { connect } from 'mongoose';
import auth from './routes/auth';
import blogsRouter from './routes/blogs';
import { jwtPrivateKey } from './config/config';

const app = express();

const MONGODB_URI =
  process.env['MONGODB_URI'] || 'mongodb://127.0.0.1:27017/BlogProject';
const PORT = process.env['PORT'] || 3000;

console.log('--- CONFIGURATION ---');
console.log('MONGODB_URI:', MONGODB_URI);
console.log('JWT_PRIVATE_KEY:', jwtPrivateKey);
console.log('PORT:', PORT);
console.log('---------------------');

(async () => {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
  app.use(express.json());
  app.use('/auth', auth);
  app.use('/blogs', blogsRouter);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
