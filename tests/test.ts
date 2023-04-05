import { expect, test } from '@playwright/test';

test('displays the title', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByRole('heading', { name: 'Simply Labyrinths' })).toBeVisible();
});

test('displays the game level', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText('Level 1')).toBeVisible();
});

test('displays the game instructions', async ({ page }) => {
	await page.goto('/');
	await expect(page.getByText(/Master the art of maze navigation/)).toBeVisible();
});
