/**
 * Test: Click "Сагслах" (Add to cart) on homepage, reload, verify cart still has item.
 */
import { chromium } from "playwright";

const BASE = "http://localhost:3000";
const CART_KEY = "cart:guest";

async function main() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(3000);

    const addBtn = page.getByRole("button", { name: /Сагслах/ }).first();
    const count = await addBtn.count();
    if (count === 0) {
      console.error("FAIL: No 'Сагслах' button found on page");
      process.exit(1);
    }

    await addBtn.click();
    await page.waitForTimeout(2000);

    const afterAdd = await page.evaluate(
      (key) => localStorage.getItem(key),
      CART_KEY,
    );
    const parsedAfter = afterAdd ? JSON.parse(afterAdd) : [];
    if (!Array.isArray(parsedAfter) || parsedAfter.length === 0) {
      console.error(
        "FAIL: After click, cart was empty. localStorage =",
        afterAdd,
      );
      process.exit(1);
    }
    console.log("After add: cart has", parsedAfter.length, "item(s)");

    await page.reload({ waitUntil: "domcontentloaded", timeout: 15000 });
    await page.waitForTimeout(3000);

    const afterReload = await page.evaluate(
      (key) => localStorage.getItem(key),
      CART_KEY,
    );
    const parsedReload = afterReload ? JSON.parse(afterReload) : [];
    if (!Array.isArray(parsedReload) || parsedReload.length === 0) {
      console.error(
        "FAIL: After reload, cart was wiped. localStorage =",
        afterReload,
      );
      process.exit(1);
    }

    console.log(
      "PASS: Add to cart -> reload -> cart still has",
      parsedReload.length,
      "item(s)",
    );
    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err.message);
    process.exit(1);
  } finally {
    if (browser) await browser.close();
  }
}

main();
