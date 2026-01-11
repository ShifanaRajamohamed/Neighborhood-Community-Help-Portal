/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email: string, password: string) => { })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { })

// Custom command to login
Cypress.Commands.add('login', (contactInfo: string, password: string) => {
  cy.session([contactInfo, password], () => {
    cy.visit('/login');
    cy.get('input[name="contact_info"]').type(contactInfo);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('not.include', '/login');
  });
});

// Custom command to register a user
Cypress.Commands.add('registerUser', (userData: {
  name: string;
  contact_info: string;
  email: string;
  location: string;
  role: string;
  password: string;
}) => {
  cy.visit('/register');
  cy.get('input[name="name"]').type(userData.name);
  cy.get('input[name="contact_info"]').type(userData.contact_info);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="location"]').type(userData.location);
  cy.get(`input[value="${userData.role}"]`).check();
  cy.get('input[name="password"]').type(userData.password);
  cy.get('button[type="submit"]').click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(contactInfo: string, password: string): Chainable<void>;
      registerUser(userData: {
        name: string;
        contact_info: string;
        email: string;
        location: string;
        role: string;
        password: string;
      }): Chainable<void>;
    }
  }
}
