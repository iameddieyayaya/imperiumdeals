import puppeteer from 'puppeteer';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { PriceHistory } from '../entities/PriceHistory';

export const scrapeGamesworkshop = async () => {
  try {
    await AppDataSource.initialize();

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.warhammer.com/en-US/shop/warhammer-40000', {
      waitUntil: 'domcontentloaded',
    });

    await page.waitForSelector('.product-card');

    const productList = await page.evaluate(() => {
      const productCards = Array.from(
        document.querySelectorAll('.product-card')
      );

      return productCards.map((card: Element) => {
        const cardElement = card as HTMLElement;

        const name = cardElement.querySelector("[data-testid='product-card-name']")?.textContent?.trim();
        const priceText = cardElement.querySelector("[data-testid='product-card-current-price']")?.textContent?.trim();
        const url = cardElement.querySelector("a")?.getAttribute("href");

        const price = priceText ? parseFloat(priceText.replace("$", "").trim()) : NaN;

        if (isNaN(price)) {
          console.log('Invalid price:', priceText);
          return null;
        }

        return {
          name,
          price,
          description: "Description not available",
          url: url ? "https://www.warhammer.com" + url : "",
          isOnlineOnly: !!cardElement.querySelector("[data-testid*='badge']")
        };
      }).filter((product): product is NonNullable<typeof product> => product !== null);
    });

    if (productList.length === 0) {
      console.log('No products found.');
      return;
    }

    const productRepository = AppDataSource.getRepository(Product);
    const priceHistoryRepository = AppDataSource.getRepository(PriceHistory);
    for (const productData of productList) {
      console.log({ product: productData });

      let product = await productRepository.findOneBy({ name: productData.name });

      if (!product) {
        product = productRepository.create({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          url: productData.url,
          isOnlineOnly: productData.isOnlineOnly,
        });
        await productRepository.save(product);
      } else {
        if (product.price !== productData.price) {
          product.price = productData.price;
          await productRepository.save(product);
        }
      }
      const priceHistory = priceHistoryRepository.create({
        price: productData.price,
        recordedAt: new Date(),
        product: product,
      });
      await priceHistoryRepository.save(priceHistory);
    }

    console.log('Products and price histories saved to the database successfully.');
    await browser.close();
    await AppDataSource.destroy();
    return productList;
  } catch (error) {
    console.error('Error during scraping:', error);
  }
};