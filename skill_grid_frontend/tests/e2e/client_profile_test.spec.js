import { expect, test } from '@playwright/test';

test.describe('Client Profile Page', () => {
    const baseURL = 'http://localhost:5173';
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiZnJlZWxhbmNlciIsInVzZXJJZCI6IjY3YmY3MTYxM2VjM2RkODljNjgxODEyYiIsImlhdCI6MTc0MDU5OTY0OSwiZXhwIjoxNzQwNjAzMjQ5fQ.9gjLxeTCuNwrtfOqdu3o3ZLs7A0RD10wibWhi5KZV1M';
    const userId = '67c069834bc5814f9ee9caed';
    const role = 'client';

    // Mock client profile data
    const mockedClientProfile = {
        first_name: 'Miranda',
        last_name: 'Smith',
        mobile_no: '9818334387',
        city: 'Kathmandu',
        email: 'mirandasmith@gmail.com',
        profile_picture: 'profile.jpg',
    };

    test.beforeEach(async ({ page }) => {
        // Mock authentication using localStorage
        await page.addInitScript((token, id, role) => {
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', id);
            localStorage.setItem('role', role);
        }, authToken, userId, role);

        // Reload the page to ensure the page re-reads localStorage
        await page.reload();

        // Intercept the request to the client profile API and return mocked data
        await page.route(`http://localhost:3000/api/client/${userId}`, (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(mockedClientProfile),
            });
        });

        await page.goto(`${baseURL}/client-profile`);
    });

    test('Redirects to login if no auth token', async ({ page }) => {
        // Clear localStorage to simulate an unauthenticated user
        await page.evaluate(() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
        });

        await page.goto(`${baseURL}/client-profile`);

        // Expect redirect to login page
        await expect(page).toHaveURL(`${baseURL}/login`);
    });
});
