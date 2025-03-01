import { expect, test } from '@playwright/test';

test.describe('Freelancer Profile Page', () => {
    const baseURL = 'http://localhost:5173';

    const mockedFreelancer = {
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
    };

    test.beforeEach(async ({ page }) => {
        await page.route(`http://localhost:3000/api/freelancer/*`, (route) => {
            route.fulfill({
                status: 200,
                body: JSON.stringify(mockedFreelancer),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        });

        await page.goto(`${baseURL}/freelancer-profile`);
    });

    test('Displays freelancer details on freelancer-profile page', async ({ page }) => {
        await expect(page.locator('p.text-xl.font-bold')).toHaveText('Hailey Summer');

        await expect(page.locator('p.text-lg')).toHaveText('Ux/UI designer');

        const profilePic = page.locator('img[src="http://localhost:3000/freelancer_images/fashion-industry-black-woman-designer-600nw-2235667567.jpg"]');
        await expect(profilePic).toBeVisible();

        const backgroundPic = page.locator('img[src="http://localhost:3000/freelancer_images/pompeii.jpg"]');
        await expect(backgroundPic).toBeVisible();
    });

    test('Should update freelancer details', async ({ page }) => {
        await page.click('.flex.border-2.border-purple-400');

        await expect(page.locator('form')).toBeVisible();

        await page.fill('input[name="first_name"]', 'John');
        await page.fill('input[name="last_name"]', 'Doe');
        await page.fill('input[name="mobile_no"]', '9812345678');
        await page.selectOption('select[name="city"]', { label: 'Kathmandu' });
        await page.fill('input[name="profession"]', 'Profession test');
        await page.fill('input[name="skills"]', 'abc, def, ghi, jkl');

        await page.click('button[type="submit"]');

        await expect(page.locator('text=Profile updated!')).toBeVisible();
    });

});
