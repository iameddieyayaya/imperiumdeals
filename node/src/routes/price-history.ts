import express, { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { PriceHistory } from '../entities/PriceHistory';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const { product } = req.query;

  if (!product) {
    res.status(400).json({ error: 'Product name is required' });
    return;
  }

  try {
    const priceHistoryRepository = AppDataSource.getRepository(PriceHistory);

    const priceHistory = await priceHistoryRepository
      .createQueryBuilder('priceHistory')
      .innerJoinAndSelect('priceHistory.product', 'product')
      .where('LOWER(product.name) LIKE LOWER(:productName)', { productName: `%${product}%` })
      .orderBy('priceHistory.recordedAt', 'ASC')
      .getMany();

    res.status(200).json(priceHistory);
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ error: 'An error occurred while fetching price history' });
  }
});

export default router;