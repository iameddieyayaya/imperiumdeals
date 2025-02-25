import puppeteer, { Browser, Page } from 'puppeteer';
import { scraperAgs } from '../scraper-config';

interface Product {
  title: string | null;
  price: number;
  totalPrice: string | null;
  url: string | null;
}

export const scrapeAmazon = async (query: string): Promise<Product[]> => {
  const AMAZON_URL = `https://www.amazon.com/s?k=warhammer+40k+${encodeURIComponent(query)}`;

  const browser: Browser = await puppeteer.launch({
    headless: true,
    args: scraperAgs,
  });
  const page: Page = await browser.newPage();

  try {
    // Navigate to Amazon search results page
    await page.goto(AMAZON_URL, { waitUntil: 'networkidle2' });
    await page.setViewport({ width: 1920, height: 1080 });

    // Wait for the product containers to load
    await page.waitForSelector('.s-title-instructions-style', { timeout: 5000 });

    // Extract product details for all products
    const products: Product[] = await page.evaluate(() => {
      const items: Product[] = [];

      // Select all product containers
      document.querySelectorAll('.s-title-instructions-style').forEach((productElement) => {
        // Extract title
        const titleElement = productElement.querySelector('h2');
        const title = titleElement?.textContent?.trim() ?? null;

        // Extract URL
        const linkElement = productElement.querySelector('a');
        const url = linkElement?.href ?? null;

        // Extract price
        const priceElement = document.querySelector('.a-price .a-offscreen');
        const totalPrice = priceElement?.textContent?.trim() ?? null;
        const price = totalPrice ? parseFloat(totalPrice.replace('$', '').replace(',', '')) : 0;

        if (title && url) {
          items.push({ title, price, totalPrice, url });
        }
      });

      return items;
    });

    return products;
  } catch (error) {
    console.error('Error during scraping:', error);
    return [];
  } finally {
    // Close the browser
    await browser.close();
  }
};

// Example usage
// (async () => {
//   const query = 'Tyranids';
//   const products = await scrapeAmazon(query);
//   console.log(products);
// })();