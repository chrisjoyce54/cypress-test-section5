declare namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Create several Todo items via UI
       * @example
       * cy.createDefaultTodos()
       */
        loginToApplication(): Chainable<void>
      /**
       * Creates one Todo using UI
       * @example
       * cy.createTodo('new item')
       */
      createTodo(title: string): Chainable<any>
    }
  }