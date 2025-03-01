import { expect, test } from '@playwright/test';

test.describe('Client Profile Page', () => {
    const baseURL = 'http://localhost:5173';

    const mockedClientProfile = {
        _id: "67c2cf935cf2ec20a77a2cc3",
        first_name: "Miranda",
        last_name: "Smith",
        mobile_no: "9841353521",
        email: "mirandasmith@gmail.com",
        password: "$2a$10$4I/i2f4pxNi6BppGPJxfzepfeCMNaHhuyMmC5.Go0Lnr6/6IreO.6", 
        city: "Lalitpur",
        profile_picture: "http://localhost:3000/client_images/default_profile_img.png", 
        role: "client",
        __v: 0
    };
    
    test.beforeEach(async ({ page }) => {

        await page.route(`http://localhost:3000/api/client/*`, (route, request) => {
            console.log('Request URL:', request.url());
            route.fulfill({
                status: 200,
                body: JSON.stringify(mockedClientProfile),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        await page.goto(`${baseURL}/client-profile`);
    });

    test('Displays client details on client-profile page', async ({ page }) => {
        await expect(page.locator('p.text-grey-500:has-text("First name") >> + p.font-medium')).toHaveText('Miranda');
        await expect(page.locator('p.text-grey-500:has-text("Last name") >> + p.font-medium')).toHaveText('Smith');
        await expect(page.locator('p.text-grey-500:has-text("Mobile number") >> + p.font-medium')).toHaveText('9841353521');
        await expect(page.locator('p.text-grey-500:has-text("City") >> + p.font-medium')).toHaveText('Lalitpur');
        await expect(page.locator('p.text-grey-500:has-text("Email address") >> + p.font-medium')).toHaveText('mirandasmith@gmail.com');

        const profilePic = page.locator('img[src="http://localhost:3000/client_images/default_profile_img.png"]');
        await expect(profilePic).toBeVisible();
    });

    test('Should update client details', async ({ page }) => {
        await page.click('.flex.border-2.border-purple-400');  

        await expect(page.locator('form')).toBeVisible();

        await page.fill('input[name="first_name"]', 'John');
        await page.fill('input[name="last_name"]', 'Doe');
        await page.fill('input[name="mobile_no"]', '9812345678');
        await page.selectOption('select[name="city"]', { label: 'Kathmandu' });

        await page.click('button[type="submit"]');

        await expect(page.locator('text=Profile updated!')).toBeVisible(); 
    });

});
