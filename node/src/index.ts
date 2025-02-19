import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { AppDataSource } from './data-source';
import { Product } from './entities/Product';
import searchRouter from './routes/search';
import priceHistoryRouter from './routes/price-history';


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


app.get('/products', async (_req: Request, res: Response) => {
  try {
    const products = await AppDataSource.getRepository(Product).find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

app.get('/products/search', async (req: Request, res: Response): Promise<void> => {
  const productName = req.query.name as string;

  if (!productName) {
    res.status(400).json({ error: "Product name is required" });
    return;
  }

  try {
    const productRepo = AppDataSource.getRepository(Product);
    const products = await productRepo.find({
      where: { name: productName },
      relations: ['priceHistories'],
    });

    if (!products || products.length === 0) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    const results = products.map((product) => {
      const priceHistories = product.priceHistories.map((history) => ({
        website: new URL(product.url).hostname,
        price: history.price,
        recordedAt: history.recordedAt,
      }));

      return {
        product: product.name,
        description: product.description || "Description not available",
        url: product.url,
        source: product.source,
        priceHistories,
      };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "An error occurred while searching for products" });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});