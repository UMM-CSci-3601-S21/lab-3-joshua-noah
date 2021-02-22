export class TodoListPage {
  navigateTo() {
    return cy.visit('/todos');
  }

  getUrl() {
    return cy.url();
  }

  getTodoTitle() {
    return cy.get('.todo-list-title');
  }

  getTodoCards() {
    return cy.get('.todo-cards-container app-todo-card');
  }

  /**
   * Clicks the "view profile" button for the given user card.
   * Requires being in the "card" view.
   *
   * @param card The user card
   */
  clickViewProfile(card: Cypress.Chainable<JQuery<HTMLElement>>) {
    return card.find<HTMLButtonElement>('[data-test=viewProfileButton]').click();
  }

  /**
   * Selects a role to filter in the "Sort" selector.
   *
   * @param value The role *value* to select, this is what's found in the mat-option "value" attribute.
   */
  selectSort(value: string) {
    return cy.get('[data-test=todoSortSelect]').click().get(`mat-option[value="${value}"]`).click();
  }
}
