Feature: Product Management
  As a supply chain manager
  I want to manage cat tech products
  So that I can maintain inventory and provide the best cat tech solutions

  Background:
    Given the OctoCAT supply chain system is running
    And there are existing products in the catalog

  Scenario: View all products
    When I navigate to the products page
    Then I should see a list of all available cat tech products
    And each product should display its name, price, and supplier information

  Scenario: Add a new product
    Given I am on the products management page
    When I click "Add New Product"
    And I fill in the product details:
      | Field       | Value                    |
      | Name        | Smart Cat Door Pro       |
      | Description | AI-powered cat door      |
      | Price       | 299.99                   |
      | SKU         | CAT-DOOR-PRO-001        |
      | Supplier    | PurrTech Innovations     |
    And I click "Save Product"
    Then the product should be added to the catalog
    And I should see a success message "Product added successfully"

  Scenario: Update existing product price
    Given I am viewing the product "SmartFeeder One"
    When I click "Edit Product"
    And I change the price from "129.99" to "149.99"
    And I click "Update Product"
    Then the product price should be updated
    And I should see a confirmation message "Product updated successfully"

  Scenario: Search for products by supplier
    Given I am on the products page
    When I select "WhiskerWare Systems" from the supplier filter
    Then I should only see products from WhiskerWare Systems
    And the product count should match the filtered results

  Scenario: Remove a product from catalog
    Given I am viewing the product "Test Product"
    When I click "Delete Product"
    And I confirm the deletion in the popup
    Then the product should be removed from the catalog
    And I should see a confirmation message "Product deleted successfully"

  Scenario: View product details
    Given I am on the products page
    When I click on "CatFlix Entertainment Portal"
    Then I should see the detailed product information including:
      | Detail      | Expected Value                                                                  |
      | Name        | CatFlix Entertainment Portal                                                    |
      | Price       | $89.99                                                                         |
      | Description | On-demand laser shows, motion videos, and bird-watching streams - customized per cat using AI interest tracking. Think Netflix, but for felines. |
      | SKU         | CAT-FLIX-001                                                                   |
      | Supplier    | WhiskerWare Systems                                                            |