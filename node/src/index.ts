import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CronJob } from 'cron';

import { AppDataSource } from './data-source';
import searchRouter from './routes/search';
import priceHistoryRouter from './routes/price-history';
import productsRouter from './routes/products';
import { runScrapingTask } from '../cron/runScrapingTask';


dotenv.config();

const app = express();
const port = 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: '*', // ❌ Debugging!
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

// Route to fetch all products
app.use('/api', searchRouter);
app.use('/api/price-history', priceHistoryRouter);
app.use('/api/products', productsRouter);

// Set up the CronJob to run every two weeks
const job = new CronJob(
  '0 0 * * 0/2', // Cron expression for every two weeks
  runScrapingTask, // Function to run
  null, // onComplete callback (optional)
  true, // Start the job immediately
  'UTC' // Timezone (optional, defaults to system timezone)
);
console.log('Cron job scheduled to run every two weeks.', { job });


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});