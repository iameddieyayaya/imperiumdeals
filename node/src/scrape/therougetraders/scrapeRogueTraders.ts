import puppeteer from "puppeteer";
import { autoScroll } from "../autoscroll";
import { scraperAgs } from "../scraper-config";

type Product = {
	name: string;
	price: string;
	url: string;
	faction: string;
};

export async function scrapeRogueTraders(url: string, factionName: string): Promise<Product[]> {
	const browser = await puppeteer.launch({
		headless: true,
		args: scraperAgs,
	});
	const page = await browser.newPage();

	await page.goto(url, {
		waitUntil: 'networkidle2',
	});

	await page.setViewport({
		width: 1200,
		height: 800,
	});
	await autoScroll(page);

	try {
		const productList = await page.waitForSelector('li[data-hook="product-list-grid-item"]', {
			timeout: 30000,
		});
		if (!productList) {
			console.log("No products found");
			return [];
		}
	} catch (error) {
		console.error("Error waiting for product list:", error);
		return [];
	}

	const products: Product[] = [];

	const scrapedProducts = await page.evaluate((factionName) => {
		const productElements = Array.from(
			document.querySelectorAll('li[data-hook="product-list-grid-item"]')
		);
		const products: Product[] = [];

		productElements.forEach((productElement) => {
			const name = productElement.querySelector('[data-hook="product-item-name"]')?.textContent?.trim()
			const regularPrice = productElement.querySelector('[data-hook="product-item-price-before-discount"]')?.textContent?.trim();
			const salePrice = productElement.querySelector('[data-hook="product-item-price-to-pay"]')?.textContent?.trim();
			const price = salePrice || regularPrice || "NaN";
			const url = productElement.querySelector('a[data-hook="product-item-container"]')?.getAttribute("href") || "";

			if (name && (price !== "NaN")) {
				products.push({ name, price, url, faction: factionName });
			}
		});

		return products;
	}, factionName);

	products.push(...scrapedProducts);
	await browser.close();
	return products;
}