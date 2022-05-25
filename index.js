import { dbConnect } from './config/db.js';
import { app } from './src/app.js';

const port = process.env.PORT || 5000;

try {
  // connect to db
  const dbConnected = await dbConnect();
  console.log(dbConnected);

  // run server
  const appRunning = await app.listen({ port });
  console.log(`Server running at ${appRunning.url}`);
} catch (error) {
  console.error(error);
}
