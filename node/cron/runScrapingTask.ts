import { wargameportalFactionLinks } from '../src/scrape/wargameportal/wargameportalFactionLinks';
import { factions } from '../factions'

import { scrapeWargamePortal } from '../src/scrape/wargameportal/scrapeWargamePortal';
import { scrapeGamesworkshop } from '../src/scrape/scrapeGamesworkshop';
import { scrapeAmazon } from '../src/scrape/amazon/scrapeAmazon';

import { saveScrapedData } from '../src/scrape/saveScrapedData';
import { AppDataSource } from '../src/data-source';

export async function runScrapingTask() {
  console.log('Running the scraping task...');
  try {

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const gwProducts = await scrapeGamesworkshop();
    console.log('Scraping Completed -> GamesWorkShop. Saving to database ->', gwProducts?.length);
    console.log('Starting scrape for wargamesportal all factions...');
    const allProducts: { name: string; price: string; url: string; faction: string }[] = [];

    for (const { name, url } of wargameportalFactionLinks) {
      console.log(`Scraping ${name} from WarGamesPortal...`);
      const products = await scrapeWargamePortal(url, name);
      allProducts.push(...products);
    }

    console.log('Starting scrape for Amazon...');
    for (const { name } of factions) {
      console.log(`Scraping ${name} from Amazon...`);
      const amazonQuery = `Warhammer 40k ${name}`;
      const amazonProducts = await scrapeAmazon(amazonQuery);

      const formattedAmazonProducts = amazonProducts.map((product) => ({
        name: product.title || 'Unknown Product',
        price: product.totalPrice || '$0.00',
        url: product.url || '',
        faction: name,
      }));

      allProducts.push(...formattedAmazonProducts);
    }

    console.log('Scraping completed. Saving to database...');
    await saveScrapedData(
      allProducts.map((product) => {
        return {
          name: product.name,
          price: product.price,
          url: product.url,
          faction: product.faction,
        };
      }
      ));

    console.log('Scraping Completed', allProducts?.length, 'Items saved to database');

  } catch (error) {
    console.error('Error during scraping:', error);
  }
}

if (require.main === module) {
  runScrapingTask();
}
