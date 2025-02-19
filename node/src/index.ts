import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './data-source';
import searchRouter from './routes/search';
import priceHistoryRouter from './routes/price-history';
import productsRouter from './routes/products';


dotenv.config();

const app = express();
const port = 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(express.json());
app.use(cors());

app.use(
  cors({
    origin: [FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

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




app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});