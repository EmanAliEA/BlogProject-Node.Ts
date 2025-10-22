import express from 'express';
import { routes } from './startup/routesFile';
import { connectToDatabase } from './startup/db';

const app = express();
const PORT = process.env['PORT'] || 3000;

(async () => {
  await connectToDatabase();
  routes(app);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

export default app;
