import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';

const axe = async (page: Page) => {
  const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  expect(violations.map((v) => `${v.id}: ${v.nodes[0]?.target}`)).toEqual([]);
};

test('the page loads with no errors and passes axe', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Ladeira L1' })).toBeAttached();
  await axe(page);
  expect(errors).toEqual([]);
});

test('reduced motion reads the same and still passes axe', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('[data-h="dist"]')).toHaveText('372 m');
  await axe(page);
});

test('the climb slider rides the street', async ({ page }) => {
  await page.goto('/?motion=reduced');
  const slider = page.locator('[data-scrub]');
  await slider.focus();
  await page.keyboard.press('End');
  await expect(page.locator('[data-h="dist"]')).toHaveText('600 m');
  await expect(page.locator('[data-h="up"]')).toHaveText('+63 m');
  await page.keyboard.press('Home');
  await expect(page.locator('[data-h="grade"]')).toHaveText('4%');
});

test('a card opens and closes', async ({ page }) => {
  await page.goto('/?motion=reduced');
  const plus = page.locator('.card .plus').first();
  await plus.click();
  await expect(plus).toHaveAttribute('aria-expanded', 'true');
  await plus.click();
  await expect(plus).toHaveAttribute('aria-expanded', 'false');
});

test('every part of the anatomy can be selected', async ({ page }) => {
  await page.goto('/?motion=reduced');
  for (const id of ['motor', 'battery', 'gears', 'brakes', 'display', 'lights']) {
    await page.locator(`[data-part="${id}"]`).click();
    await expect(page.locator(`[data-detail="${id}"]`)).toBeVisible();
    await expect(page.locator(`[data-hot="${id}"]`)).toHaveAttribute('aria-pressed', 'true');
  }
});

test('the range follows mode, route and weight', async ({ page }) => {
  await page.goto('/?motion=reduced');
  await page.locator('[data-seg="mode"] [data-v="eco"]').click();
  await page.locator('[data-seg="route"] [data-v="flat"]').click();
  await expect(page.locator('[data-range-km]')).toHaveText('110km');
  await page.locator('[data-seg="mode"] [data-v="climb"]').click();
  await page.locator('[data-seg="route"] [data-v="steep"]').click();
  await expect(page.locator('[data-range-km]')).toHaveText('40km');
});

test('a reservation goes busy, then done, with the choices in the summary', async ({ page }) => {
  await page.goto('/?motion=reduced');
  await page.locator('[data-frame="step"]').click();
  await page.locator('[data-extra="lock"]').check();
  await expect(page.locator('[data-total]')).toHaveText('R$ 15.240');
  await page.locator('[data-reserve]').click();
  await expect(page.locator('[data-reserve]')).toBeDisabled();
  await expect(page.locator('[data-reserve]')).toContainText('Reserving…');
  await expect(page.locator('[data-view="done"]')).toBeVisible();
  await expect(page.locator('[data-done-summary]')).toContainText('step-through in Fog, size M, with folding lock');
  await axe(page);
});

test('a failed reservation keeps the choices and can be retried', async ({ page }) => {
  await page.goto('/?state=failed&motion=reduced');
  await expect(page.locator('[data-view="failed"]')).toBeVisible();
  await expect(page.getByText("Your card wasn't charged and your choices are kept.")).toBeVisible();
  await axe(page);
  await page.locator('[data-retry]').click();
  await expect(page.locator('[data-view="done"]')).toBeVisible();
});

test('a height outside our sizes says so and holds the reservation', async ({ page }) => {
  await page.goto('/?motion=reduced');
  await page.locator('[data-height]').focus();
  await page.keyboard.press('Home');
  await expect(page.locator('[data-hint]')).toContainText('Outside our sizes');
  await expect(page.locator('[data-reserve]')).toBeDisabled();
});

test('the newsletter rejects a bad address and accepts a good one', async ({ page }) => {
  await page.goto('/?motion=reduced');
  const email = page.locator('#news-email');
  await email.fill('maria@bh');
  await page.locator('[data-news] button').click();
  await expect(page.locator('[data-news-msg]')).toContainText("doesn't look like an email address");
  await expect(email).toHaveAttribute('aria-invalid', 'true');
  await email.fill('maria@ladeira.bike');
  await page.locator('[data-news] button').click();
  await expect(page.locator('[data-news-msg]')).toContainText("You're on the list");
});

test('a missing page shows the 404 with a way back', async ({ page }) => {
  const res = await page.goto('/no-such-street');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText("doesn't go");
  await expect(page.getByRole('link', { name: 'Back to the top' })).toHaveAttribute('href', '/');
  await axe(page);
});
