import { CronJob } from 'cron';
import { factions } from './src/scrape/wargameportal/factions';
import { scrapeWargamePortal } from './src/scrape/wargameportal/scrapeWargamePortal';
import { scrapeGamesworkshop } from './src/scrape/scrapeGamesworkshop';
import { saveScrapedData } from './src/scrape/saveScrapedData';
import { Product } from './src/entities/Product';
import { AppDataSource } from './src/data-source';

async function runScrapingTask() {
  console.log('Running the scraping task...');
  try {
    
    await scrapeGamesworkshop();
    console.log('Starting scrape for wargamesportal all factions...');
    const allProducts: { name: string; price: string; url: string; faction?: string }[] = [];

    for (const { name, url } of factions) {
      console.log(`Scraping ${name}...`);
      const products = await scrapeWargamePortal(url, name);
      allProducts.push(...products);
    }

    console.log('Scraping completed:', allProducts);
    console.log('Scraping completed. Saving to database...');
    await saveScrapedData(
      allProducts.map((product) => ({
        ...product,
        faction: product.faction || '',
      }))
    );

  } catch (error) {
    console.error('Error during scraping:', error);
  }

}

AppDataSource.initialize()
  .then(async () => {
    console.log('Data Source Initialized');
    await runScrapingTask();

    const job = new CronJob('0 * * * *', runScrapingTask, null, true, 'America/Los_Angeles');
    job.start();
  })
  .catch((error) => {
    console.error('Error initializing data source:', error);
  });