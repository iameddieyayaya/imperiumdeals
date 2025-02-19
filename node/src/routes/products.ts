import express from 'express';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { PriceHistory } from '../entities/PriceHistory';

const router = express.Router();

// Get most tracked products (example: top 10 products with the most price history entries)
router.get('/most-tracked', async (req, res) => {
  try {
    const productRepository = AppDataSource.getRepository(Product);
    const mostTrackedProducts = await productRepository
      .createQueryBuilder('product')
      .leftJoin('product.priceHistories', 'priceHistory')
      .select([
        'product.id',
        'product.name',
        'product.price',
        'product.url',
        'product.lastUpdated',
        'COUNT(priceHistory.id) AS priceHistoryCount',
      ])
      .groupBy('product.id')
      .addGroupBy('product.name')
      .addGroupBy('product.lastUpdated')
      .addGroupBy('product.url')
      .addGroupBy('product.price')
      .orderBy('priceHistoryCount', 'DESC')
      .limit(10)
      .getRawMany();

    // Transform the data into the desired structure
    const transformedProducts = mostTrackedProducts.map((product) => ({
      id: product.product_id,
      name: product.product_name,
      price: product.product_price,
      priceHistoryCount: product.pricehistorycount,
      url: product.product_url,
      lastUpdated: product.product_lastUpdated,
    }));

    res.json(transformedProducts);
  } catch (error) {
    console.error('Error fetching most tracked products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get latest price drops (products with the most recent price decrease)
router.get('/price-drops', async (req, res) => {
  try {
    const priceHistoryRepository = AppDataSource.getRepository(PriceHistory);

    const priceDrops = await priceHistoryRepository
      .createQueryBuilder('priceHistory')
      .select([
        'product.id AS productId',
        'product.name AS productName',
        'LAG(priceHistory.price) OVER (PARTITION BY product.id ORDER BY priceHistory.recordedAt) AS oldPrice',
        'priceHistory.price AS newPrice',
      ])
      .leftJoin('priceHistory.product', 'product')
      .getRawMany();

    // Filter results in memory (since window functions cannot be used in WHERE)
    const filteredPriceDrops = priceDrops.filter(
      (row) => row.newPrice < row.oldPrice
    );

    // Sort by recordedAt and limit to 10
    const sortedPriceDrops = filteredPriceDrops
      .sort((a, b) => b.recordedAt - a.recordedAt)
      .slice(0, 10);

    res.json(sortedPriceDrops);
  } catch (error) {
    console.error('Error fetching price drops:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;