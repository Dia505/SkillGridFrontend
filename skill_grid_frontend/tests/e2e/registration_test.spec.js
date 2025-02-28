import { expect, test } from '@playwright/test';

test('Should register client and navigate to dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/client-registration');

    // Fill in the form fields
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'Abc');
    await page.fill('input[name="mobile_no"]', '9818223344');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password@123');

    // Check if the city dropdown has a default option
    const cityDropdown = page.locator('select[name="city"]');
    await expect(cityDropdown).toHaveValue(''); 

    const termsCheckbox = page.locator('input[name="terms"]');

    // Test case: Select a valid city and submit the form
    await page.selectOption('select[name="city"]', { value: 'Kathmandu' }); 
    await termsCheckbox.check();   

    await page.click('button[type="submit"]');  // Submit the form

    try {
        await page.waitForURL('http://localhost:5173/login', { timeout: 15000 });
        console.log('Registration successful!');
    } catch (error) {
        console.error('Registration failed or took too long:', error);
    }

    // Ensure the registration was successful
    await expect(page).toHaveURL('http://localhost:5173/login');  // Check for success URL
});

test('Should register freelancer and navigate to build your profile', async ({ page }) => {
    await page.goto('http://localhost:5173/freelancer-registration');

    // Fill in the form fields
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'Abc');
    await page.fill('input[name="date_of_birth"]', '1990-01-01');
    await page.fill('input[name="address"]', 'testAddress')
    await page.fill('input[name="mobile_no"]', '9818223344');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'Password@123');

    // Check if the city dropdown has a default option
    const cityDropdown = page.locator('select[name="city"]');
    await expect(cityDropdown).toHaveValue(''); 

    const termsCheckbox = page.locator('input[name="terms"]');

    // Test case: Select a valid city and submit the form
    await page.selectOption('select[name="city"]', { value: 'Kathmandu' }); 
    await termsCheckbox.check();   

    await page.click('button[type="submit"]');  // Submit the form

    try {
        await page.waitForURL('http://localhost:5173/build-your-profile', { timeout: 15000 });
        console.log('Registration successful!');
    } catch (error) {
        console.error('Registration failed or took too long:', error);
    }

    // Ensure the registration was successful
    await expect(page).toHaveURL('http://localhost:5173/build-your-profile');  // Check for success URL
});
