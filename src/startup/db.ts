import { connect } from 'mongoose';

const MONGODB_URI =
  process.env['MONGODB_URI'] || 'mongodb://127.0.0.1:27017/BlogProject';

export const connectToDatabase = async () => {
  try {
    await connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};
