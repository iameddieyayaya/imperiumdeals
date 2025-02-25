import puppeteer from "puppeteer";
import { scraperAgs } from "../scraper-config";

export const searchAmazon = async (query: string) => {
  const AMAZON_URL = `https://www.amazon.com/s?k=warhammer+40k+${encodeURIComponent(query)}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: scraperAgs,
  });
  const page = await browser.newPage();

  await page.goto(AMAZON_URL, { waitUntil: "networkidle2" });
  await page.setViewport({ width: 1920, height: 1080 });

  const products = [];

  // Select first product container
  const productElement = await page.$(".s-title-instructions-style");
  if (productElement) {
    const title = await productElement.$eval("h2", (el) =>
      el?.textContent?.trim()
    );
    const link = await productElement.$eval("a", (el) => el.href);

    let price = 0;
    let totalPrice = null;

    try {
      const priceElement = await page.$(".a-price .a-offscreen");
      if (priceElement) {
        totalPrice = await priceElement.evaluate((el) => el.textContent?.trim());
        if (totalPrice) {
          price = parseFloat(totalPrice.replace("$", "").replace(",", "")) || 0;
        }
      } else {
        console.log("Price element not found.");
      }
    } catch (err) {
      console.error("Error extracting price:", err);
    }

    products.push({ title, price, url: link, totalPrice });
  }

  await browser.close();

  return products.length > 0 ? products[0] : null;
};