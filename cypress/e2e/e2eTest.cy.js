// Monitor console warnings, errors, and logs
let consoleError;
let consoleWarning;
let consoleLog;


Cypress.on('window:before:load', (win) => {
  consoleError = cy.spy(win.console, 'error').log(false);
  consoleWarning = cy.spy(win.console, 'warn').log(false);
  consoleLog = cy.spy(win.console, 'log').log(false);
});
const DELAY = 1000;

describe('Basic Tests', () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit(`http://localhost:${Cypress.env('theport') || 8080}`)
  })
  it('has a title', () => {
    cy.get('header').first().should('include.text', 'Learn React')
  })

  afterEach(() => {
    // Confirm there are no console log/warning/errors after every test iteration.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(DELAY).then(() => {
      /* eslint-disable no-unused-expressions */
      if (consoleLog.callCount > 0) {
        throw new Error('YOU SHOULD NOT HAVE console.log() IN YOUR SUBMITTED CODE')
      }
      if (consoleError.callCount > 0) {
        throw new Error('ERRORS FOUND IN YOUR CODE! You need to fix them. Check the JS console in your application.')
      }
      if (consoleWarning.callCount > 0) {
        throw new Error('WARNINGS FOUND IN YOUR CODE! You need to address them. Check the JS console in your application.')
      }
    });
  });
})
