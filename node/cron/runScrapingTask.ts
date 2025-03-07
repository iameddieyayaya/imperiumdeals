import { wargameportalFactionLinks } from '../src/scrape/wargameportal/wargameportalFactionLinks';
import { factions } from '../factions'
import { AppDataSource } from '../src/data-source';

import { saveScrapedData } from '../src/scrape/saveScrapedData';
import { scrapeAmazon } from '../src/scrape/amazon/scrapeAmazon';
import { scrapeGamesworkshop } from '../src/scrape/scrapeGamesworkshop';
import { scrapeWargamePortal } from '../src/scrape/wargameportal/scrapeWargamePortal';
import { rougetradersLinks } from '../src/scrape/therougetraders/rougetradersLinks';
import { scrapeRogueTraders } from '../src/scrape/therougetraders/scrapeRogueTraders';

export async function runScrapingTask() {
  console.log('Running the scraping task...');
  try {

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const allProducts: { name: string; price: string; url: string; faction: string }[] = [];

    const gwProducts = await scrapeGamesworkshop();
    console.log('Scraping Completed -> GamesWorkShop. Saving to database ->', gwProducts?.length);
    console.log('Starting scrape for wargamesportal all factions...');


    for (const { name, url } of wargameportalFactionLinks) {
      console.log(`Scraping ${name} from WarGamesPortal...`);
      const products = await scrapeWargamePortal(url, name);
      allProducts.push(...products);
    }

    console.log('Starting scrape for Amazon...');
    for (const name of factions) {
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

    for (const { name, url } of rougetradersLinks) {
      console.log(`Scraping ${name} from RogueTraders...`);
      const products = await scrapeRogueTraders(url, name);
      allProducts.push(...products);
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
