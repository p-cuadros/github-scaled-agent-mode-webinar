Feature: Supplier Management
  As a supply chain manager
  I want to manage supplier relationships
  So that I can ensure reliable sourcing of cat tech products

  Background:
    Given the OctoCAT supply chain system is running
    And there are existing suppliers in the system

  Scenario: View all suppliers
    When I navigate to the suppliers page
    Then I should see a list of all registered suppliers
    And each supplier should display their name, contact person, and email

  Scenario: Add a new supplier
    Given I am on the suppliers management page
    When I click "Add New Supplier"
    And I fill in the supplier details:
      | Field          | Value                           |
      | Name           | MeowTech Solutions             |
      | Description    | Innovative feline technology   |
      | Contact Person | Sarah Meowkowski               |
      | Email          | sarah@meowtech.com             |
      | Phone          | 555-0400                       |
    And I click "Save Supplier"
    Then the supplier should be added to the system
    And I should see a success message "Supplier added successfully"

  Scenario: Update supplier contact information
    Given I am viewing supplier "PurrTech Innovations"
    When I click "Edit Supplier"
    And I change the contact person from "Felix Whiskerton" to "Felix Whiskerton Jr."
    And I update the phone number to "555-0105"
    And I click "Update Supplier"
    Then the supplier information should be updated
    And I should see a confirmation message "Supplier updated successfully"

  Scenario: View supplier's products
    Given I am viewing supplier "WhiskerWare Systems"
    When I click "View Products"
    Then I should see all products supplied by WhiskerWare Systems
    And the products should include:
      | Product Name                  |
      | CatFlix Entertainment Portal  |
      | PawTrack Smart Collar         |
      | ScratchPad Pro                |
      | ChirpCam Window Mount         |
      | ZoomieTracker AI Mat          |

  Scenario: Remove a supplier
    Given I am viewing supplier "Test Supplier"
    And the supplier has no associated products
    When I click "Delete Supplier"
    And I confirm the deletion in the popup
    Then the supplier should be removed from the system
    And I should see a confirmation message "Supplier deleted successfully"

  Scenario: Attempt to remove supplier with active products
    Given I am viewing supplier "PurrTech Innovations"
    And the supplier has associated products
    When I click "Delete Supplier"
    Then I should see an error message "Cannot delete supplier with active products"
    And the supplier should remain in the system

  Scenario: Search suppliers by name
    Given I am on the suppliers page
    When I search for "WhiskerWare"
    Then I should see "WhiskerWare Systems" in the results
    And I should not see other suppliers in the results