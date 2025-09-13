// ***********************************************
// This example commands.js shows you how to
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
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('getPOIs', (params = {}) => {
  return cy.request({
    method: 'GET',
    url: 'poi/',
    qs: { 
      key: Cypress.env('CYPRESS_X_API_KEY'),
      ...params
    }
  });
});

Cypress.Commands.add('getReferenceData', () => {
  return cy.request({
    method: 'GET',
    url: 'referencedata/',
    qs: { key: Cypress.env('CYPRESS_X_API_KEY') }
  });
});