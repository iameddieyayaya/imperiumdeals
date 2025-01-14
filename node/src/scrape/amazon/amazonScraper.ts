import puppeteer from 'puppeteer';

const searchAmazon = async (query: string) => {
  const AMAZON_URL = `https://www.amazon.com/s?k=warhammer+40k+${encodeURIComponent(query)}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();

  await page.goto(AMAZON_URL, { waitUntil: "domcontentloaded" });
  await page.setViewport({ width: 1200, height: 800 });

  const products = [];

  // Get product info
  const productElements = await page.$$('.s-title-instructions-style');

  await page.screenshot({ path: "example.png" })

  if (productElements.length > 0) {
    const productElement = productElements[0];
    const title = await productElement.$eval('h2', el => el?.textContent?.trim());
    const link = await productElement.$eval('a', el => el.href);
    // const test = await productElement?.$eval('.a-offscreen', el => el.textContent?.trim());
    // console.log({ test });

    let price = 0;
    let totalPrice = null;

    try {
      // Wait for the price element to be visible
      await productElement.waitForSelector('.a-section a-spacing-base', { visible: true });
      const priceElement = await productElement.waitForSelector('.a-offscreen', { visible: true });

      priceElement?.evaluate((el: any) => console.log({ "price ->": el }));



      if (priceElement) {
        // Extract the price text and clean it up
        totalPrice = await priceElement.evaluate(el => el.textContent?.trim());
        if (totalPrice) {
          price = parseFloat(totalPrice.replace('$', '').replace(',', '')) || 0;
        }
      } else {
        console.log("Price element not found.");
      }
    } catch (err) {
      console.error("Error extracting price:", err);
      price = 0;
    }

    products.push({ title, price, url: link, totalPrice });
    console.log({ title, price, url: link, totalPrice });
  }

  await browser.close();

  return products.length > 0 ? products[0] : null;
};

searchAmazon('Tyranids warriors');