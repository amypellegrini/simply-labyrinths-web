import { expect, test } from '@playwright/test';

test('displays the title', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Simply Labyrinths' })).toBeVisible();
});

test('displays the game level', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('paragraph', { name: 'Level 1' })).toBeVisible();
});
