---
name: playwright
description: Use to test a web page or app the way a real user does - open it in a browser, click, type, check what appears, take screenshots - with Playwright (free). Use after building or changing any page, or when asked to test, screenshot or check the UI.
---

# Playwright: test like a user

Playwright drives a real browser (Chromium, Firefox, WebKit) to use the page as a person would.

## Setup

- In a cloud session Chromium and Playwright are pre-installed: `require('playwright')` works and `chromium.launch()` needs no options. Do not run `playwright install`.
- In a project that pins `@playwright/test`: `npm i -D @playwright/test` then `npx playwright install chromium` (skip the install in the cloud session; launch with `executablePath: '/opt/pw-browsers/chromium'` instead).

## Quick check (no test suite)

Write a short script in the scratchpad, not in the project:

```js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => m.type() === 'error' && errors.push(m.text()));
  await page.goto('file:///abs/path/index.html'); // or http://localhost:PORT
  await page.getByRole('button', { name: 'Send' }).click();
  await page.screenshot({ path: 'shot.png', fullPage: true });
  console.log(errors.length ? errors : 'no console errors');
  await browser.close();
})();
```

Then Read the screenshot and say what you saw. Check both phone (390 wide) and desktop (1280 wide), and RTL pages for Arabic/Kurdish text direction.

## Test suite

`tests/*.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
test('form sends', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Name').fill('Ahmed');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Thanks')).toBeVisible();
});
```

Run: `npx playwright test --trace off` (use `--trace on` only to debug one failing test).

## Rules

- Find elements by role, label or text (`getByRole`, `getByLabel`, `getByText`), not by CSS classes.
- Never use fixed `waitForTimeout`; rely on `expect(...)` auto-waiting.
- Report failures with the real output. Never say the UI works if you did not run it.
