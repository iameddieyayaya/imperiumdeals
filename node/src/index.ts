import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { Product } from './entities/Product';
import dotenv from 'dotenv'; ``

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Initialize the database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });

// Route to fetch all products
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
    const product = await productRepo.findOne({
      where: { name: productName },
      relations: ['priceHistories'],
    });

    console.log("Product found:", product);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    const priceHistories = product.priceHistories.map((history) => ({
      website: new URL(product.url).hostname,
      price: history.price,
      recordedAt: history.recordedAt,
    }));

    res.status(200).json({
      product: product.name,
      description: product.description,
      url: product.url,
      priceHistories,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "An error occurred while searching for products" });
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});