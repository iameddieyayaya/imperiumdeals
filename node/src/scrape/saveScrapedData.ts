import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { PriceHistory } from '../entities/PriceHistory';

export async function saveScrapedData(products: { name: string; price: string; url: string; faction: string }[]) {
  const productRepository = AppDataSource.getRepository(Product);
  const priceHistoryRepository = AppDataSource.getRepository(PriceHistory);

  const now = new Date();

  const toSave = await Promise.all(
    products.map(async (product) => {
      const existingProduct = await productRepository.findOne({
        where: { name: product.name, url: product.url },
        relations: ['priceHistories'],
      });

      const price = parseFloat(product.price.replace('$', '').trim());

      if (existingProduct) {
        if (existingProduct.price !== price) {
          existingProduct.price = price;
          existingProduct.lastUpdated = now;

          const priceHistory = priceHistoryRepository.create({
            price,
            recordedAt: now,
            product: existingProduct,
          });
          await priceHistoryRepository.save(priceHistory);
        }
        return existingProduct;
      } else {
        const newProduct = productRepository.create({
          name: product.name,
          price,
          url: product.url,
          lastUpdated: now,
        });

        const savedProduct = await productRepository.save(newProduct);
        const priceHistory = priceHistoryRepository.create({
          price,
          recordedAt: now,
          product: savedProduct,
        });
        await priceHistoryRepository.save(priceHistory);
        return savedProduct;
      }
    })
  );

  await productRepository.save(toSave);
}