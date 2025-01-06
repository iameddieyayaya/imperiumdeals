import puppeteer from 'puppeteer';
import { autoScroll } from '../autoscroll';

type Product = {
	name: string;
	price: string;
	url: string;
};

export async function scrapeWargamePortal(url: string, faction: string): Promise<Product[]> {
	const browser = await puppeteer.launch({ headless: true });
	const page = await browser.newPage();


	await page.goto(url, {
		waitUntil: 'domcontentloaded',
	});

	await page.setViewport({
		width: 1200,
		height: 800
	});
	await autoScroll(page);
	await page.waitForSelector('li.js-pagination-result');

	const products: Product[] = [];

	const scrapedProducts = await page.evaluate(() => {
		const productElements = Array.from(
			document.querySelectorAll('.card')
		);
		const products: Product[] = [];

		productElements.forEach((productElement) => {
			const name = productElement.querySelector('p.card__title a')?.textContent?.trim();
			const priceText = productElement.querySelector('.price__current')?.textContent?.trim();

			const price = priceText ? (parseFloat(priceText.replace(/[^\d.-]/g, '')) / 100).toFixed(2) : 'NaN';
			const url = "https://wargameportal.com/" + productElement.querySelector('a')?.getAttribute('href') || '';

			if (name && price !== 'NaN') {
				products.push({ name, price: `${price}`, url });
			}
		});

		return products;
	});

	products.push(...scrapedProducts);

	await browser.close();
	return products.map((product) => ({
		...product,
		faction,
	}));
}
