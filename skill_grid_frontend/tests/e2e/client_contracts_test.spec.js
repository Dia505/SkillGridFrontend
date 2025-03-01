import { expect, test } from '@playwright/test';

test.describe('Client Contracts', () => {
    const baseURL = 'http://localhost:5173';
    const appointmentList = [
        {
            project_duration: {
                value: 2,
                unit: "month"
            },
            _id: "67c328ed10173822762d49b4",
            appointment_purpose: "UI/UX revamp for NexusTech Solutions",
            appointment_date: "2025-03-16T00:00:00.000Z",
            project_end_date: "2025-05-16T00:00:00.000Z",
            status: true,
            freelancer_service_id: {
                _id: "67c2f701e9412641bdde1248",
                hourly_rate: 4500,
                service_id: {
                    _id: "67c2f701e9412641bdde1243",
                    service_name: "web design",
                    __v: 0
                },
                freelancer_id: {
                    _id: "67c2f675e9412641bdde123f",
                    first_name: "Hailey",
                    last_name: "Summer",
                    date_of_birth: "1997-12-25T00:00:00.000Z",
                    mobile_no: "9818232564",
                    email: "haileysummer@gmail.com",
                    password: "$2a$10$U/p9GRCb8Z3xwu8Rn/ahk.e8UNyy1oR57lKjANu.J6OsGNQQfjXTi",
                    address: "Pulchowk",
                    city: "Lalitpur",
                    bio: "I am a passionate UI/UX designer with a keen eye for aesthetics and a user-first approach, skilled in wireframing, prototyping, interaction design, user research, usability testing, accessibility principles, and design thinking. I have expertise in tools like Figma, Adobe XD, and Sketch, blending creativity with analytical problem-solving to craft seamless and user-friendly digital experiences.",
                    job_category: "design",
                    profession: "Ux/UI designer",
                    skills: "Wireframing, prototyping, user research, interaction design, usability testing, visual design, information architecture, design thinking",
                    years_of_experience: 7,
                    profile_picture: "http://localhost:3000/freelancer_images/fashion-industry-black-woman-designer-600nw-2235667567.jpg",
                    background_picture: "pompeii.jpg",
                    available: true,
                    role: "freelancer",
                    __v: 0
                },
                __v: 0
            },
            client_id: {
                _id: "67c2cf935cf2ec20a77a2cc3",
                first_name: "Miranda",
                last_name: "Smith",
                mobile_no: "9841353521",
                email: "mirandasmith@gmail.com",
                password: "$2a$10$4I/i2f4pxNi6BppGPJxfzepfeCMNaHhuyMmC5.Go0Lnr6/6IreO.6",
                city: "Lalitpur",
                profile_picture: "default_profile_img.png",
                role: "client",
                __v: 0
            },
            __v: 0
        }
    ]

    test('displays all contracts for a client', async ({ page }) => {
        // Intercept the API request and mock the response
        await page.route('http://localhost:3000/api/appointment/client/*', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(appointmentList),
            });
        });

        // Go to the client contracts page
        await page.goto(`${baseURL}/client-contracts`);

        // Wait for the contracts to be displayed
        await expect(page.locator('.grid .flex')).toHaveCount(5);

        // Check for freelancer names and other contract details
        await expect(page.locator('.text-purple-700.text-lg.font-bold')).toContainText('Hailey Summer');

    });

    test('Should update contract details', async ({ page }) => {
        await page.route('http://localhost:3000/api/appointment/client/*', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(appointmentList),
            });
        });
        await page.goto(`${baseURL}/client-contracts`);
        await expect(page.locator('.grid .flex')).toHaveCount(5);
        await page.click('button:has-text("✏️")');

        await expect(page.locator('form')).toBeVisible();

        await page.fill('input[name="appointment_purpose"]', 'test appointment');

        await page.click('button[type="submit"]');

        await expect(page.locator('text=Contract updated!')).toBeVisible(); 
    });

    test('Should delete contract', async ({ page }) => {
        page.on('dialog', dialog => dialog.accept());
        await page.route('http://localhost:3000/api/appointment/client/*', (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(appointmentList),
            });
        });
        await page.goto(`${baseURL}/client-contracts`);
        await expect(page.locator('.grid .flex')).toHaveCount(5);
        await page.click('button:has-text("🗑️")');
        
    });

});
