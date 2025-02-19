import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    res.status(400).json({ error: 'Missing query parameter' });
    return
  }

  try {
    const productRepository = AppDataSource.getRepository(Product);

    const products = await productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .getMany();

    res.status(200).json(products);
  } catch (error) {
    console.error('Error searching for products:', error);
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
});

export default router;