import test, { chromium } from "@playwright/test";

(async () => {
  const pathToExtension = require('path').join(__dirname, '../build');
  
  const userDataDir = '/tmp/test-user-data-dir';
  const browserContext = await chromium.launchPersistentContext(userDataDir,{
    headless: false,
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`
    ]
  });
  let [backgroundPage] = browserContext.backgroundPages();
  if (!backgroundPage)
    backgroundPage = await browserContext.waitForEvent('backgroundpage');

  test('test', async ({ page }) => {
    
    await backgroundPage.evaluate(()=>{
    // Test the background page as you would any other page.
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage((tabs[0].id) as number, { command: "iconClick" });
      });
    })

    await page.waitForTimeout(30000)
  })

  await browserContext.close();
  
})();

/*
import { test, expect } from '@playwright/test';

test('homepage has title and links to intro page', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);

  // create a locator
  const getStarted = page.getByRole('link', { name: 'Get started' });

  // Expect an attribute "to be strictly equal" to the value.
  await expect(getStarted).toHaveAttribute('href', '/docs/intro');

  // Click the get started link.
  await getStarted.click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
*/