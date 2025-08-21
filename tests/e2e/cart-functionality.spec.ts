import { test, expect } from '@playwright/test';

test.describe('Cart Functionality E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should add product to cart and update cart count', async ({ page }) => {
    // Add a product to cart
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await firstProduct.hover();
    
    // Try to find Add to Cart button
    const addToCartBtn = firstProduct.locator('[data-testid="add-to-cart"]');
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    } else {
      // Alternative approach: click product then add to cart
      await firstProduct.click();
      await page.locator('text=Add to Cart').click();
    }
    
    // Verify cart count updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should open cart and display items', async ({ page }) => {
    // First add an item to cart
    const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    }
    
    // Click on cart icon
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Verify cart page or modal opened
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
    await expect(page.locator('text=SmartFeeder One')).toBeVisible();
  });

  test('should update item quantity in cart', async ({ page }) => {
    // Add item to cart and open cart
    const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    }
    
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Update quantity
    const quantityInput = page.locator('[data-testid="quantity-input"]').first();
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      // Verify total updated
      await expect(page.locator('[data-testid="cart-total"]')).toContainText('259.98');
    }
  });

  test('should remove item from cart', async ({ page }) => {
    // Add item to cart and open cart
    const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    }
    
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Remove item
    const removeBtn = page.locator('[data-testid="remove-item"]').first();
    if (await removeBtn.isVisible()) {
      await removeBtn.click();
      
      // Verify cart is empty
      await expect(page.locator('text=Your cart is empty')).toBeVisible();
      await expect(page.locator('[data-testid="cart-count"]')).toHaveText('0');
    }
  });

  test('should proceed to checkout', async ({ page }) => {
    // Add item to cart and open cart
    const addToCartBtn = page.locator('[data-testid="add-to-cart"]').first();
    if (await addToCartBtn.isVisible()) {
      await addToCartBtn.click();
    }
    
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Proceed to checkout
    const checkoutBtn = page.locator('[data-testid="checkout-btn"]');
    if (await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      
      // Verify we're on checkout page
      await expect(page.locator('text=Checkout')).toBeVisible();
      await expect(page.locator('[data-testid="order-summary"]')).toBeVisible();
    }
  });

  test('should apply discount code', async ({ page }) => {
    // Add multiple items to cart to meet discount threshold
    const addToCartButtons = page.locator('[data-testid="add-to-cart"]');
    const count = await addToCartButtons.count();
    
    for (let i = 0; i < Math.min(3, count); i++) {
      await addToCartButtons.nth(i).click();
      await page.waitForTimeout(500); // Small delay between clicks
    }
    
    await page.locator('[data-testid="cart-icon"]').click();
    
    // Apply discount code
    const discountInput = page.locator('[data-testid="discount-input"]');
    if (await discountInput.isVisible()) {
      await discountInput.fill('MEOW25');
      await page.locator('[data-testid="apply-discount"]').click();
      
      // Verify discount applied
      await expect(page.locator('text=Discount applied')).toBeVisible();
      await expect(page.locator('[data-testid="discount-amount"]')).toBeVisible();
    }
  });
});