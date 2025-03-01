import { expect, test } from '@playwright/test';

test('Should enter email and navigate to verify-otp screen', async ({ page }) => {
    await page.goto('http://localhost:5173/email-for-otp');

    await page.fill('input[name="email"]', 'diadewan727@gmail.com');  

    await page.click('button[type="submit"]'); 

    try {
        await page.waitForURL('http://localhost:5173/otp-verification');
        console.log('Email sent!');
    } catch (error) {
        console.error('Failed or took too long:', error);
    }

    await expect(page).toHaveURL('http://localhost:5173/otp-verification');  
});

