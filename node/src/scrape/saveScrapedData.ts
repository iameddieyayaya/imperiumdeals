import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { PriceHistory } from '../entities/PriceHistory';
import * as fuzzball from 'fuzzball';

export async function saveScrapedData(products: { name: string; price: string; url: string; faction: string }[]) {
  const productRepository = AppDataSource.getRepository(Product);
  const priceHistoryRepository = AppDataSource.getRepository(PriceHistory);

  const now = new Date();
  const existingProducts = await productRepository.find({ relations: ['priceHistories'] });

  const toSave = await Promise.all(
    products.map(async (product) => {
      const price = parseFloat(product.price.replace('$', '').trim());

      let existingProduct = existingProducts.find((p) => p.url === product.url);

      if (!existingProduct) {
        const existingProductNames = existingProducts.map((p) => p.name);
        const matches = fuzzball.extract(product.name, existingProductNames, { limit: 1 });

        if (matches[0] && matches[0][1] > 80) {
          const matchIndex = existingProductNames.indexOf(matches[0][0]);
          existingProduct = existingProducts[matchIndex];
        }
      }

      if (existingProduct) {
        // Update price if it has changed
        if (existingProduct.price !== price) {
          existingProduct.price = price;
          existingProduct.lastUpdated = now;
          console.log('Updating price for', { existingProduct });

          const priceHistory = priceHistoryRepository.create({
            price,
            recordedAt: now,
            product: existingProduct,
          });
          await priceHistoryRepository.save(priceHistory);
        }
        return existingProduct;
      } else {
        // Create a new product since no match was found
        const tempURL = new URL(product.url);
        const newProduct = productRepository.create({
          name: product.name.toLowerCase(),
          price,
          url: product.url,
          source: tempURL.hostname.replace('www.', ''),
          faction: product.faction,
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