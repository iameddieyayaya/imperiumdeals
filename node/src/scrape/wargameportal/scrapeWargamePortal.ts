import puppeteer from 'puppeteer';
import { autoScroll } from '../autoscroll';
import { scraperAgs } from '../scraper-config';

type Product = {
	name: string;
	price: string;
	url: string;
	faction: string;
};

export async function scrapeWargamePortal(url: string, factionName: string): Promise<Product[]> {
	const browser = await puppeteer.launch({
		headless: true,
		args: scraperAgs
	});
	const page = await browser.newPage();

	await page.goto(url, {
		waitUntil: 'domcontentloaded',
	});

	await page.setViewport({
		width: 1200,
		height: 800,
	});
	await autoScroll(page);

	try {
		const productList = await page.waitForSelector('li.js-pagination-result', { timeout: 30000 });
		if (!productList) {
			console.log('No products found');
			return [];
		}
	} catch (error) {
		console.error('Error waiting for pagination results:', error);
		return [];
	}

	const products: Product[] = [];

	const scrapedProducts = await page.evaluate((factionName) => {
		const productElements = Array.from(document.querySelectorAll('.card'));
		const products: Product[] = [];

		productElements.forEach((productElement) => {
			const name = productElement.querySelector('p.card__title a')?.textContent?.trim();
			const priceText = productElement.querySelector('.price__current')?.textContent?.trim();

			const price = priceText ? (parseFloat(priceText.replace(/[^\d.-]/g, '')) / 100).toFixed(2) : 'NaN';
			const url = "https://wargameportal.com/" + productElement.querySelector('a')?.getAttribute('href') || '';

			if (name && price !== 'NaN') {
				products.push({ name, price: `${price}`, url, faction: factionName });
			}
		});

		return products;
	}, factionName);

	products.push(...scrapedProducts);

	await browser.close();
	return products.map((product) => ({
		...product,
	}));
}