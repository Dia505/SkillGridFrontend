import { expect, test } from '@playwright/test';

test('Should enter email and navigate to verify-otp screen', async ({ page }) => {
    await page.goto('http://localhost:5173/email-for-otp');

    await page.fill('input[name="email"]', 'test@example.com');  

    await page.click('button[type="submit"]'); 

    try {
        await page.waitForURL('http://localhost:5173/otp-verification');
        console.log('Email sent!');
    } catch (error) {
        console.error('Failed or took too long:', error);
    }

    await expect(page).toHaveURL('http://localhost:5173/otp-verification');  
});

// test('Should enter OTP and navigate to reset-password screen', async ({ page }) => {
//     const mockEmail = 'test@example.com';

//     await page.goto('http://localhost:5173/otp-verification', {
//         state: { email: mockEmail },
//     });

//     await page.fill('input[name="otp"]', "335943");  

//     await page.click('button[type="submit"]');

//     try {
//         await page.waitForURL('http://localhost:5173/reset-password', { timeout: 5000 }); 
//         console.log('OTP verified, navigation successful!');
//     } catch (error) {
//         console.error('OTP verification failed or took too long:', error);
//     }

//     await expect(page).toHaveURL('http://localhost:5173/reset-password');
// });

// test('Should enter password and navigate to login', async ({ page }) => {
//     const mockEmail = 'test@example.com';
//     const mockOtp = "437658";

//     await page.goto('http://localhost:5173/reset-password', {
//         state: { email: mockEmail, otp: mockOtp },
//     });

//     await page.fill('input[name="password"]', 'Password@123');  
//     await page.fill('input[name="confirmPassword"]', 'Password@123');  

//     await page.click('button[type="submit"]'); 

//     try {
//         await page.waitForURL('http://localhost:5173/login');
//         console.log('Password changed');
//     } catch (error) {
//         console.error('Failed or took too long:', error);
//     }

//     await expect(page).toHaveURL('http://localhost:5173/login');  
// });
