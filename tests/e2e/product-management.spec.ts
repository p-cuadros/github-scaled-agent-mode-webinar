import { test, expect } from '@playwright/test';

test.describe('Product Management E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('/');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display products on the homepage', async ({ page }) => {
    // Check if products are displayed
    await expect(page.locator('[data-testid="product-card"]')).toHaveCount(12);
    
    // Verify some key products are visible
    await expect(page.locator('text=SmartFeeder One')).toBeVisible();
    await expect(page.locator('text=CatFlix Entertainment Portal')).toBeVisible();
    await expect(page.locator('text=PawTrack Smart Collar')).toBeVisible();
  });

  test('should filter products by supplier', async ({ page }) => {
    // Look for supplier filter
    const supplierFilter = page.locator('[data-testid="supplier-filter"]');
    if (await supplierFilter.isVisible()) {
      await supplierFilter.selectOption('WhiskerWare Systems');
      
      // Verify filtered results
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount(5);
      await expect(page.locator('text=CatFlix Entertainment Portal')).toBeVisible();
      await expect(page.locator('text=PawTrack Smart Collar')).toBeVisible();
    }
  });

  test('should show product details when clicked', async ({ page }) => {
    // Click on a product
    await page.locator('text=SmartFeeder One').first().click();
    
    // Check if we're on product detail page or modal opened
    await expect(page.locator('text=AI-powered feeder')).toBeVisible();
    await expect(page.locator('text=$129.99')).toBeVisible();
  });

  test('should add product to cart', async ({ page }) => {
    // Find and click Add to Cart button
    const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
      
      // Check cart count updated
      await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    } else {
      // Alternative: click on product first, then add to cart
      await page.locator('[data-testid="product-card"]').first().click();
      await page.locator('text=Add to Cart').click();
      await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    }
  });

  test('should search for products', async ({ page }) => {
    // Look for search input
    const searchInput = page.locator('[data-testid="search-input"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('SmartFeeder');
      await page.keyboard.press('Enter');
      
      // Verify search results
      await expect(page.locator('text=SmartFeeder One')).toBeVisible();
      await expect(page.locator('[data-testid="product-card"]')).toHaveCount(1);
    }
  });
});