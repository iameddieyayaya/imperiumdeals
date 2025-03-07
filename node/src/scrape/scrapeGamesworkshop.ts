import puppeteer from 'puppeteer';
import { AppDataSource } from '../data-source';
import { Product } from '../entities/Product';
import { PriceHistory } from '../entities/PriceHistory';
import { factions } from '../../factions';
import { scraperAgs } from './scraper-config';

const WARHAMMER_URL = 'https://www.warhammer.com/en-US/shop/warhammer-40000';

export const scrapeGamesworkshop = async () => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: scraperAgs
    });
    const page = await browser.newPage();
    console.log(`Navigating to ${WARHAMMER_URL}...`);
    await page.goto(WARHAMMER_URL, { waitUntil: 'load' });

    try {
      const popupButton = await page.waitForSelector("[data-testid='locale-selector-close-button']", { timeout: 5000 });
      await popupButton?.evaluate((btn: any) => btn.click());
    } catch (error) {
      console.log('No popup found or popup already closed.');
    }

    await page.setViewport({
      width: 1200,
      height: 800,
    });

    await page.waitForSelector('.product-card', { visible: true });

    let showMoreButton;
    let totalItemsLoaded = 0;
    const expectedTotalItems = 939; // Update this to the expected total number of items

    // Function to count the number of loaded product cards
    const countLoadedItems = async () => {
      return await page.evaluate(() => {
        return document.querySelectorAll('.product-card').length;
      });
    };

    // Keep clicking "Show More" until all items are loaded or the button disappears
    while (true) {
      totalItemsLoaded = await countLoadedItems();
      console.log(`Total items loaded: ${totalItemsLoaded}`);

      if (totalItemsLoaded >= expectedTotalItems) {
        console.log('All items loaded.');
        break;
      }

      try {
        showMoreButton = await page.waitForSelector('#show-more', { visible: true, timeout: 5000 });
      } catch (error) {
        console.log('No more "Show More" button found. Breaking loop...');
        break;
      }

      if (showMoreButton) {
        console.log('Clicking "Show More" button...');
        await showMoreButton.evaluate((btn: any) => btn.click());

        // Wait for new items to load
        await page.waitForFunction(
          (previousCount) => {
            return document.querySelectorAll('.product-card').length > previousCount;
          },
          { timeout: 10000 },
          totalItemsLoaded
        );
      } else {
        console.log('No "Show More" button found. Breaking loop...');
        break;
      }
    }

    // // Take a screenshot for debugging
    // await page.screenshot({ path: 'example.png' });

    // Scrape all product cards
    const productList = await page.evaluate((urlBase) => {
      const productCards = Array.from(document.querySelectorAll('.product-card'));

      return productCards.map((card: Element) => {
        const cardElement = card as HTMLElement;

        const name = cardElement.querySelector("[data-testid='product-card-name']")?.textContent?.trim();
        const priceText = cardElement.querySelector("[data-testid='product-card-current-price']")?.textContent?.trim();
        const relativeUrl = cardElement.querySelector("a")?.getAttribute("href");
        const url = relativeUrl ? new URL(relativeUrl, urlBase).toString() : null;

        const price = priceText ? parseFloat(priceText.replace("$", "").trim()) : NaN;

        if (isNaN(price)) {
          console.log('Invalid price:', priceText);
          return null;
        }

        return {
          name,
          price,
          description: "Description not available",
          url,
          source: new URL(urlBase).hostname.replace('www.', ''),
          isOnlineOnly: !!cardElement.querySelector("[data-testid*='badge']"),
        };
      }).filter((product): product is NonNullable<typeof product> => product !== null);
    }, WARHAMMER_URL);

    if (productList.length === 0) {
      console.log('No products found.');
      return;
    }

    // Assign factions to products based on their names
    const productsWithFactions = productList.map((product) => {
      const matchedFaction = factions.find((faction) =>
        product.url?.toLowerCase().includes(faction.toLowerCase())
      );
      return {
        ...product,
        faction: matchedFaction ? matchedFaction : null,
      };
    });

    const productRepository = AppDataSource.getRepository(Product);
    const priceHistoryRepository = AppDataSource.getRepository(PriceHistory);
    for (const productData of productsWithFactions) {
      console.log({ product: productData });

      let product = await productRepository.findOneBy({ name: productData.name, source: productData.source });

      if (!product) {
        product = productRepository.create({
          name: productData.name,
          price: productData.price,
          description: productData.description,
          url: productData.url || '',
          source: productData.source,
          isOnlineOnly: productData.isOnlineOnly,
          faction: productData.faction || 'Unknown',
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
    return productsWithFactions;
  } catch (error) {
    console.error('Error during scraping:', error);
  }
};