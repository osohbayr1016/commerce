/**
 * Test: Set cart in localStorage, reload, verify cart is still there (not wiped to []).
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const CART_KEY = "cart:guest";

const sampleCart = [
  {
    id: "test-product-id",
    name: "Test Product",
    price: 10000,
    originalPrice: 12000,
    quantity: 1,
    slug: "test-product",
    brand: "Test",
  },
];

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(2000);

    await page.evaluate(
      ({ key, cart }) => {
        localStorage.setItem(key, JSON.stringify(cart));
      },
      { key: CART_KEY, cart: sampleCart },
    );

    const afterSet = await page.evaluate(
      (key) => localStorage.getItem(key),
      CART_KEY,
    );
    if (!afterSet || afterSet === "[]") {
      console.error("FAIL: Could not set cart in localStorage");
      process.exit(1);
    }
    console.log("Set cart in localStorage:", afterSet.substring(0, 80) + "...");

    await page.reload({ waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(3000);

    const afterReload = await page.evaluate(
      (key) => localStorage.getItem(key),
      CART_KEY,
    );
    const parsed = afterReload ? JSON.parse(afterReload) : [];
    const hasItems = Array.isArray(parsed) && parsed.length > 0;

    if (!hasItems) {
      console.error(
        "FAIL: After reload, cart was wiped. localStorage[cart:guest] =",
        afterReload,
      );
      process.exit(1);
    }

    console.log("PASS: Cart persisted after reload. Items:", parsed.length);
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();
