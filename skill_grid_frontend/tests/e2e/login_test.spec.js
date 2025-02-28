import { test, expect } from '@playwright/test';

test('Should login and navigate to client dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    await page.fill('input[name="email"]', 'mirandasmith@gmail.com');
    await page.fill('input[name="password"]', 'Mirandasmith@123');

    const errorLocator = page.locator('.error-message');
    const errorMessage = await errorLocator.isVisible() ? await errorLocator.textContent() : null;
    if (errorMessage) {
        console.log('Login failed:', errorMessage);
        return; 
    }

    await page.click('button[type="submit"]');

    try {
        await page.waitForURL('http://localhost:5173/', { timeout: 10000 });
        console.log('Login successful!');
    } catch (error) {
        console.error('Login failed or took too long:', error);
    }

    await expect(page).toHaveURL('http://localhost:5173/');
});

test('Should login and navigate to freelancer dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/login');
    
    await page.fill('input[name="email"]', 'haileysummer@gmail.com');
    await page.fill('input[name="password"]', 'Haileysummer@123');

    const errorLocator = page.locator('.error-message');
    const errorMessage = await errorLocator.isVisible() ? await errorLocator.textContent() : null;
    if (errorMessage) {
        console.log('Login failed:', errorMessage);
        return; 
    }

    await page.click('button[type="submit"]');

    try {
        await page.waitForURL('http://localhost:5173/freelancer-dashboard', { timeout: 10000 });
        console.log('Login successful!');
    } catch (error) {
        console.error('Login failed or took too long:', error);
    }

    await expect(page).toHaveURL('http://localhost:5173/freelancer-dashboard');
});
