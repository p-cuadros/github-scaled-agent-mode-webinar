Feature: Cart Functionality
  As a customer
  I want to add products to my cart and checkout
  So that I can purchase cat tech products for my feline friends

  Background:
    Given the OctoCAT store is accessible
    And there are products available for purchase

  Scenario: Add product to cart
    Given I am viewing the product "SmartFeeder One"
    When I click "Add to Cart"
    Then the product should be added to my cart
    And the cart icon should show "1" item
    And I should see a notification "Product added to cart"

  Scenario: View cart contents
    Given I have products in my cart
    When I click on the cart icon
    Then I should see the cart page
    And I should see all items I have added
    And each item should display:
      | Information | Example              |
      | Product Name| SmartFeeder One      |
      | Price       | $129.99              |
      | Quantity    | 1                    |
      | Subtotal    | $129.99              |

  Scenario: Update item quantity in cart
    Given I have "SmartFeeder One" in my cart with quantity 1
    When I am on the cart page
    And I increase the quantity to 2
    Then the quantity should update to 2
    And the subtotal should update to $259.98
    And the total should be recalculated

  Scenario: Remove item from cart
    Given I have "SmartFeeder One" in my cart
    When I am on the cart page
    And I click "Remove" next to the item
    Then the item should be removed from my cart
    And the cart should show "0" items
    And I should see "Your cart is empty"

  Scenario: Apply discount code
    Given I have products worth $200 in my cart
    When I am on the cart page
    And I enter discount code "MEOW25"
    And I click "Apply Discount"
    Then I should see a 25% discount applied
    And the total should be reduced to $150
    And I should see "Discount applied successfully"

  Scenario: Proceed to checkout
    Given I have products in my cart with total $129.99
    When I am on the cart page
    And I click "Proceed to Checkout"
    Then I should be redirected to the checkout page
    And I should see the order summary
    And the total should match my cart total

  Scenario: Empty cart checkout attempt
    Given my cart is empty
    When I click on the cart icon
    Then I should see "Your cart is empty"
    And the "Proceed to Checkout" button should be disabled
    And I should see a "Continue Shopping" button

  Scenario: Cart persistence across sessions
    Given I have products in my cart
    When I refresh the page
    Then my cart should still contain the same products
    And the cart count should remain the same