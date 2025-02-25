import { test, expect } from '@playwright/test';

test.describe('JoinClientFreelancer Component', () => {
  test('navigates to client-registration when "Apply as a Client" is clicked', async ({ page }) => {
    await page.goto('http://localhost:5173/join-client-freelancer');

    await page.click("text=I'm a client, hiring for a project");

    await page.click('button:has-text("Apply as a Client")');

    expect(page.url()).toBe('http://localhost:5173/client-registration');
  });

  test('navigates to freelancer-registration when "Apply as a Freelancer" is clicked', async ({ page }) => {
    await page.goto('http://localhost:5173/join-client-freelancer');

    await page.click("text=I'm a freelancer, looking for work");

    await page.click('button:has-text("Apply as a Freelancer")');

    expect(page.url()).toBe('http://localhost:5173/freelancer-registration');
  });

  test('button is disabled when no container is selected', async ({ page }) => {
    await page.goto('http://localhost:5173/join-client-freelancer');

    const button = await page.locator('button');
    await expect(button).toBeDisabled();
  });
});
