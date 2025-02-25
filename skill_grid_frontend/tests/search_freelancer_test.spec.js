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

  await expect(searchResults.nth(0)).toHaveText("Nima SherpaphotographerBouddha, KathmanduFrom Rs. 6300/hrwedding photographyevent photographyphotoshopimage editing+2 more");
});


