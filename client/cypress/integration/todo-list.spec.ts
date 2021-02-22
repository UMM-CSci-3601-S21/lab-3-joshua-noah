import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {
    // Filter for todo 'Blanche'
    cy.get('#todo-owner-input').type('Blanche');

    // All of the todo cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Blanche');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each($el =>
      expect($el.text()).to.equal('Blanche')
    );
  });

  it('Should type something in the category filter and check that it returned correct elements', () => {
    // Filter for category 'video games'
    cy.get('#todo-category-input').type('video games');

    // All of the todo cards should have the category we are filtering by
    page.getTodoCards().find('.todo-card-category').each($card => {
      cy.wrap($card).should('have.text', 'video games');
    });
  });

  it('Should type something partial in the category filter and check that it returned correct elements', () => {
    // Filter for companies that contain 'ti'
    cy.get('#todo-category-input').type('s');

    // Go through each of the cards that are being shown and get the companies
    page.getTodoCards().find('.todo-card-category')
      // We should see these companies
      .should('contain.text', 'software design')
      .should('contain.text', 'video games')
      .should('contain.text', 'groceries')
      // We shouldn't see these companies
      .should('not.contain.text', 'homework');
  });

  it('Should type something in the status filter and check that it returned correct elements', () => {
    // Filter for todos of status complete
    cy.get('#todo-status-input').type('complete');

    // Go through each of the cards that are being shown and get the names
    page.getTodoCards().find('.todo-card-owner')
      // We should see these todos whose age is 27
      .should('contain.text', 'Fry')
      .should('contain.text', 'Blanche')
      .should('contain.text', 'Barry')
      .should('contain.text', 'Workman')
      .should('contain.text', 'Dawn')
      .should('contain.text', 'Roberta');
  });

  it('Should select a sort attribute, and check that it returned correct elements', () => {
    // Sort by category;
    page.selectSort('owner');

    // Some of the todos should be listed
    page.getTodoCards().should('exist');
  });

  it('Should click view profile on a todo and go to the right URL', () => {
    page.getTodoCards().first().then((card) => {
      const firstTodoOwner = card.find('.todo-card-owner').text();
      const firstTodoCategory = card.find('.todo-card-category').text();

      // When the view profile button on the first todo card is clicked, the URL should have a valid mongo ID
      page.clickViewProfile(page.getTodoCards().first());

      // The URL should contain '/todos/' (note the ending slash) and '/todos/' should be followed by a mongo ID
      cy.url()
        .should('contain', '/todos/')
        .should('match', /.*\/todos\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name and company should be correct
      cy.get('.todo-card-owner').first().should('have.text', firstTodoOwner);
      cy.get('.todo-card-category').first().should('have.text', firstTodoCategory);
    });
   });

});
