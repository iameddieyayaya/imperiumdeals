import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';

export async function saveScrapedData(products: { name: string; price: string; url: string; faction: string }[]) {
  const productRepository = AppDataSource.getRepository(Product);

  const now = new Date();

  const toSave = await Promise.all(
    products.map(async (product) => {
      const existingProduct = await productRepository.findOne({
        where: { name: product.name, url: product.url },
      });

      const price = parseFloat(product.price.replace('$', '').trim());

      if (existingProduct) {
        existingProduct.price = price;
        existingProduct.url = product.url;
        existingProduct.lastUpdated = now;
        return existingProduct;
      } else {
        return productRepository.create({
          name: product.name,
          price,
          url: product.url,
          lastUpdated: now,
        });
      }
    })
  );

  await productRepository.save(toSave);
}