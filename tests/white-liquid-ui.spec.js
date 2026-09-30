import { test, expect } from '@playwright/test';

test('Clean Enterprise UI visual and interaction test', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('http://localhost:3000');

  // Verify Greeting & Hero
  await expect(page.locator('body')).toContainText('Good Morning, Serena!');
  await expect(page.locator('body')).toContainText('Your Daily Vitals');
  await expect(page.locator('body')).toContainText('My Wellness Journey');

  // Capture top hero with Golden Ratio layout (1.618 : 1)
  await page.screenshot({ path: 'screenshot-desktop-golden-ratio.png' });

  // Verify Loaded Rate Slider interaction
  const slider = page.locator('input[type="range"]').first();
  await slider.fill('120');

  // Verify calculation update
  await expect(page.getByText('$120/hr', { exact: true })).toBeVisible();

  // Test filter buttons
  await page.click('button:has-text("Sunset")');
  await page.waitForTimeout(300);

  // Take screenshot of filtered audit cards
  await page.screenshot({ path: 'screenshot-clean-enterprise-dashboard.png' });

  // Open the Guide Modal
  await page.click('button:has-text("Audit Guide")');
  await page.waitForSelector('text=Calendar Audit Documentation & Methodology');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot-clean-enterprise-guide.png' });
  await page.click('button:has-text("Close Documentation")');

  // Open the Schedule Impact Calculator
  await page.click('text=Schedule Impact Calculator');
  await page.waitForSelector('text=Series Title');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot-clean-enterprise-simulator.png' });

  // Open Slack Modal
  await page.click('button:has-text("Draft Notice")');
  await page.waitForSelector('text=Slack Notice Drafter');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot-clean-enterprise-slack.png' });
  await page.keyboard.press('Escape');

  // Navigate to Detail page
  await page.goto('http://localhost:3000/meetings/meet_mon_sync');
  await page.waitForSelector('text=Scoring Signal Breakdown');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot-clean-enterprise-detail.png', fullPage: true });

  // Mobile App Viewport Capture
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshot-serene-mobile-dashboard.png' });
});
