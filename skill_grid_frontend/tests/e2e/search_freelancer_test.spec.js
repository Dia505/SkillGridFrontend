import { test, expect } from '@playwright/test';

test('Freelancer Search Functionality', async ({ page }) => {
  const searchQuery = 'developer';

  await page.goto(`http://localhost:5173/search-freelancer/${searchQuery}`);

  const searchResults = page.locator('.search-result-item'); 
  await expect(searchResults).toHaveCount(1);
  await expect(searchResults.nth(0)).toHaveText("Peter ThompsonMobile app developerKalanki, KathmanduFrom Rs. 3000/hrfluttermongodbcassandrajavascript+1 more");
});

test('Freelancer Search Filtering by Location', async ({ page }) => {
  const searchQuery = 'photographer';
  const locationFilter = 'Kathmandu'; 

  await page.goto(`http://localhost:5173/search-freelancer/${searchQuery}`);

  const locationDropdown = page.locator('select[name="location"]');
  
  await locationDropdown.selectOption({ label: locationFilter });

  await page.waitForSelector('.search-result-item');

  const searchResults = page.locator('.search-result-item');
  
  await expect(searchResults).toHaveCount(1); 

  await expect(searchResults.nth(0)).toHaveText("Nima SherpaPhotographer/VideographerBouddha, KathmanduFrom Rs. 4500/hrwedding photographyevent photographyphotoshopimage editing+2 more");
});

test('Freelancer Search Filtering by Hourly Rate Range', async ({ page }) => {
  const searchQuery = 'photographer';

  await page.goto(`http://localhost:5173/search-freelancer/${searchQuery}`);

  await page.waitForSelector('.flex.flex-col.gap-4');

  const rate1000To2000Checkbox = page.locator('text=Rs. 1000 - Rs. 2000'); 

  await expect(rate1000To2000Checkbox).toBeVisible();

  await rate1000To2000Checkbox.click();

  await page.waitForSelector('.search-result-item'); 

  const searchResults = page.locator('.search-result-item');

  await expect(searchResults).toHaveCount(2); 

  const firstResultText = await searchResults.nth(0).textContent();
  expect(firstResultText).toContain("Billie SummerPhotographerKupondole, LalitpurFrom Rs. 2000/hrevent photographyphotoshopmagazine photoshoot");
});










