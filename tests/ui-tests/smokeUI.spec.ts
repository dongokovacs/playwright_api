import {test, expect, request}  from '@playwright/test';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

test('Smoke UI test example', async ({ page }) => {
  await page.goto('/');
  
  await page.click('text=Sign in');
  await page.getByRole('textbox', { name: 'Email' }).fill(process.env.PROD_USERNAME!);
  await page.getByRole('textbox', { name: 'Password' }).fill(process.env.PROD_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.getByText('New Article').click();
  await page.getByRole('textbox',{name:'Article title'}).fill('Playwright is awesome');
  await page.getByRole('textbox',{name:'What\'s this article about?'}).fill('Test Article About');
  await page.getByRole('textbox',{name:'Write your article (in markdown)'}).fill('This is the content of the test article.');
  await page.getByRole('button',{name:'Publish Article'}).click();

  // Verify that the article was created successfully
  await page.getByText('Home').first().click();

  await page.getByText('Playwright is awesome').click({timeout:35000});

  await page.getByRole('button', { name: 'Delete Article' }).click();
  await page.getByText('Global Feed').click();
  await expect(page.locator('app-article-list h1').first()).not.toContainText('Playwright is awesome');
});